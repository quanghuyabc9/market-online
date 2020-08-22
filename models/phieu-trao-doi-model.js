const db = require('../utils/db');
const tbName = 'phieu_trao_doi';
const mysql = require('mysql');


module.exports = {
    all: async () => {
        const sql = `SELECT * FROM ${tbName}`;
        const rows = await db.load(sql);
        return rows;
    },
}