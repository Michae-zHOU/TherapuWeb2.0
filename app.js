var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session')
var db = require('./db');
var cors = require('cors');
var device = require('express-device');
var api = require('./routes/api');
var index = require('./routes/index');
var createSurvey = require('./routes/createSurvey');
var users = require('./routes/users');
var authRoute = require('./routes/auth');
var about = require('./routes/about');
var surveys = require('./routes/surveys');
var article = require('./routes/article');
var setting = require('./routes/setting')
var passport = require('passport')
var flash = require('connect-flash')
var Ddos = require('ddos')
var ddos = new Ddos({burst:60, limit:120})



require('passport');
var app = express();
app.use(ddos.express);

app.use(device.capture({parseUserAgent:true}));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser('secret'));
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
    if (req.device.parser.useragent.family == 'UC Browser') {
        res.render('unsupport-browser', { user_browser : req.device.parser.useragent.family })
    }
    next()
})
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');
app.use(session({ secret: "i love cookie", resave: false, rolling: true, saveUninitialized: false, cookie: {maxAage: 600000}}))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
app.use(cors());

app.use('/', index);
app.use('/users', users);
app.use('/', authRoute);
app.use('/', article);
app.use('/about', about);
app.use('/', surveys);
app.use('/', createSurvey);
app.use('/api', api)
app.use('/', setting)
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
