var express = require('express');
var router = express.Router();
<<<<<<< Updated upstream
=======
var isAuthenticated = require('./isAuthenticated');
const loader = require('../models/sequelize-loader');
const Sequelize = loader.Sequelize;
const Op = Sequelize.Op;
>>>>>>> Stashed changes
const Items = require('../models/items');
const uuid = require('uuid');

/* GET home page. */
router.get('/new', function (req, res, next) {
  res.render('new');
});

router.get('/:id/edit', function (req, res, next) {
  Items.findOne({
    where: {
      id: req.params.id
    }
  }).then((item) => {
    res.render('edit', { id: item.id, name: item.name, comment: item.comment });
  });
});

router.post('/:id', function (req, res, next) {
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

router.get('/:id/delete', function (req, res, next) {
  const id = req.params.id;
  Items.update({ valid: 0 }, {
    where: {
      id: id
    }
  }).then(() => { });
  res.redirect('/');
});

router.get('/:id/reservate', function (req, res, next) {
  res.render('reservate');
});

<<<<<<< Updated upstream
router.post('/', function (req, res, next) {
  const id = uuid.v4();
  const date = new Date();
  // console.log(req.body);
  Items.create({
=======
async function noDuplicationTime(itemId, st, ed) {
  return new Promise((resolve, reject) => {
    const loader = require('../models/sequelize-loader');
    const Sequelize = loader.Sequelize;
    const Op = Sequelize.Op;
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
      console.log('reservations=' + JSON.stringify(reservations) + ',' + reservations.length);

      if (reservations.length === 0) {
        console.log('return true');
        resolve(true);
      }
      else {
        console.log('return false');
        resolve(false);
      }
    });
  });
}

router.post('/:id/reservate', isAuthenticated, function (req, res, next) {
  const resId = uuid.v4();
  const stTime = req.body.startDate + ' ' + ('00' + req.body.startTime).slice(-2) + ':' + ('00' + req.body.startMin).slice(-2) + ':00';
  const edTime = req.body.endDate + ' ' + ('00' + req.body.endTime).slice(-2) + ':' + ('00' + req.body.endMin).slice(-2) + ':00';

  var dupCheck = noDuplicationTime(req.params.id, stTime, edTime);
  console.log('dupCheck=' + dupCheck);
  Promise.all([dupCheck]).then((flag) => {
    if (flag[0]) {
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
  });
  // res.redirect('/');
})

router.post('/', isAuthenticated, function (req, res, next) {
  const id = uuid.v4();
  const date = new Date();
  Reservation.create({
>>>>>>> Stashed changes
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
