const express = require('express');
const router = express.Router();
const extension_func = require('../utils/extension-func');
const nguoi_dung_model = require('../models/nguoi-dung-model');
const san_pham_model = require('../models/san-pham-model');
const don_van_chuyen_model = require('../models/don-van-chuyen-model');
const phieu_dat_hang_model = require('../models/phieu-dat-hang-model');

router.get('/shipper', async (req, res) => {
    if (!req.session.userID) {
        res.redirect('/');
    }
    else {
        user = await nguoi_dung_model.getById(req.session.userID);
        if (user.loai == 3) {
            let shippingBills = await don_van_chuyen_model.all();
            for (let i = 0; i < shippingBills.length; i++) {
                shippingBills[i].so_thu_tu = i + 1;
                if (shippingBills[i].nhan_tien_nguoi_mua == 0) {
                    shippingBills[i].nhan_tien_nguoi_mua = "Không";
                } else {
                    shippingBills[i].nhan_tien_nguoi_mua = "Có";
                }
            }
            res.render('shipper/home', {
                layout: 'main',
                Username: user.ten_dang_nhap,
                shippingBills
            });
        }
        else
            res.redirect('/');
    }
});

router.get('/shipper/profile', async (req, res) => {
    if (!req.session.userID) {
        res.redirect('/');
    }
    else {
        user = await nguoi_dung_model.getById(req.session.userID);
        if (user.loai == 3) {
            const dob = user.ngay_sinh;
            const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(dob)
            const mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(dob)
            const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(dob)
            user.ngay_sinh_view = `${ye}-${mo}-${da}`;
            res.render('shipper/profile', { layout: 'main', Username: user.ten_dang_nhap, user });
        }
        else
            res.redirect('/');
    }
});

router.post('/shipper/profile', async (req, res) => {
    if (!req.session.userID) {
        res.redirect('/');
    }
    else {
        user = await nguoi_dung_model.getById(req.session.userID);
        if (user.loai == 3) {
            const fullname = req.body.fullname;
            const email = req.body.email;
            const phoneNumber = req.body.phoneNumber;
            const gender = parseInt(req.body.gender);
            const dob = req.body.dob;
            const address = req.body.address;
            const username = req.body.username;
            const password = req.body.password;
            if (password != '') {
                const salt = Date.now().toString(16);
                const preHash = password + salt;
                const hash = sha('sha256').update(preHash).digest('hex');
                const pwHash = hash + salt;       
                await nguoi_dung_model.updateWithPassword(user.ma_so, username, pwHash, fullname, email, phoneNumber, gender, dob, address);
            }
            else {
                await nguoi_dung_model.updateNoPassword(user.ma_so, username, fullname, email, phoneNumber, gender, dob, address);
            }
            res.redirect('/');
        }
        else
            res.redirect('/');
    }
});

router.post('/shipper/update/delete-shipping-bill', async (req, res) => {
    if (!req.session.userID) {
        res.redirect('/');
    }
    else {
        user = await nguoi_dung_model.getById(req.session.userID);
        if (user.loai == 3) {
            let shippingBillId = req.body.shippingBillId;
            await don_van_chuyen_model.delete(shippingBillId);
            res.redirect('/');
        }
        else
            res.redirect('/');
    }
});
module.exports = router;