const db = require('../utils/db');
const tbName = 'gio_hang';
const mysql = require('mysql');


module.exports = {
    add: async cart => {
        const id = db.add(tbName, cart);
        return id;
    },
    update: async (id, stateId) => {
        let sql = `UPDATE ${tbName} SET tinh_trang = ${stateId} WHERE ma_so = ${id};`
        const res = await db.load(sql);
        return res;
    },
}