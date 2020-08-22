const db = require('../utils/db');
const tbName = 'phieu_dat_hang';
const tbName1='chi_tiet_phieu_dat_hang';
const mysql = require('mysql');


module.exports = {
    add:async (ma,tien,ngay,phi,trangthai,nguoi,thanhtoan)=>{
        const sql=`INSERT INTO ${tbName} (ma_so,tong_tien,ngay_lap_phieu,chi_phi_giao_hang,tinh_trang,nguoi_dung,thanh_toan) VALUES (${ma},${tien},'${ngay}',${phi},${trangthai},${nguoi},${thanhtoan}) `;
        const rows=await db.load(sql);
        return rows;
    },
    update:async (id)=>{
        const sql=`UPDATE ${tbName} SET tinh_trang=2 WHERE ma_so=${id} `;
        const rows=await db.load(sql);
        return rows;
    },
    
    allById: async(id) => {
        const sql = `SELECT * FROM ${tbName} WHERE nguoi_dung=${id}`;
        const rows = await db.load(sql);
        return rows;
    },
    addDetail:async (soluong,phi,phieu,sanpham)=>{
        const sql=`INSERT INTO ${tbName1} (so_luong,chi_phi_giao_hang,phieu_dat_hang,san_pham) VALUES (${soluong},${phi},${phieu},${sanpham}) `;
        const rows=await db.load(sql);
        return rows;
    },
    getBillDetail: async()=>{
        const sql = `SELECT * FROM ${tbName1}`;
        const rows = await db.load(sql);
        return rows;
    }
};