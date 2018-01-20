var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

///=======路由信息 （接口地址）开始 存放在./routes目录下===========//
var index = require('./api/index');
var demos = require('./api/demos');
var user = require('./api/User');
var book = require('./api/Books');
var activity = require('./api/Activities');
var participation = require('./api/Participation');
var unionApi = require('./api/UnionApi');

var app = express();

// 允许所有的请求形式
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

///=======模板 开始===========//
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
///=======模板 结束===========//

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
// 添加json解析
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index); //在app中注册routes该接口
app.use('/demos', demos); //在app中注册demo接口
app.use('/user', user);
app.use('/book', book);
app.use('/activity', activity);
app.use('/participation', participation);
app.use('/api', unionApi);


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
