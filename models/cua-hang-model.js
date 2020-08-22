const db = require('../utils/db');
const tbName = 'cua_hang';
const mysql = require('mysql');


module.exports = {
    add: async shop => {
        const id = db.add(tbName, shop);
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

    update: async (id, shopName, fullDes) => {
        let sql = `UPDATE ${tbName} SET ten_cua_hang = '${shop}', mo_ta = '${fullDes}' WHERE ma_so = ${id};`
        const res = await db.load(sql);
        return res;
    }
}