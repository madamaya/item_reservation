var express = require('express');
var router = express.Router();
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

router.get('/:id/delete', function (req, res, next) {
  const id = req.params.id;
  Items.update({ valid: 0 }, {
    where: {
      id: id
    }
  }).then(() => { });
  res.redirect('/');
});

router.post('/', function (req, res, next) {
  const id = req.body.id || uuid.v4();
  Items.upsert({
    id: id,
    name: req.body.name,
    comment: req.body.comment,
    createdAt: new Date(),
    valid: 1
  }).then(() => {
    res.redirect('/');
  });
});

module.exports = router;
