/**
 * Created by luoyifei on 2018/1/20.
 */

var participation = {
    insert: 'INSERT INTO Participation(user_info, openid, user_id, book_id, activity_id, created_date, created_by, updated_date, updated_by) VALUES(?, ?, ?, ?, ?, NOW(), "system", NOW(), "system")',
    queryByPeriodAndBookId: 'SELECT user_info FROM Participation p WHERE p.activity_id = ? AND p.book_id = ?',
    queryRangeList: 'SELECT count(1) AS count, openid, user_info FROM Participation p group by p.openid, p.user_info ORDER BY count DESC',
    queryByAll: 'SELECT user_info FROM Participation p WHERE p.activity_id = ? AND p.book_id = ? AND p.openid = ?',
    queryByOpenid: 'SELECT p.openid, p.user_info userInfo, p.book_id bookId, p.activity_id activityId FROM Participation p WHERE p.openid = ? ORDER BY p.created_date DESC'
}

module.exports = participation;