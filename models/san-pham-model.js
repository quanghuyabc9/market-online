const db = require('../utils/db');
const tbName = 'san_pham';
const mysql = require('mysql');
const  pageSize=6;

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
    getTop5Finish: async () => {
        const sql = `SELECT * FROM ${tbName} ORDER BY EndTime ASC LIMIT 5`;
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
        const params = [tbName, 'SellerID', sellerID];
        sql = mysql.format(sql, params);
        const rs = await db.load(sql);
        if (rs.length > 0) {
            return rs;
        }
        return null;
    },
    getTop5Bidder: async () => {
        const sql = `SELECT * FROM ${tbName} ORDER BY Quantity DESC LIMIT 5`;
        const rows = await db.load(sql);
        return rows;
    },
    getTop5Expensive: async () => {
        const sql = `SELECT * FROM ${tbName} ORDER BY CurrentPrice DESC LIMIT 5`;
        const rows = await db.load(sql);
        return rows;
    },
    getAuctioning: async sellerID => {
        const sql = `
                    SELECT * 
                    FROM ${tbName} LEFT JOIN users ON products.HighestBidderID = users.f_ID 
                    WHERE SellerID = ${sellerID} AND TIMEDIFF(EndTime, NOW()) > 0
                    `;
        const rows = await db.load(sql);
        return rows;
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
    allByPaging: async (page)=>{
        let sql= `SELECT count(*) AS total FROM ${tbName}`;
        const rs= await db.load(sql);
        const totalPage=rs[0].total;
        //console.log(totalPage);
        const pageTotal=Math.floor(totalPage / pageSize)+1;
        const offset= (page -1)* pageSize;
        sql= `SELECT * FROM ${tbName} LIMIT ${pageSize} OFFSET ${offset}`;
        const rows= await db.load(sql);
        return {
            pageTotal: pageTotal,
            products: rows
        };
    },
    allByIdPaging: async (id,page)=>{
        let sql= `SELECT count(*) AS total FROM ${tbName} WHERE loai_san_pham=${id}`;
        const rs= await db.load(sql);
        const totalPage=rs[0].total;
        const pageTotal=Math.floor(totalPage / pageSize)+1;
        const offset= (page -1)* pageSize;
        sql= `SELECT * FROM ${tbName} WHERE loai_san_pham= ${id} LIMIT ${pageSize} OFFSET ${offset}`;
        const rows= await db.load(sql);
        return {
            pageTotal: pageTotal,
            products: rows
        };
    },
    allSearchNameProALL: async(name)=>{
        let sql =`SELECT * FROM ${tbName} WHERE ten_san_pham LIKE '%${name}%'`;
        const rows=await db.load(sql);
        return rows;
    },
    allByProId: async i=>{
        const sql=`SELECT *FROM ${tbName} WHERE ma_so=${i}`;
        const rows=await db.load(sql);
        return rows;
    },
};