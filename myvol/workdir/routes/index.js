var express = require('express');
var router = express.Router();
var isAuthenticated = require('./isAuthenticated');
const Items = require('../models/items');

/* GET home page. */
router.get('/', function (req, res, next) {
  // console.log('::user::' + JSON.stringify(req.user));
  if (req.user) {
    Items.findAll({
      attributes: ['id', 'name', 'comment', 'createdBy'],
      where: {
        valid: 1
      },
      order: [['createdAt', 'DESC']]
    }).then((items) => {
      res.render('index', { title: 'Express', items: items, user: req.user });
    });
  } else {
    res.render('index', { title: 'Express' });
  }
});

module.exports = router;
