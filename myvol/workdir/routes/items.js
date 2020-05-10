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

router.post('/', function (req, res, next) {
  const id = uuid.v4();
  const date = new Date();
  console.log(new Date());
  Items.create({
    id: id,
    name: req.body.name,
    comment: req.body.comment,
    createdAt: new Date(new Date().getTime() + 9 * 60 * 60 * 1000),
    valid: 1
  }).then(() => {
    res.redirect('/');
  });
});

module.exports = router;
