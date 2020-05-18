var express = require('express');
var router = express.Router();
var passport = require('passport');
const title = require('./title');

/* GET home page. */
router.get('/', function (req, res, next) {
  const from = req.query.from;
  if (from) {
    res.cookie('loginFrom', from, { expires: new Date(Date.now() + 600000) });
  }
  res.render('login', { title });
});

router.post('/',
  passport.authenticate('local', {
    failureRedirect: '/login'
  }), function (req, res, next) {
    var loginFrom = req.cookies.loginFrom;
    if (loginFrom && !loginFrom.includes('http://') && !loginFrom.includes('https://')) {
      res.clearCookie('loginFrom');
      res.redirect(loginFrom);
    } else {
      res.redirect('/');
    }
  });


module.exports = router;
