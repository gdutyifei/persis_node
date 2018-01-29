/**
 * Created by luoyifei on 2018/1/20.
 */
var activitySql = {
    insert: 'INSERT INTO Activities(activity_date, period, book_infos, created_date, created_by, updated_date, updated_by) VALUES(?, ?, ?, NOW(), "system", NOW(), "system");',
    selectInfoByDate: 'SELECT a.period, a.activity_date, a.book_ids FROM Activities a WHERE a.activity_date = ?'
}

module.exports = activitySql;