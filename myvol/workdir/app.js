var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var helmet = require('helmet');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');


function convertToHash(plain) {
  var crypto = require('crypto');
  var hash = crypto.createHash('sha256');
  return hash.update(plain).digest('hex');
}

passport.use(new LocalStrategy(
  function (username, password, done) {
    var hashedPassword = convertToHash(password);
    console.log('app.js new LocalStrategy:: username:' + username);
    User.findOne({
      where: { name: username }
    }).then((user) => {
      console.log('app.js new LocalStrategy:: after findOne:' + user);
      if (!user) {
        console.log(':2:2');
        return done(null, false, { message: "ユーザが見つかりません" });
      }
      if (user.password === hashedPassword) {
        console.log(':::::' + user);
        return done(null, user);
      }
      console.log(':4:4');
      return done(null, false, { message: "パスワードが違います" });
    });
  }
));

var Items = require('./models/items');
var User = require('./models/user');
Items.sync();
User.sync();

var indexRouter = require('./routes/index');
var itemsRouter = require('./routes/items');
var loginRouter = require('./routes/login');
var logoutRouter = require('./routes/logout');

var app = express();
app.use(helmet());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'e159e13a2d085128', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/items', itemsRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);

passport.serializeUser(function (user, done) {
  console.log(user);
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  console.log('deserializeUser::' + user);
  User.findOne({
    where: { name: user.name }
  }).then((user) => {
    done(null, { id: user.id, name: user.name });
  });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  console.log('::::404');
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
