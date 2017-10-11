'use strict';

var express = require('express');
var path = require('path');
var app = express();

var config = require('./config/default');
var routers = require('./app/router');
var session = require('express-session');
var cookieParser = require('cookie-parser');

app.use(cookieParser());

app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');
app.use(express.static(__dirname + '/public'));


app.use(session({
    name: config.session.key,// 设置 cookie 中保存 session id 的字段名称
    secret: config.session.secret,// 通过设置 secret 来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改
    resave: true,// 强制更新 session
    saveUninitialized: false,// 设置为 false，强制创建一个 session，即使用户未登录
    cookie: {
      maxAge: config.session.maxAge// 过期时间，过期后 cookie 中的 session id 自动删除
    }
  }));



//设置ajax响应头
app.use(function(req, res, next) {
    
        var headers = req.headers;
        var userAgent = headers["user_admin-agent"];
        if (headers["x-requested-with"] === "XMLHttpRequest") {
            var reg = /MSIE (8|9)\.0/;
            var header = {
                "Content-Type": "application/json;charset=utf-8"
            };
            if (reg.test(userAgent)) {
                header = {
                    "Content-Type": "text/plain;charset=utf-8"
                };
                res.set(header);
            } else {
                res.set(header);
            }
    
        } else{
            header = {
                "Content-Type": "text/html;charset=utf-8"
            };
            res.set(header);
        }
    
        next();
    
    });

    var bodyParser = require('body-parser');
    app.use(bodyParser.json({
        limit: '1mb'
    })); //body-parser 解析json格式数据
    app.use(bodyParser.urlencoded({
        extended: true
    }));

    app.set('port',config.port);


function start(callback) {
    
        app.use('/', routers);
    
        app.use(function(req, res) {
    
            res.type('text/plain');
            res.status(404);
            var url = req.url;
            res.send('404 -' + url + ' NOT FOUND');
        });
    
        app.use(function(err, req, res, next) {
    
            console.log('err --- ' + err);
            if (err.error_code) {
    
                res.send(err).end();
            } else {
                res.send({
                    error_code: '12301500',
                    'error_msg': "系统繁忙，请稍后再试"
                }).end();
            }
    
        });
        app.listen(config.port, function() {
            var nowDate = new Date();
            console.log(nowDate.toLocaleDateString() + ' ' +
                nowDate.toLocaleTimeString());
            console.log('express started on port :' + app.get('port'));
            if (callback) {
                callback();
            }
        });
    
    }
    


if (require.main === module) {
        start();
    } else {
        exports.start = start;
    
    }
    
