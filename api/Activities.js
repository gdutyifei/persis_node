/**
 * Created by luoyifei on 2018/1/20.
 */
var express = require('express');
var router = express.Router();

// 引入MYSQL模块
var mysql = require('mysql');
var dbConfig = require('../db/mysqldbConfig');
var activitySql = require('../db/activitySql');
var bookSql = require('../db/booksql');

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

// 管理员
router.get('/insertActivities', function (req, res, next) {
    // 从连接池获取连接
    pool.getConnection(function (err, connection) {
        // 从前台获取到的参数
        var param = req.query || req.params;
        var bookId = param.books;
        console.log("书本id： " + bookId);

        return new Promise(function(resolve, reject) {
            connection.query(bookSql.selectByBookId, [bookId], function (err, bookResult) {
                console.log(bookResult);
                if(! err) {
                    resolve(bookResult);
                } else {
                    reject(err);
                }
            })
        }).then(function(bookInfo) {
            connection.query(activitySql.insert, [param.date, param.period, bookId, JSON.stringify(bookInfo)], function(err, activityResult) {
                console.log(activityResult);

                if (activityResult) {
                    activityResult = {
                        code: 200,
                        mag: '请求成功',
                        data: activityResult
                    };
                }

                // 以json形式，把操作结果返回给前台页面
                responseJSON(res, activityResult);

                // 释放连接
                connection.release();
            })
        }).catch(function (err) {
            console.log(err);
        })
    })
});

module.exports = router;
