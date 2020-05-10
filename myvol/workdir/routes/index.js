var express = require('express');
var router = express.Router();
const Items = require('../models/items');

/* GET home page. */
router.get('/', function (req, res, next) {
  Items.findAll({
    attributes: ['id', 'name', 'comment'],
    where: {
      valid: 1
    },
    order: [['createdAt', 'DESC']]
  }).then((items) => {
    res.render('index', { title: 'Express', items: items });
  });
});

module.exports = router;
