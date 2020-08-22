const db = require('../utils/db');
const tbName = 'don_van_chuyen';
const mysql = require('mysql');


module.exports = {
    add:async (diachi,tien,tongtien,nhanvien,ngay,id)=>{
        const sql=`INSERT INTO ${tbName} (dia_chi_nhan,nhan_tien_nguoi_mua,tong_tien,nhan_vien,ngay_nhan,ma_phieu) VALUES ('${diachi}',${tien},${tongtien},${nhanvien},'${ngay}',${id}) `;
        const rows=await db.load(sql);
        return rows;
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