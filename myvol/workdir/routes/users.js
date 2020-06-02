const express = require('express');
const router = express.Router();
const isAuthenticated = require('./isAuthenticated');
const loader = require('../models/sequelize-loader');
const Sequelize = loader.Sequelize;
const Op = Sequelize.Op;
const Items = require('../models/items');
const Reservation = require('../models/reservation');
const User = require('../models/user');
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });
const title = require('./title');


/* GET home page. */
router.get('/', isAuthenticated, csrfProtection, function (req, res, next) {
  // req.params.userIdとログインしている人が同一か判定
  console.log('req.user=' + JSON.stringify(req.user));
  // if (parseInt(req.params.userId) !== req.user.id) {
  // const err = new Error('予期しないアクセスです');
  // err.status = 400;
  // next(err);
  // }

  const nowTime = new Date(new Date().getTime() + 9 * 60 * 60 * 1000);
  const convNow = ('0000' + nowTime.getFullYear()).slice(-4) + '-' + ('00' + (nowTime.getMonth() + 1)).slice(-2) + '-' + ('00' + nowTime.getDate()).slice(-2) + ' ' + ('00' + nowTime.getHours()).slice(-2) + ':' + ('00' + nowTime.getMinutes()).slice(-2) + ':' + ('00' + nowTime.getSeconds()).slice(-2);
  Reservation.findAll({
    where: {
      [Op.and]: [
        {
          reservedBy: req.user.id

        },
        {
          endTime: {
            [Op.gte]: convNow
          }
        },
        {
          valid: 1
        }
      ]
    },
    order: [['startTime', 'ASC']]
  })
    .then((reservations) => {
      Items.findAll({
        attributes: ['id', 'name', 'comment']
      })
        .then((items) => {
          const mp_id_name = new Map();
          const mp_id_comment = new Map();
          for (let i = 0; i < items.length; i++) {
            mp_id_name.set(items[i].id, items[i].name);
            mp_id_comment.set(items[i].id, items[i].comment);
          }

          for (let i = 0; i < reservations.length; i++) {
            reservations[i].itemName = mp_id_name.get(reservations[i].itemId);
            reservations[i].comment = mp_id_comment.get(reservations[i].itemId);
          }
          // reservations.mp = mp;
          console.log('reservations::' + JSON.stringify(reservations));
          res.render('userReservation', { title, user: req.user, reservations, csrfToken: req.csrfToken() });
          // res.redirect('/');
        });
    });

});


router.get('/append', isAuthenticated, csrfProtection, function (req, res, next) {
  res.render('append_user', { title, user: req.user, csrfToken: req.csrfToken() });
});

router.get('/delete', isAuthenticated, csrfProtection, function (req, res, next) {
  res.render('delete_user', { title, user: req.user, csrfToken: req.csrfToken() });
});

router.post('/append', isAuthenticated, csrfProtection, function (req, res, next) {
  const crypto = require('crypto');
  const hash = crypto.createHash('sha256');
  const name = req.body.name;
  const pass = hash.update(req.body.pass).digest('hex');
  console.log('name=' + name + ', pass=' + pass);
  User.create({ name, password: pass }).then(() => { });
  res.redirect('/');
});

router.post('/delete', isAuthenticated, csrfProtection, function (req, res, next) {
  const name = req.body.name;
  console.log('name=' + name);
  if (name !== 'admin' && name !== 'user1' && name !== 'user2') {
    User.findOne({
      where: {
        name
      }
    }).then((user) => user.destroy());
  }
  res.redirect('/');
});

module.exports = router;
