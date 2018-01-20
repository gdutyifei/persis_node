/**
 * Created by luoyifei on 2018/1/20.
 */

var express = require('express');
var router = express.Router();

// 引入MYSQL模块
var mysql = require('mysql');
var dbConfig = require('../db/mysqldbConfig');
var participationSql = require('../db/participationSql');
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

router.all('/join', function (req, res, next) {
    // 从连接池获取连接
    pool.getConnection(function (err, connection) {
        // 从前台获取到的参数
        var param = req.query || req.params;
        // 建立连接
        connection.query(participationSql.insert, [param.userId, param.bookId, param.period], function (err, result) {
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

module.exports = router;