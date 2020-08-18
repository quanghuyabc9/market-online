const db = require('../utils/db');
const tbName = 'phieu_dat_hang';
const mysql = require('mysql');


module.exports = {
    add:async (ma,tien,ngay,phi,trangthai,nguoi,thanhtoan)=>{
        const sql=`INSERT INTO ${tbName} (ma_so,tong_tien,ngay_lap_phieu,chi_phi_giao_hang,tinh_trang,nguoi_dung,thanh_toan) VALUES (${ma},${tien},'${ngay}',${phi},${trangthai},${nguoi},${thanhtoan}) `;
        const rows=await db.load(sql);
        return rows;
    },
};