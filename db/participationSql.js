/**
 * Created by luoyifei on 2018/1/20.
 */

var participation = {
    insert: 'INSERT INTO Participation(user_info, user_id, book_id, activity_id, created_date, created_by, updated_date, updated_by) VALUES(?, ?, ?, ?, NOW(), "system", NOW(), "system")',
    queryByPeriodAndBookId: 'SELECT user_info FROM Participation p WHERE p.activity_id = ? AND p.book_id = ?',
    queryRangeList: 'SELECT count(1) AS count, user_id FROM Participation p group by p.user_id ORDER BY count DESC'
}

module.exports = participation;