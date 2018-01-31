/**
 * Created by luoyifei on 2018/1/20.
 *
 * 多表查询联合
 *
 */
var express = require('express');
var router = express.Router();

var moment = require('moment');
var async = require('async');

// 引入MYSQL模块
var mysql = require('mysql');
var dbConfig = require('../db/mysqldbConfig');
var bookSql = require('../db/booksql');
var activitySql = require('../db/activitySql');
var participationSql = require('../db/participationSql');
var unionSql = require('../db/unionSql');
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

router.all('/getIndexInformation', function (req, res, next) {
    var activityInfo = {};
    var today = moment().format('YYYY-MM-DD');
    // 从连接池获取连接
    pool.getConnection(function (activityErr, connection) {
        
            connection.query(activitySql.selectInfoByDate, [today], function (activityErr, activityResult) {
                if (activityErr) throw activityErr;

                if (activityResult != null && activityResult != "") {
                    activityInfo = activityResult[0];
                    var bookInfos = JSON.parse(activityInfo.book_infos);
                    const activityPromise = bookInfos.map((bookInfo, index) => {
                        const promise = new Promise((resolve, reject) => {
                            connection.query(participationSql.queryByPeriodAndBookId, [activityInfo.id, bookInfo[0].id], function (err, result) {
                                bookInfos[index][0]['participates'] = result;
                                resolve(bookInfos);
                            })

                        });
                        return promise;
                    });

                    Promise.all(activityPromise).then((result) => {
                        console.log(result);
                        var len = result.length;
                        result = result[len - 1];
                        activityInfo.bookInfo = result;
                        responseJSON(res, activityInfo);

                        // 释放连接
                        connection.release();
                    });

                } else {
                    activityInfo = {
                        code: 200,
                        msg: '今天没有活动',
                        data: null
                    };

                    responseJSON(res, activityInfo);

                    // 释放连接
                    connection.release();
                }
            });
    })
});


module.exports = router;