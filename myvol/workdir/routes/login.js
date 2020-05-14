var express = require('express');
var router = express.Router();
var passport = require('passport');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('login');
});

router.post('/',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
  }), function (req, res, next) {
  });


module.exports = router;
