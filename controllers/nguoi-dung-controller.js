const express = require('express');
const router = express.Router();
const sha = require('sha.js');
const nguoi_dung_model = require('../models/nguoi-dung-model');
const passport = require('../middlewares/passport');

var Recaptcha = require('express-recaptcha').RecaptchaV2;
//or with options
var options = { 'hl': 'en' };
var recaptcha = new Recaptcha('6LdV7scUAAAAALUQJ3xEqGOkbW6YBTTbG6ayI9Wa', '6LdV7scUAAAAAFBGDExCIrmJx6DBS7kvqCEvj36I', options);

router.get('/', async (req, res) => {
    if (!req.session.userID)
        res.redirect("/signin");
    else {
        user = await nguoi_dung_model.getById(req.session.userID);
        console.log(user);
        if (user.loai == 1)
            res.redirect('/buyer');
        else if (user.loai == 2)
            res.redirect('/seller');
        else if (user.loai == 3)
            res.redirect('/shipper');
    }
}),

    router.get('/signin', (req, res) => {
        req.session.userID = null;
        res.render('account/signin', { layout: 'main' });
    }),

    router.post('/signin', (req, res, next) => {
        passport.authenticate('local', (err, user, info) => {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.render('account/signin', {
                    layout: 'main',
                    showAlert: true
                });
            }
            req.login(user, err => {
                if (err) {
                    return next(err);
                }
                req.session.userID = user.ma_so;
                if (user.loai == 1) {
                    return res.redirect('/buyer');
                }
                else if (user.loai == 2) {
                    return res.redirect('/seller');
                } else if (user.loai == 3) {
                    return res.redirect('/shipper');
                }
            })
        })(req, res, next);
    });

router.get("/signup", (req, res) => {
    res.render('account/signup', { layout: 'main' });
}),

    router.post('/signup', recaptcha.middleware.verify, async (req, res) => {
        if (!req.recaptcha.error) {
            let user = await nguoi_dung_model.getByEmail(req.body.email);
            if (user == null) {
                const username = req.body.username;
                const password = req.body.password;
                const fullname = req.body.fullname;
                const email = req.body.email;
                const phoneNumber = req.body.phoneNumber;
                const gender = parseInt(req.body.gender);
                if (gender == 0) gender = 1;
                const dob = req.body.DOB;
                const address = req.body.address;
                const typeAccount = parseInt(req.body.typeAccount);
                if (typeAccount == 0) typeAccount = 1;
                const salt = Date.now().toString(16);
                const preHash = password + salt;
                const hash = sha('sha256').update(preHash).digest('hex');
                const pwHash = hash + salt;
                const user = {
                    ten_dang_nhap: username,
                    mat_khau: pwHash,
                    ho_ten: fullname,
                    email: email,
                    so_dien_thoai: phoneNumber,
                    gioi_tinh: gender,
                    ngay_sinh: dob,
                    dia_chi: address,
                    ten_don_vi: null,
                    loai: typeAccount
                }
                const uId = await nguoi_dung_model.add(user);
                res.redirect('/');
            }
            else
                res.render('account/signup', { layout: 'main', EmailExist: true });
        } else {
            res.render('account/signup', { layout: 'main', reCAPTCHA: true });
        }
    }),

    module.exports = router;