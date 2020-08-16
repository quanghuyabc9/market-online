const express = require('express');
const router = express.Router();
const multer = require('../middlewares/multer');
// const product_model = require('../models/product');
const extension_func = require('../utils/extension-func');
const nguoi_dung_model = require('../models/nguoi-dung-model');
const sha = require('sha.js');
const e = require('express');

router.get('/seller', async (req, res) => {
    if (!req.session.userID) {
        res.redirect('/');
    }
    else {
        user = await nguoi_dung_model.getById(req.session.userID);
        if (user.loai == 2) {
            console.log(user);
            haveShop = false;
            if (user.cua_hang != null) haveShop = true;
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
            res.render('seller/home', { layout: 'main', Username: user.ten_dang_nhap, haveShop });
        }
        else
            res.redirect('/');
    }
})

router.get('/seller/profile', async (req, res) => {
    if (!req.session.userID) {
        res.redirect('/');
    }
    else {
        user = await nguoi_dung_model.getById(req.session.userID);
        if (user.loai == 2) {
            // user.f_DOB_fix = user.f_DOB.getFullYear() + '-' +
            //     ((user.f_DOB.getMonth() + 1) < 10 ? '0' + (user.f_DOB.getMonth() + 1) : (user.f_DOB.getMonth() + 1)) + '-' +
            //     (user.f_DOB.getDate() < 10 ? '0' + user.f_DOB.getDate() : user.f_DOB.getDate());
            res.render('seller/profile', { layout: 'main', Username: user.ten_dang_nhap });
        }
        else
            res.redirect('/');
    }
})

router.post('/seller/profile', async (req, res) => {
    if (!req.session.userID) {
        res.redirect('/');
    }
    else {
        user = await nguoi_dung_model.getById(req.session.userID);
        if (user.loai == 2) {
            const fullname = req.body.Fullname;
            const email = req.body.email;
            const phoneNumber = req.body.phoneNumber;
            const gender = parseInt(req.body.gender);
            const dob = req.body.dob;
            const address = req.body.address;
            const username = req.body.username;
            const password = req.body.password;
            if (Password != '') {
                const salt = Date.now().toString(16);
                const preHash = password + salt;
                const hash = sha('sha256').update(preHash).digest('hex');
                const pwHash = hash + salt;
                nguoi_dung_model.update(user.ma_so, username, pwHash, fullname, email, phoneNumber, gender, dob, address);

            }
            else {
                nguoi_dung_model.update(user.ma_so, username, fullname, email, phoneNumber, gender, dob, address);
            }
            res.render('seller/success', { layout: 'main', msg: 'Sửa thành công' });

        }
        else
            res.redirect('/');
    }
})

router.get('/seller/shop', async (req, res) => {
    if (!req.session.userID) {
        res.redirect('/');
    } else {
        user = await nguoi_dung_model.getById(req.session.userID);
        if (user.loai == 2) {
            haveShop = false;
            if (user.cua_hang != null) haveShop = true;
            res.render('seller/shop', { layout: 'main', Username: user.ten_dang_nhap, haveShop });
        }
        else
            res.redirect('/');
    }
})

router.get('/seller/trade', async (req, res) => {
    if (!req.session.userID) {
        res.redirect('/');
    } else {
        user = await nguoi_dung_model.getById(req.session.userID);
        if (user.loai == 2)
            res.render('seller/trade', { layout: 'main', Username: user.ten_dang_nhap });
        else
            res.redirect('/');
    }
})

router.get('/seller/add-new-product', async (req, res) => {
    if (!req.session.userID) {
        res.redirect('/');
    }
    else {
        user = await account_model.getById(req.session.userID);
        if (user.f_Permission == 2)
            res.render('seller/add-new-product', { layout: 'main' });
        else
            res.redirect('/');
    }
})

router.get('/seller/create-shop', async (req, res) => {
    if(!req.session.userID) {
        res.redirect('/');
    } else {
        res.render('seller/create-shop', {layout: 'main'});
    }
}),

router.get('/seller/product-detail/:proID', async (req, res) => {
    if (!req.session.userID) {
        res.redirect('/');
    }
    else {
        user = await account_model.getById(req.session.userID);
        if (user.f_Permission == 2) {
            let proID = req.param.proID;
            let product = await product_model.getById(proID);
            let avatars = product.Avatar.split(' ');
            let avatar_main = avatars[0];
            avatars.splice(0, 1);
            let endTime = extension_func.yyyymmdd_mmddyyyy(product.EndTime);
            let timeLeft = (new Date(endTime)).getTime() - Date.now();
            if (timeRemain < 0) {
                timeLeft = 'This product currently is out of auction time';
            }
            res.render('seller/product-detail', { layout: 'main', product, avatar_main, avatars, timeLeft });
        }
        else
            res.redirect('/');
    }


})

router.post('/seller/add-new-product', multer.array('inputAvatar'), (req, res) => {
    if (req.files.length < 3) {
        res.render('seller/add-new-product', { layout: 'main', showAlert: true })
    }
    else {
        let avatar = '';
        for (let i = 0; i < req.files.length; i++) {
            avatar += req.files[i].filename + ' ';
        }
        var startTime_milisecond = Date.now();
        var period = req.body.AuctionPeriod;
        var endTime_milisecond = startTime_milisecond + (period * 60 * 60 * 1000);
        var startTime = extension_func.milisecondToDateTime(startTime_milisecond);
        var endTime = extension_func.milisecondToDateTime(endTime_milisecond);
        const product = {
            Avatar: avatar,
            Name: req.body.ProductName,
            CurrentPrice: req.body.StartPrice,
            StepPrice: req.body.StepPrice,
            BuyNowPrice: req.body.BuyNowPrice,
            StartTime: startTime,
            EndTime: endTime,
            TinyDes: req.body.TinyDes,
            FullDes: req.body.FullDes,
            CatID: req.body.Category == 'Phone' ? 1 : 2,
            Quantity: req.body.Quantity,
            AutoExtend: req.body.AutoExtend == 'on' ? 1 : 0,
            SellerID: req.session.userID,
            NumberOfBidders: 0,

        }
        var proID = product_model.add(product);
        res.render('seller/add-new-product-successfully', { layout: 'main' });
    }
})
module.exports = router;