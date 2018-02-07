/**
 * Created by luoyifei on 2018/1/20.
 */

var express = require('express');
var router = express.Router();

// 引入MYSQL模块
var mysql = require('mysql');
var dbConfig = require('../db/mysqldbConfig');
var participationSql = require('../db/participationSql');
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

// 参加活动
router.get('/join', function (req, res, next) {
    // 从连接池获取连接
    pool.getConnection(function (err, connection) {
        // 从前台获取到的参数
        var param = req.query || req.params;
        return new Promise(function (resolve, reject) {
            connection.query(participationSql.queryByAll, [param.activityId, param.bookId, param.openId], function (err, ifJoinedResult) {
                if (ifJoinedResult == null && ifJoinedResult == "") {
                    // 根据openid获取用户信息
                    connection.query(userSql.getUserByOpenid, [param.openId], function (err, result) {
                        if (result) {
                            resolve(result);
                        } else {
                            reject(err);
                        }
                    })
                } else {
                    var result = {
                        code: 999,
                        msg: '已经参与过了',
                        data: null
                    };
                    // 以json形式，把操作结果返回给前台页面
                    responseJSON(res, result);

                    // 释放连接
                    connection.release();
                }
            });
        }).then(function (userInfo) {
            console.log(userInfo[0]);
            // 插入参与者数据
            connection.query(participationSql.insert, [JSON.stringify(userInfo[0]), param.openId, userInfo[0].id, param.bookId, param.activityId], function (err, all) {
                console.log(err);
                if (all) {
                    all = {
                        code: 200,
                        msg: '请求成功',
                        result: all
                    };
                }

                // 以json形式，把操作结果返回给前台页面
                responseJSON(res, all);

                // 释放连接
                connection.release();
            })
        });
        
        
    })
});

// 排行榜
router.all("/getRangeList", function (req, res, next) {
    // 从连接池获取连接
    pool.getConnection(function (err, connection) {
        // 从前台获取到的参数
        var data = {};
        var personalRangeInfo = {};
        var param = req.query || req.params;
        var openid = param.openid;
        connection.query(participationSql.queryRangeList, null, function (err, rangeResult) {
            console.log(rangeResult);
            console.log(111);
            if (rangeResult != null && rangeResult != "" && rangeResult.length != 0) {
                for (var i = 0, r = 1; i < rangeResult.length; i++) {
                    rangeResult[i].userInfo = JSON.parse(rangeResult[i].user_info);
                    if (i == 0) {
                        rangeResult[i].range = r;
                    } else {
                        // 如果次数相同
                        if (rangeResult[i].count == rangeResult[i -1]) {
                            rangeResult[i].range = rangeResult[i - 1].range;
                            r ++;
                        } else {
                            rangeResult[i].range = ++ r;
                        }
                    }
                    if (rangeResult[i].openid == openid) {
                        // 说明是自己
                        personalRangeInfo = rangeResult[i];
                    }
                }
                console.log(rangeResult);
                console.log(personalRangeInfo);
                if (personalRangeInfo == null || personalRangeInfo == "") {
                    personalRangeInfo = {
                        code: "999",
                        msg: "暂无排名",
                        data: null
                    };
                }
                data.rangeList = rangeResult;
                data.personalRangeInfo = personalRangeInfo;

                responseJSON(res, data);
            } else {
                var result = {
                    code: 999,
                    msg: "当前暂无排行",
                    data: null
                }
                responseJSON(res, result);
            }
            connection.release();
        })
    })
});

module.exports = router;