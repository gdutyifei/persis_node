/**
 * Created by luoyifei on 2018/1/20.
 */

var unionSql = {
    queryParticipatesUnionByUserId: 'SELECT * FROM User u WHERE u.openid IN (SELECT p.user_id FROM Participation p WHERE p.book_id = ? AND p.period = ? );',
    queryBookInfoAndActivityInfoByBookIdAndActivityId: 'SELECT b.id bookId, b.book_name bookName, a.id ActivityId, a.period period, a.activity_date activityDate FROM Books b, Activities a WHERE b.id = ? AND a.id = ?;'
};

module.exports = unionSql