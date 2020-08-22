const db = require('../utils/db');
const tbName = 'lich_su_ban_hang';
const mysql = require('mysql');


module.exports = {
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

    allByShopId: async shopId => {
        const sql = `SELECT * FROM ${tbName} WHERE cua_hang = ${shopId}`;
        const rows = await db.load(sql);
        return rows;
    }
}