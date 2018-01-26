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
        let firstPromise = new Promise(function (resolve, reject) {
            //当异步代码执行成功时，我们才会调用resolve(...), 当异步代码失败时就会调用reject(...)
            connection.query(activitySql.selectInfoByDate, [today], function (activityErr, activityResult) {
                if (activityErr) throw activityErr;

                var len = activityResult.length;

                if (len == 1) {
                    // 如果不是等于1的话， 就有问题了。
                    activityInfo = activityResult[0];
                    console.log('activityInfo:', activityInfo)
                    resolve(activityInfo);
                } else if (len == 0) {
                    // 没有活动的情况
                    resolve(null);
                } else {
                    reject("获取活动出错");
                }
            })
        }).then(function (activityInfo) {
            console.log(activityInfo);
            if (activityInfo != null && activityInfo != "" && activityInfo.length != 0) {
                var bookIds = eval(activityInfo.book_ids);
                var period = activityInfo.period;

                var bookPromises = bookIds.map((bookId, index)=>{
                    const promise = new Promise(function(resolve, reject){
                        connection.query(bookSql.selectByBookId, [bookId], function (bookErr, bookResult) {
                            resolve(bookResult);
                        });
                    })

                    return promise;
                });

                Promise.all(bookPromises).then( (bookInfos) => {

                    activityInfo.bookInfo = [];

                    var participationPromise = bookInfos.map((val, index)=>{

                        activityInfo.bookInfo.push(val[0]);

                        const promise = new Promise(function(resolve, reject){
                            connection.query(unionSql.queryParticipatesUnionByUserId, [val[0].id, period], function (participationErr, participationResult) {

                                val[0].participates = JSON.stringify(participationResult);
                                resolve(participationResult);
                            })
                        })
                        return promise;
                    });

                    Promise.all(participationPromise).then( (participationResult) => {
                        console.log('final: ', activityInfo);

                        // 以json形式，把操作结果返回给前台页面
                        responseJSON(res, activityInfo);

                        // 释放连接
                        connection.release();
                    });

                });
            } else {
                responseJSON(res, activityInfo);

                // 释放连接
                connection.release();
            }

        });
    })
});


module.exports = router;