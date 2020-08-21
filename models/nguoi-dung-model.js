const db = require('../utils/db');
const tbName = 'nguoi_dung';
const mysql = require('mysql');


module.exports = {
    add: async user => {
        const id = db.add(tbName, user);
        return id;
    },

    getByUsername: async username => {
        let sql = 'SELECT * FROM ?? WHERE ?? = ?';
        const params = [tbName, 'ten_dang_nhap', username];
        sql = mysql.format(sql, params);
        const rs = await db.load(sql);
        if (rs.length > 0) {
            return rs[0];
        }
        return null;
    },

    getByEmail: async email => {
        let sql = 'SELECT * FROM ?? WHERE ?? = ?';
        const params = [tbName, 'email', email];
        sql = mysql.format(sql, params);
        const rs = await db.load(sql);
        if (rs.length > 0) {
            return rs[0];
        }
        return null;
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

    update: async (id, username, password, fullname, email, phoneNumber, gender, DOB, address) => {
        let sql = `UPDATE ${tbName}
                   SET ten_dang_nhap = '${username}', mat_khau = '${password}', ho_ten = '${fullname}', email = '${email}', So_dien_thoai = '${phoneNumber}', gioi_tinh = '${gender}', ngay_sinh = '${DOB}', dia_chi = '${address}'
                   WHERE f_ID = ${id};`
        const res = await db.load(sql);
        return res;
    },

    update: async (id, username, fullname, email, phoneNumber, gender, DOB, address) => {
        let sql = `UPDATE ${tbName}
        SET ten_dang_nhap = '${username}', ho_ten = '${fullname}', email = '${email}', So_dien_thoai = '${phoneNumber}', gioi_tinh = '${gender}', ngay_sinh = '${DOB}', dia_chi = '${address}'
        WHERE ma_so = ${id};`
        const res = await db.load(sql);
        return res;
    },

    update: async (id, shop) => {
        let sql = `UPDATE ${tbName} SET cua_hang = ${shop} WHERE ma_so = ${id};`
        const res = await db.load(sql);
        return res;
    }
}