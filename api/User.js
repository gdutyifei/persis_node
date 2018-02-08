/**
 * Created by luoyifei on 2018/1/16.
 */

var express = require('express');
var router = express.Router();

// 引入MYSQL模块
var mysql = require('mysql');
var dbConfig = require('../db/mysqldbConfig');
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
}

// 增
router.get('/insertUser', function (req, res, next) {
    // 从连接池获取连接
    pool.getConnection(function (err, connection) {
        // 获取前台页面传过来的参数
        var param = req.query || req.params;
        // 建立连接，增加一条数据
        connection.query(userSql.insert, [param.name, param.unionId, param.avatarUrl, param.nickName, param.sex], function (err, result) {
            console.log(err);
            if (result) {
                result = {
                    code: 200,
                    msg: '请求成功'
                };
            }

            // 以json形式，把操作结果返回给前台页面
            responseJSON(res, result);

            // 释放连接
            connection.release();
        })
    })
});

// 根据id查询用户信息
router.post('/getUserById', function (req, res, next) {
    // 从连接池获取连接
    pool.getConnection(function (err, connection) {
        // 获取前台页面传过来的参数
        var param = req.query || req.params;
        // 建立连接，增加一条数据
        connection.query(userSql.getUserById, [ parseInt(req.body.id)], function (err, result) {
            console.log(err);
            console.log(result);
            if (result) {
                result = {
                    code: 200,
                    msg: '请求成功',
                    data: result
                };
            }

            // 以json形式，把操作结果返回给前台页面
            responseJSON(res, result);

            // 释放连接
            connection.release();
        })
    })
});

// 根据openid查询用户信息
router.post('/getUserByOpenid', function (req, res, next) {
    // 从连接池获取连接
    pool.getConnection(function (err, connection) {
        // 获取前台页面传过来的参数
        var param = req.query || req.params;
        // 建立连接，增加一条数据
        connection.query(userSql.getUserByOpenid, [ req.body.openid], function (err, result) {
            console.log(err);
            console.log(result);
            if (result) {
                result = {
                    code: 200,
                    msg: '请求成功',
                    data: result
                };
            }

            // 以json形式，把操作结果返回给前台页面
            responseJSON(res, result);

            // 释放连接
            connection.release();
        })
    })
});

module.exports = router;