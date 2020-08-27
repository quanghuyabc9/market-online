const db = require('../utils/db');
const tbName = 'chi_tiet_gio_hang';
const mysql = require('mysql');


module.exports = {
    add: async cartDetail => {
        const id = db.add(tbName, cartDetail);
        return id;
    },

    allByCartId: async cartId => {
        const sql = `SELECT * FROM ${tbName} WHERE gio_hang = ${cartId}`;
        const rows = await db.load(sql);
        return rows;
    },

    allByCartIdProId: async (cartId, proId) => {
        const sql = `SELECT * FROM ${tbName} WHERE gio_hang = ${cartId} AND san_pham = ${proId}`;
        const rows = await db.load(sql);
        return rows;
    },

    update: async (id, qualityNeed) => {
        let sql = `UPDATE ${tbName} SET so_luong = ${qualityNeed} WHERE ma_so = ${id};`
        const res = await db.load(sql);
        return res;
    },

    deleteById: async cartDetailId => {
        const sql = `DELETE FROM ${tbName} WHERE ma_so = ${cartDetailId}`;
        const rows = await db.load(sql);
        return rows;
    },

}