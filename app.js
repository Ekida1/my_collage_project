var express = require('express');
var port = process.env.PORT || 3000;
var app = express();
var mongoose = require('mongoose');
var logger = require('morgan');
var multipart = require('connect-multiparty');
var path = require('path');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session); //表示session是放到Mongodb数据库中的
var bodyParser = require('body-parser');
var serveStatic = require('serve-static');
var cookieParser = require('cookie-parser');
var dbUrl = 'mongodb://localhost/imooc';
mongoose.Promise = global.Promise;

mongoose.connect(dbUrl);

app.set('views', './app/views/pages');
app.set('view engine', 'jade');
app.use(cookieParser());
app.use(multipart());
app.use(session({     //此处引入session
  secret:'imooc',
  store:new MongoStore({
    url:dbUrl,
    collection:'sessions'
  }),
  resave: false,
  saveUninitialized: false}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(serveStatic('bower_components'));

if('development' === app.get('env')){
  app.set('showStackError',true);  //这样设置就可以打印出错误信息
  app.use(logger(':method  :url  :status'));  //将请求的类型；url路径，状态打印出来
  app.locals.pretty = true; //将页面上的html源码 设置成 格式化后的,而不是压缩后的
  mongoose.set('debug',true);
}

require('./config/routes')(app); //此处引入routes.js文件里的内容 与routes文件做链接
app.listen(port);
app.locals.moment = require('moment');

console.log('imooc started on port' + port);
console.log('successssss!');
