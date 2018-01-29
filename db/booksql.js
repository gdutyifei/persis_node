/**
 * Created by luoyifei on 2018/1/19.
 */
var booksSql = {
    insert: 'INSERT INTO Books(book_name, cover_url, created_date, created_by, updated_date, updated_by) VALUES(?, ?, NOW(), "system", NOW(), "system")',
    queryAll: 'SELECT * FROM Books',
    selectByBookId: 'SELECT id, book_name, cover_url FROM Books WHERE id = ?'
};

module.exports = booksSql;