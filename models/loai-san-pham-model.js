const db = require('../utils/db');
const tbName = 'loai_san_pham';
const mysql = require('mysql');

module.exports = {
    add: async category => {
        const id = db.add(tbName, category);
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

    getByShopId: async id => {
        const sql = `SELECT * FROM ${tbName} WHERE cua_hang = ${id}`;   
        const rows = await db.load(sql);
        return rows;
    },

    deleteById: async catId => {
        const sql = `DELETE FROM ${tbName} WHERE ma_so = ${catId}`;
        const rows = await db.load(sql);
        return rows;
    },

    all: async()=>{
        const sql=`SELECT *FROM ${tbName}`;
        const rows=await db.load(sql);
        return rows;
    },

    
}