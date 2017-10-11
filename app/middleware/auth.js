'use strict';
const async = require("async");


module.exports = {
    checkLogin: function checkLogin(req, res, next) {
      if (!req.session.userinfo) {
        // req.flash('error', '未登录'); 
        return res.redirect('/login');
      }
      next();
    },
  
    checkNotLogin: function checkNotLogin(req, res, next) {
      if (req.session.userinfo) {
        // req.flash('error', '已登录');
        return res.redirect('back');//返回之前的页面
      }
      next();
    }
  };