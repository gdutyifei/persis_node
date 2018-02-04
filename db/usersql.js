/**
 * Created by luoyifei on 2018/1/16.
 */
var usersSql = {
    insert: 'INSERT INTO User(openid, union_id, avatar_url, nick_name, sex, created_date, created_by, updated_date, updated_by) VALUES(?, ?, ?, ?, ?, NOW(), "system", NOW(), "system")',
    queryAll: 'SELECT * FROM User',
    getUserById: 'SELECT * FROM User WHERE id = ? ',
    getUserByOpenid: 'SELECT id, openid, union_id, avatar_url, nick_name, sex FROM User WHERE openid = ?'
};

module.exports = usersSql;