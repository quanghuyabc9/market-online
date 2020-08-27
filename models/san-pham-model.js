const db = require('../utils/db');
const tbName = 'san_pham';
const mysql = require('mysql');
const pageSize = 6;

module.exports = {
    all: async () => {
        const sql = `SELECT * FROM ${tbName}`;
        const rows = await db.load(sql);
        return rows;
    },

    allByShopId: async id => {
        const sql = `SELECT * FROM ${tbName} WHERE cua_hang = ${id}`;
        const rows = await db.load(sql);
        return rows;
    },

    allByCatId: async id => {
        const sql = `SELECT * FROM ${tbName} WHERE loai_san_pham= ${id}`;
        const rows = await db.load(sql);
        return rows;
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

    add: async product => {
        const id = db.add(tbName, product);
        return id;
    },

    getBySellerID: async sellerID => {
        let sql = 'SELECT * FROM ?? WHERE ?? = ?';
        const params = [tbName, 'cua_hang', sellerID];
        sql = mysql.format(sql, params);
        const rs = await db.load(sql);
        if (rs.length > 0) {
            return rs;
        }
        return null;
    },

    add: async product => {
        const id = db.add(tbName, product);
        return id;
    },

    deleteById: async prodId => {
        const sql = `DELETE FROM ${tbName} WHERE ma_so = ${prodId}`;
        const rows = await db.load(sql);
        return rows;
    },

    allByPaging: async (page) => {
        let sql = `SELECT count(*) AS total FROM ${tbName}`;
        const rs = await db.load(sql);
        const totalPage = rs[0].total;
        //console.log(totalPage);
        const pageTotal = Math.floor(totalPage / pageSize) + 1;
        const offset = (page - 1) * pageSize;
        sql = `SELECT * FROM ${tbName} LIMIT ${pageSize} OFFSET ${offset}`;
        const rows = await db.load(sql);
        return {
            pageTotal: pageTotal,
            products: rows
        };
    },

    allByIdPaging: async (id, page) => {
        let sql = `SELECT count(*) AS total FROM ${tbName} WHERE loai_san_pham=${id}`;
        const rs = await db.load(sql);
        const totalPage = rs[0].total;
        const pageTotal = Math.floor(totalPage / pageSize) + 1;
        const offset = (page - 1) * pageSize;
        sql = `SELECT * FROM ${tbName} WHERE loai_san_pham= ${id} LIMIT ${pageSize} OFFSET ${offset}`;
        const rows = await db.load(sql);
        return {
            pageTotal: pageTotal,
            products: rows
        };
    },

    allByName: async (name) => {
        let sql = `SELECT * FROM ${tbName} WHERE ten_san_pham LIKE '%${name}%'`;
        const rows = await db.load(sql);
        return rows;
    },

    allByNameByShopId: async (name, shopId) => {
        let sql = `SELECT * FROM ${tbName} WHERE ten_san_pham LIKE '%${name}%' AND cua_hang = ${shopId}`;
        const rows = await db.load(sql);
        return rows;
    },

    allByProId: async i => {
        const sql = `SELECT *FROM ${tbName} WHERE ma_so=${i}`;
        const rows = await db.load(sql);
        return rows;
    },

    updateNoFile: async (id, name, price, quantity, description, category) => {
        let sql = `
        UPDATE ${tbName}
        SET ten_san_pham = '${name}', gia_tien = ${price}, so_luong = '${quantity}', mo_ta = '${description}', loai_san_pham = ${category}
        WHERE ma_so = ${id};`
        const res = await db.load(sql);
        return res;
    },

    updateWithFile: async (id, name, price, quantity, description, avatar, category) => {
        let sql = `
        UPDATE ${tbName}
        SET ten_san_pham = '${name}', gia_tien = ${price}, so_luong = '${quantity}', mo_ta = '${description}', hinh_anh = '${avatar}', loai_san_pham = ${category}
        WHERE ma_so = ${id};`
        const res = await db.load(sql);
        return res;
    }
};