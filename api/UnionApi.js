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
    var activityInfo = [];
    var today = moment().format('YYYY-MM-DD');
    // 从连接池获取连接
    pool.getConnection(function (activityErr, connection) {
        
            connection.query(activitySql.selectInfoByDate, [today], function (activityErr, activityResult) {
                if (activityErr) throw activityErr;

                if (activityResult != null && activityResult != "") {
                    console.log("活动数据");
                    console.log(activityResult);
                    activityResult.map((item, index) => {
                        let bookInfo =  JSON.parse(item.book_infos)[0];
                        return new Promise((resolve, reject) => {
                            connection.query(participationSql.queryByPeriodAndBookId, [item.id, bookInfo.id], function (err, result) {
                                activityResult[index]["participates"] = result;
                                console.log(activityResult);
                                if(index == activityResult.length - 1) {
                                    console.log("最后一个值")
                                    resolve(activityResult);
                                }
                                
                            })
                        }).then(function(result) {
                            console.log('最后的数据');
                            console.log(result);
                            result = {
                                code: 200,
                                msg: '请求成功',
                                data: result
                            };
                            responseJSON(res, result);

                            // 释放连接
                            connection.release();
                        });
                        // console.log(activityResult);
                        // resolve(activityResult);
                    });

                    // Promise.all(activityPromise).then((result) => {
                        
                    // });

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