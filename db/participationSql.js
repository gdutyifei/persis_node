/**
 * Created by luoyifei on 2018/1/20.
 */

var participation = {
    insert: 'INSERT INTO Participation(user_id, book_id, period, created_date, created_by, updated_date, updated_by) VALUES(?, ?, ?, NOW(), "system", NOW(), "system")',
    queryByPeriodAndBookId: 'SELECT * FROM Participation p WHERE p.period = ? AND p.book_id = ?'
}

module.exports = participation;