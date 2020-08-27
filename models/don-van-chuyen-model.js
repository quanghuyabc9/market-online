const db = require('../utils/db');
const tbName = 'don_van_chuyen';
const mysql = require('mysql');


module.exports = {
    add: async shippingBill => {
        const id = db.add(tbName, shippingBill);
        return id;
    },

    all: async()=>{
        const sql=`SELECT *FROM ${tbName}`;
        const rows=await db.load(sql);
        return rows;
    },
    delete: async(id)=>{
        const sql=`DELETE FROM ${tbName} WHERE ma_so=${id}`;
        const rows=await db.load(sql);
        return rows;
    },
    getById: async(id)=>{
        const sql=`SELECT *FROM ${tbName} WHERE ma_so=${id}`;
        const rows=await db.load(sql);
        return rows;
    },
};