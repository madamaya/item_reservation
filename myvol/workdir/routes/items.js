var express = require('express');
var router = express.Router();
var isAuthenticated = require('./isAuthenticated');
const title = require('./title');
const loader = require('../models/sequelize-loader');
const Sequelize = loader.Sequelize;
const Op = Sequelize.Op;
const Items = require('../models/items');
const Reservation = require('../models/reservation');
const uuid = require('uuid');
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

/* GET home page. */
router.get('/new', isAuthenticated, csrfProtection, function (req, res, next) {
  res.render('new', { title, userId: req.user.id, user: req.user, csrfToken: req.csrfToken() });
});

router.get('/:id/edit', isAuthenticated, csrfProtection, function (req, res, next) {
  Items.findOne({
    where: {
      id: req.params.id
    }
  }).then((item) => {
    res.render('edit', { title, id: item.id, name: item.name, comment: item.comment, user: req.user, csrfToken: req.csrfToken() });
  });
});

router.post('/reservate', isAuthenticated, csrfProtection, function (req, res, next) {
  console.log('hogeho');
  const itemId = req.body.itemId;
  const displayStartTime = req.body.displayStartTime;
  const displayEndTime = req.body.displayEndTime;
  console.log('===========================');
  console.log(itemId);
  console.log(displayStartTime);
  console.log(displayEndTime);
  Reservation.findAll({
    attributes: ['startTime', 'endTime'],
    where: {
      [Op.and]: [
        {
          itemId:
            itemId
        },
        {
          [Op.or]: [
            {
              [Op.and]: [{
                startTime: {
                  [Op.gte]: displayStartTime
                }
              },
              {
                startTime: {
                  [Op.lt]: displayEndTime
                }
              }]
            },
            {
              [Op.and]: [{
                endTime: {
                  [Op.gt]: displayStartTime
                }
              },
              {
                endTime: {
                  [Op.lte]: displayEndTime
                }
              }]
            },
          ]
        },
        {
          valid: 1
        }
      ]
    }
  }).then((reservations) => {
    res.json({ reservations });
  });
});

router.post('/:id', isAuthenticated, csrfProtection, function (req, res, next) {
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

router.post('/:id/delete', isAuthenticated, csrfProtection, function (req, res, next) {
  const id = req.params.id;
  Items.update({ valid: 0 }, {
    where: {
      id: id
    }
  }).then(() => { });
  res.redirect('/');
});

router.get('/:id/reservate', isAuthenticated, csrfProtection, function (req, res, next) {
  const today = new Date(new Date().getTime() + 9 * 60 * 60 * 1000);
  const displayDay = ('0000' + today.getFullYear()).slice(-4) + '-' + ('00' + (today.getMonth() + 1)).slice(-2) + '-' + ('00' + today.getDate()).slice(-2) + ' ' + ('00' + today.getHours()).slice(-2);
  Items.findOne({
    where: {
      id: req.params.id
    }
  }).then((item) => {
    res.render('reservate', { title, user: req.user, item: item, displayDay, csrfToken: req.csrfToken() });
  });
});




router.post('/reservate/:reservationId/delete', isAuthenticated, csrfProtection, function (req, res, next) {
  const reservationId = req.params.reservationId;
  Reservation.update({ valid: 0 }, {
    where: {
      reservationId
    }
  }).then(() => {
    const redTo = `/users/`;
    console.log('redTo=' + redTo);
    res.redirect(redTo);
  });
});

function noDuplicationTime(itemId, st, ed) {
  return new Promise((resolve, reject) => {
    const loader = require('../models/sequelize-loader');
    const Sequelize = loader.Sequelize;
    const Op = Sequelize.Op;
    Reservation.findAll({
      where: {
        [Op.and]: [
          {
            itemId: itemId
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
        resolve(true);
      }
      else {
        resolve(false);
      }
    });
  });
}

router.post('/:id/reservate', isAuthenticated, csrfProtection, function (req, res, next) {
  const resId = uuid.v4();
  const stTime = req.body.startDate + ' ' + ('00' + req.body.startTime).slice(-2) + ':' + ('00' + req.body.startMin).slice(-2) + ':00';
  const edTime = req.body.endDate + ' ' + ('00' + req.body.endTime).slice(-2) + ':' + ('00' + req.body.endMin).slice(-2) + ':00';

  Promise.all([noDuplicationTime(req.params.id, stTime, edTime)]).then((flag) => {
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
        console.log('complete!' + flag[0]);
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
});

router.post('/', isAuthenticated, csrfProtection, function (req, res, next) {
  const id = uuid.v4();
  // console.log(req.body);
  Items.create({
    id: id,
    name: req.body.name,
    comment: req.body.comment,
    createdAt: new Date(new Date().getTime() + 9 * 60 * 60 * 1000),
    createdBy: req.body.userId,
    valid: 1
  }).then(() => {
    res.redirect('/');
  });
});

router.post('/:id/reservate/check', isAuthenticated, csrfProtection, function (req, res, next) {
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
        },
        {
          valid: 1
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
