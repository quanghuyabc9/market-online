const express = require('express');
const router = express.Router();
const multer = require('../middlewares/multer');
// const product_model = require('../models/product');
const extension_func = require('../utils/extension-func');
const nguoi_dung_model = require('../models/nguoi-dung-model');
const sha = require('sha.js');
const e = require('express');

router.get('/shipper', async (req, res) => {
    if (!req.session.userID) {
        res.redirect('/');
    }
    else {
        user = await nguoi_dung_model.getById(req.session.userID);
        if (user.loai == 3) {
            console.log(user);
            // let products_auctioning = await product_model.getAuctioning(user.f_ID);
            // let currentTime = Date.now();
            // for (let i = 0; i < products_auctioning.length; i++) {
            //     products_auctioning[i].MainAvatar = products_auctioning[i].Avatar.split(' ')[0];
            //     products_auctioning[i].StartTimeFix = extension_func.convertDate(products_auctioning[i].StartTime);
            //     let endTime_milisecond = products_auctioning[i].EndTime.getTime();
            //     let timeLeft_milisecond = endTime_milisecond - currentTime;
            //     if ((timeLeft_milisecond / (1000 * 60)) < 1 * 60) {
            //         products_auctioning[i].TimeLeft = "" + Math.round(timeLeft_milisecond / (1000 * 60)) + " minutes left";
            //     } else if ((timeLeft_milisecond / (1000 * 60)) < (24 * 60)) {
            //         products_auctioning[i].TimeLeft = "" + Math.round(timeLeft_milisecond / (1000 * 60 * 60)) + " hours left";
            //     } else {
            //         products_auctioning[i].TimeLeft = "" + Math.round(timeLeft_milisecond / (1000 * 60 * 60 * 24)) + " days left";
            //     }
            // }
            res.render('shipper/home', { layout: 'main', Username: user.ten_dang_nhap});
        }
        else
            res.redirect('/');
    }
})

module.exports = router;