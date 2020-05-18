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
