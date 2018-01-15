/**
 * Created by luoyifei on 2018/1/15.
 */

var demoSql = {
    insert: 'INSERT INTO Demo(id, name) VALUES(?, ?)',
    queryAll: 'SELECT * FROM Demo',
    getDemoById: 'SELECT * FROM Demo WHERE id = ? '
};

module.exports = demoSql;