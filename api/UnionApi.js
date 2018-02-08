/**
 * Created by luoyifei on 2018/1/20.
 *
 * 多表查询联合
 *
 */
var express = require('express');
var router = express.Router();

var moment = require('moment');

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

// 获取首页信息接口
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
                    var participates = [];
                    const activityPromise = bookInfos.map((bookInfo, index) => {
                        const promise = new Promise((resolve, reject) => {
                            connection.query(participationSql.queryByPeriodAndBookId, [activityInfo.id, bookInfo[0].id], function (err, result) {
                                console.log("结果啊");
                                console.log(result);
                                console.log(result.length);
                                if (result.length != 0) {
                                    for (var i in result) {
                                        participates.push(JSON.parse(result[i].user_info));
                                    }
                                    console.log("参与者");
                                    console.log(participates);
                                    bookInfos[index][0]['participates'] = participates;
                                } else {
                                    bookInfos[index][0]['participates'] = [];
                                }

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
                        code: 999,
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

// 根据openid获取参与历史接口
router.all('/getHistoryList', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        // 从前台获取到的参数
        var param = req.query || req.params;

        connection.query(participationSql.queryByOpenid, [param.openid], function (personalErr, results) {
            if (results != null && results != "" && results.length != 0) {


                const allPromise = results.map((result, index) => {
                    const activityPromise = new Promise((resolve, reject) => {
                        connection.query(unionSql.queryBookInfoAndActivityInfoByBookIdAndActivityId, [result.bookId, result.activityId], function (unionErr, unionResult) {
                            result.info = unionResult[0];
                            resolve(result);
                        })
                    });
                    return activityPromise;

                });

                Promise.all(allPromise).then((result) => {
                    console.log(result);

                    responseJSON(res, result);
                    connection.release();
                });
            } else {
                var emptyResult = {
                    code: 200,
                    msg: "暂无参加记录",
                    data: null
                }

                responseJSON(res, emptyResult);
                connection.release();
            }
        })
    })
})


// 获取排行榜


module.exports = router;