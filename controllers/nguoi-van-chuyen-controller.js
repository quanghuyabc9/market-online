const express = require('express');
const router = express.Router();
const multer = require('../middlewares/multer');
// const product_model = require('../models/product');
const extension_func = require('../utils/extension-func');
const nguoi_dung_model = require('../models/nguoi-dung-model');
const mPro=require('../models/san_pham');
const mBill=require('../models/don_van_chuyenM');
const mPutpro=require('../models/phieu_dat_hangM');
const sha = require('sha.js');
const e = require('express');

router.get('/shipper', async (req, res) => {
    if (!req.session.userID) {
        res.redirect('/');
    }
    else {
        user = await nguoi_dung_model.getById(req.session.userID);
        if (user.loai == 3) {
            const ps=await mBill.all();
            // console.log(bill.length);
            res.render('shipper/home', { layout: 'main', Username: user.ten_dang_nhap,ps:ps});
        }
        else
            res.redirect('/');
    }
});

router.get('/shipper/delete/:id',async(req,res)=>{
    const id=parseInt(req.params.id);
    const ps= await mBill.getById(id);
    const id_bill=ps[0].ma_phieu;
    //Cap nhat trang thai phieu dat hang
    const rs= await mPutpro.update(id_bill);
    //Xoas san pham
    const rows=await mBill.delete(id);
    res.redirect('/shipper');

});

module.exports = router;