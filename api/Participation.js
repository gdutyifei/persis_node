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

router.get('/join', function (req, res, next) {
    // 从连接池获取连接
    pool.getConnection(function (err, connection) {
        // 从前台获取到的参数
        var param = req.query || req.params;
        
        return new Promise(function (resolve, reject) {
            // 根据openid获取用户信息
            connection.query(userSql.getUserByOpenid, [param.openId], function (err, result) {
                if (result) {
                    resolve(result);
                } else {
                    reject(err);
                }
            })
        }).then(function (userInfo) {
            console.log(userInfo);
            // 插入参与者数据
            connection.query(participationSql.insert, [JSON.stringify(userInfo), param.bookId, param.activityId], function (err, all) {
                console.log(err);
                console.log(all);
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

module.exports = router;