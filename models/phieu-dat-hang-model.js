const db = require('../utils/db');
const tbName = 'phieu_dat_hang';
const mysql = require('mysql');


module.exports = {
    add: async orderForm => {
        const id = db.add(tbName, orderForm);
        return id;
    },

    allByUserId: async userId => {
        const sql = `SELECT * FROM ${tbName} WHERE nguoi_dung = ${userId}`;
        const rows = await db.load(sql);
        return rows;
    },
};