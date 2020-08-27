const db = require('../utils/db');
const tbName = 'thanh_toan';
const mysql = require('mysql');


module.exports = {
    add: async payment => {
        const id = db.add(tbName, payment);
        return id;
    },

    getById: async id => {
        let sql = 'SELECT * FROM ?? WHERE ?? = ?';
        const params = [tbName, 'ma_so', id];
        sql = mysql.format(sql, params);
        const rs = await db.load(sql);
        if (rs.length > 0) {
            return rs[0];
        }
        return null;
    },
}