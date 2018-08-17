/**
 * Created by luoyifei on 2018/1/20.
 */
var activitySql = {
    insert: 'INSERT INTO Activities(activity_date, period, book_ids, book_infos, created_date, created_by, updated_date, updated_by) VALUES(?, ?, ?, ?, NOW(), "system", NOW(), "system");',
    selectInfoByDate: 'SELECT a.id, a.period, a.activity_date, a.book_ids, a.book_infos FROM Activities a WHERE a.activity_date = ?',
    selectInfoById: 'SELECT a.id, a.period, a.activity_date FROM Activities a WHERE a.id = ? LIMIT 1',
    selectInfoByDateAndBookId: 'SELECT a.id FROM Activities a WHERE a.book_ids = ? AND a.activity_date = ?'
}

module.exports = activitySql;