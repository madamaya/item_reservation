var express = require('express');
var router = express.Router();
var isAuthenticated = require('./isAuthenticated');
const loader = require('../models/sequelize-loader');
const Sequelize = loader.Sequelize;
const Op = Sequelize.Op;
const Items = require('../models/items');
const Reservation = require('../models/reservation');
const uuid = require('uuid');

/* GET home page. */
router.get('/new', isAuthenticated, function (req, res, next) {
  res.render('new');
});

router.get('/:id/edit', isAuthenticated, function (req, res, next) {
  Items.findOne({
    where: {
      id: req.params.id
    }
  }).then((item) => {
    res.render('edit', { id: item.id, name: item.name, comment: item.comment, user: req.user });
  });
});

router.post('/:id', isAuthenticated, function (req, res, next) {
  Items.upsert({
    id: req.params.id,
    name: req.body.name,
    comment: req.body.comment,
    createdAt: new Date(new Date().getTime() + 9 * 60 * 60 * 1000),
    valid: 1
  }).then(() => {
    res.redirect('/');
  });
});

router.get('/:id/delete', isAuthenticated, function (req, res, next) {
  const id = req.params.id;
  Items.update({ valid: 0 }, {
    where: {
      id: id
    }
  }).then(() => { });
  res.redirect('/');
});

router.get('/:id/reservate', isAuthenticated, function (req, res, next) {
  res.render('reservate', { user: req.user, itemId: req.params.id });
});

async function noDuplicationTime(itemId, st, ed) {
  const loader = require('../models/sequelize-loader');
  const Sequelize = loader.Sequelize;
  const Op = Sequelize.Op;
  Reservation.findAll({
    where: {
      [Op.and]: [
        {
          itemId: {
            itemId
          }
        },
        {
          startTime: {
            [Op.lt]: ed
          }
        },
        {
          endTime: {
            [Op.gt]: st
          }
        }
      ]
    }
  }).then((reservations) => {
    console.log('reservations=' + JSON.stringify(reservations) + ',' + reservations.length);

    if (reservations.length === 0) {
      return true;
    }
    else {
      return false;
    }
  });
}

router.post('/:id/reservate', isAuthenticated, function (req, res, next) {
  const resId = uuid.v4();
  const stTime = req.body.startDate + ' ' + ('00' + req.body.startTime).slice(-2) + ':' + ('00' + req.body.startMin).slice(-2) + ':00';
  const edTime = req.body.endDate + ' ' + ('00' + req.body.endTime).slice(-2) + ':' + ('00' + req.body.endMin).slice(-2) + ':00';

  var flag = noDuplicationTime(req.params.id, stTime, edTime);
  console.log('flag=' + flag);
  if (flag) {
    // console.log(stTime);
    // console.log(edTime);
    // console.log('req.params.id=' + req.params.id);
    // console.log('startTime=' + stTime);
    // console.log('endTime=' + edTime);
    // console.log('reservedBy=' + req.body.userId);
    // console.log('valid=' + 1);
    Reservation.create({
      reservationId: resId,
      itemId: req.params.id,
      startTime: stTime,
      endTime: edTime,
      reservedBy: req.body.userId,
      valid: 1
    }).then((err) => {
      console.log(err);
      // 予約完了ページに遷移
      console.log('complete!');
      res.redirect('/');
    });
  }
  else {
    // 予約失敗ページに遷移
    console.log('failed!')
    res.redirect('/');
  }

  // res.redirect('/');
})

router.post('/', isAuthenticated, function (req, res, next) {
  const id = uuid.v4();
  const date = new Date();
  // console.log(req.body);
  Reservation.create({
    id: id,
    name: req.body.name,
    comment: req.body.comment,
    createdAt: new Date(new Date().getTime() + 9 * 60 * 60 * 1000),
    valid: 1
  }).then(() => {
    res.redirect('/');
  });
});


router.post('/:id/reservate/check', isAuthenticated, function (req, res, next) {
  const itemId = req.params.id;
  const st = req.body.startDate + ' ' + ('00' + req.body.startTime).slice(-2) + ':' + ('00' + req.body.startMin).slice(-2) + ':00';
  const ed = req.body.endDate + ' ' + ('00' + req.body.endTime).slice(-2) + ':' + ('00' + req.body.endMin).slice(-2) + ':00';
  Reservation.findAll({
    where: {
      [Op.and]: [
        {
          itemId:
            itemId
        },
        {
          startTime: {
            [Op.lt]: ed
          }
        },
        {
          endTime: {
            [Op.gt]: st
          }
        }
      ]
    }
  }).then((reservations) => {
    if (reservations.length === 0) {
      console.log('check::return true');
      res.json({ return: true });
    }
    else {
      console.log('check::return false');
      res.json({ return: false });
    }
  });
});


module.exports = router;
