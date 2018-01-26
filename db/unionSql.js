/**
 * Created by luoyifei on 2018/1/20.
 */

var unionSql = {
    queryParticipatesUnionByUserId: 'SELECT * FROM User u WHERE u.openid IN (SELECT p.user_id FROM Participation p WHERE p.book_id = ? AND p.period = ? );'
};

module.exports = unionSql