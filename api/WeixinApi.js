/**
 * Created by luoyifei on 2018/2/1.
 */


var express = require('express');
var request = require('request');
var router = express.Router();

// 引入MYSQL模块
var mysql = require('mysql');
var dbConfig = require('../db/mysqldbConfig');
var configSql = require('../db/config');
var userSql = require('../db/usersql');
// 使用mysqldbConfig.js的配置信息创建一个MYSQL连接池
var pool = mysql.createPool(dbConfig.mysql);
// 响应一个JSON数据
var responseJSON = function (res, ret) {
    if (typeof ret === 'undefined') {
        res.json({code: '9999', msg: '系统异常'});
    } else {
        res.json(ret);
    }
};

// 根据code获取用户openid
router.all("/getOpenidByCode", function (req, res, next) {
    // 从连接池获取连接
    pool.getConnection(function (err, connection) {
        connection.query(configSql.getConfig, {}, function (err, result) {
            var configResult = result[0];
            var appid = configResult.appid;
            var appsecret = configResult.appsecret;

            // 获取前台页面传过来的参数
            var param = req.query || req.params;
            request("https://api.weixin.qq.com/sns/jscode2session?appid=" + appid + "&secret=" + appsecret + "&js_code=" + param.code + "&grant_type=authorization_code", function (err, response, body) {
                console.log(body);
                var openid = JSON.parse(body).openid;
                console.log(openid);

                connection.query(userSql.getUserByOpenid, [openid], function (err, userResult) {
                    console.log("获取用户信息");
                    console.log(userResult);
                    if (userResult == null || userResult == "") {
                        console.log("插入用户数据");
                        // 说明表里没有存这个东西
                        connection.query(userSql.insert, [openid, "", param.avatarUrl, param.nickName, param.sex], function (err, saveUserInfoResult) {
                            // if (err) throw err;
                            console.log(saveUserInfoResult);
                        })
                    } else {
                        // 如果已经存表了， 就不作处理
                        console.log("已经有用户数据");
                    }
                    var result = {
                        code: 200,
                        msg: '请求成功',
                        data: openid
                    };
                    responseJSON(res, result);
                    // 释放连接
                    connection.release();
                });
            });
        })
    });

});

module.exports = router;