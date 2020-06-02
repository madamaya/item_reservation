var express = require('express');
var router = express.Router();
var isAuthenticated = require('./isAuthenticated');
const Users = require('../models/user');
const Items = require('../models/items');
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });
const title = require('./title');

/* GET home page. */
router.get('/', csrfProtection, function (req, res, next) {
  // console.log('::user::' + JSON.stringify(req.user));
  // Users.bulkCreate([
  //   { name: 'admin', password: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918' },
  //   { name: 'user1', password: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8' },
  //   { name: 'user2', password: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8' }
  // ]).then(() => { });
  if (req.user) {
    Items.findAll({
      attributes: ['id', 'name', 'comment', 'createdBy'],
      where: {
        valid: 1
      },
      order: [['createdAt', 'DESC']]
    }).then((items) => {
      res.render('index', { title, items: items, user: req.user, csrfToken: req.csrfToken() });
    });
  } else {
    res.render('index', { title });
  }
});

module.exports = router;
