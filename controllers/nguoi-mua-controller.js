const express = require('express');
const router = express.Router();
const nguoi_dung_model = require('../models/nguoi-dung-model');
const loai_san_pham_model = require('../models/loai-san-pham-model');
const san_pham_model = require('../models/san-pham-model');
const cua_hang_model = require('../models/cua-hang-model');
const chi_tiet_gio_hang_model = require('../models/chi-tiet-gio-hang-model');
const phieu_dat_hang_model = require('../models/phieu-dat-hang-model');
const don_van_chuyen_model = require('../models/don-van-chuyen-model');
const thanh_toan_model = require('../models/thanh-toan-model');
const gio_hang_model = require('../models/gio-hang-model');
const lich_su_ban_hang_model = require('../models/lich-su-ban-hang-model');
const nProducts = 8;
const shipCost = 20000;

router.get('/buyer', async (req, res) => {
    if (!req.session.userID) {
        res.redirect('/');
    } else {
        user = await nguoi_dung_model.getById(req.session.userID);
        if (user.loai == 1) {
            categories = await loai_san_pham_model.all();
            if (categories.length > 0) {
                res.redirect(`/buyer/${categories[0].ma_so}/1`);
                return;
            }
            categories = [];
            products = [];
            cart = {
                ma_so: user.gio_hang,
                tong_so_san_pham: 0
            }
            res.render('buyer/shop', {
                layout: 'main',
                Username: user.ten_dang_nhap,
                categories,
                products
            });
        }
        else
            res.redirect('/');
    }
});

router.get('/buyer/:catId/:pageNumber', async (req, res) => {
    if (!req.session.userID) {
        res.redirect('/');
    } else {
        user = await nguoi_dung_model.getById(req.session.userID);
        if (user.loai == 1) {
            const catId = req.params.catId;
            const pageNumber = req.params.pageNumber;
            categories = await loai_san_pham_model.all();
            products = await san_pham_model.allByCatId(catId);
            for (let i = 0; i < categories.length; i++) {
                if (categories[i].ma_so == catId) {
                    categories[i].isActive = true;
                    break;
                }
            }
            let productsOnPage = [];
            let pagination = [];
            let offset = (pageNumber - 1) * nProducts;
            for (let i = 0; i < nProducts && i < (products.length - (pageNumber - 1) * nProducts); i++) {
                productsOnPage.push(products[offset + i]);
            }
            let nPages;
            if (products.length < nProducts)
                nPages = 1;
            else
                nPages = Math.floor(products.length / nProducts) + products.length % nProducts;
            for (let i = 0; i < nPages; i++) {
                pagination.push({
                    CatID: catId,
                    pageNumber: i + 1
                });
                if ((i + 1) == pageNumber)
                    pagination[i].isActive = true;
            }
            let previous = {
                CatID: catId,
                pageNumber: pageNumber - 1
            }
            if (previous.pageNumber <= 0)
                previous.isDisabled = true;
            let next = {
                CatID: catId,
                pageNumber: (+pageNumber + +1)
            }
            if (next.pageNumber > nPages)
                next.isDisabled = true;
            let cartDetails = await chi_tiet_gio_hang_model.allByCartId(user.gio_hang);
            let totalProducts = 0
            for (let i = 0; i < cartDetails.length; i++) {
                totalProducts += cartDetails[i].so_luong;
            }
            cart = {
                ma_so: user.gio_hang,
                tong_so_san_pham: totalProducts
            }
            res.render('buyer/home', {
                layout: 'main',
                Username: user.ten_dang_nhap,
                categories,
                productsOnPage,
                cart,
                previous,
                pagination,
                next
            });
        } else {
            res.redirect('/');
        }
    }
});

router.get('/buyer/view/product-detail/:proId', async (req, res) => {
    if (!req.session.userID) {
        res.redirect('/');
    } else {
        user = await nguoi_dung_model.getById(req.session.userID);
        if (user.loai == 1) {
            const proId = req.params.proId;
            product = await san_pham_model.getById(proId);
            category = await loai_san_pham_model.getById(product.loai_san_pham);
            categories = await loai_san_pham_model.all();
            shop = await cua_hang_model.getById(product.cua_hang);
            seller = await nguoi_dung_model.getByShopId(shop.ma_so);
            let cartDetails = await chi_tiet_gio_hang_model.allByCartId(user.gio_hang);
            let totalProducts = 0
            for (let i = 0; i < cartDetails.length; i++) {
                totalProducts += cartDetails[i].so_luong;
            }
            cart = {
                ma_so: user.gio_hang,
                tong_so_san_pham: totalProducts
            }
            res.render('buyer/product-detail', {
                layout: 'main',
                Username: user.ten_dang_nhap,
                product,
                category,
                categories,
                shop,
                seller,
                cart
            });
        } else {
            res.redirect('/');
        }
    }
});

router.post('/buyer/update/add-to-cart', async (req, res) => {
    if (!req.session.userID) {
        res.redirect('/');
    } else {
        user = await nguoi_dung_model.getById(req.session.userID);
        if (user.loai == 1) {
            const proId = parseInt(req.body.proId);
            const product = await san_pham_model.getById(proId);
            const cartId = user.gio_hang;
            let qualityNeed = parseInt(req.body.qualityNeed);

            let cartDetails = await chi_tiet_gio_hang_model.allByCartIdProId(cartId, proId);
            if (cartDetails.length > 0) {
                if (cartDetails[0].so_luong + qualityNeed > product.so_luong) {
                    qualityNeed = product.so_luong;
                } else {
                    qualityNeed = qualityNeed + cartDetails[0].so_luong;
                }
                await chi_tiet_gio_hang_model.update(cartDetails[0].ma_so, qualityNeed);
            } else {
                const cartDetail = {
                    so_luong: qualityNeed,
                    gio_hang: cartId,
                    san_pham: proId
                };
                await chi_tiet_gio_hang_model.add(cartDetail);
            }
            res.redirect(`/buyer/view/product-detail/${proId}`);
        } else {
            res.redirect('/');
        }
    }
});

router.get('/buyer/cart', async (req, res) => {
    if (!req.session.userID) {
        res.redirect('/');
    } else {
        user = await nguoi_dung_model.getById(req.session.userID);
        if (user.loai == 1) {
            let categories = await loai_san_pham_model.all();
            let cartDetails = await chi_tiet_gio_hang_model.allByCartId(user.gio_hang);
            let totalProducts = 0
            let totalPrice = 0
            for (let i = 0; i < cartDetails.length; i++) {
                let curProduct = await san_pham_model.getById(cartDetails[i].san_pham);
                cartDetails[i].san_pham = curProduct;
                cartDetails[i].so_tien = cartDetails[i].so_luong * curProduct.gia_tien;
                totalPrice += cartDetails[i].so_tien;
                totalProducts += cartDetails[i].so_luong;
            }
            let cart = {
                ma_so: user.gio_hang,
                tong_so_san_pham: totalProducts
            }
            res.render('buyer/cart', {
                layout: 'main',
                Username: user.ten_dang_nhap,
                cartDetails,
                cart,
                totalPrice,
                categories
            });
        } else {
            res.redirect('/');
        }
    }

})

router.get('/buyer/cart-payment', async (req, res) => {
    if (!req.session.userID) {
        res.redirect('/');
    } else {
        user = await nguoi_dung_model.getById(req.session.userID);
        if (user.loai == 1) {
            let categories = await loai_san_pham_model.all();
            let cartDetails = await chi_tiet_gio_hang_model.allByCartId(user.gio_hang);
            let totalProducts = 0;
            let totalPrice = 0;
            for (let i = 0; i < cartDetails.length; i++) {
                let curProduct = await san_pham_model.getById(cartDetails[i].san_pham);
                cartDetails[i].san_pham = curProduct;
                cartDetails[i].so_tien = cartDetails[i].so_luong * curProduct.gia_tien;
                totalPrice += cartDetails[i].so_tien;
                totalProducts += cartDetails[i].so_luong;
            }
            let cart = {
                ma_so: user.gio_hang,
                tong_so_san_pham: totalProducts
            };
            let totalMoney = totalPrice + shipCost;

            res.render('buyer/cart-payment', {
                layout: 'main',
                Username: user.ten_dang_nhap,
                cart,
                user,
                cartDetails,
                categories,
                totalPrice,
                shipCost,
                totalMoney
            });
        } else {
            res.redirect('/');
        }
    }
});

router.post('/buyer/cart-payment/insert/order-form', async (req, res) => {
    if (!req.session.userID) {
        res.redirect('/');
    } else {
        user = await nguoi_dung_model.getById(req.session.userID);
        if (user.loai == 1) {
            const d = new Date();
            const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d)
            const mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(d)
            const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d)
            let curDate = `${ye}-${mo}-${da}`;
            let cartDetails = await chi_tiet_gio_hang_model.allByCartId(user.gio_hang);
            let totalPrice = 0;
            for (let i = 0; i < cartDetails.length; i++) {
                let curProduct = await san_pham_model.getById(cartDetails[i].san_pham);
                let sellHistory = {
                    ngay_ban: curDate,
                    cua_hang: curProduct.cua_hang,
                    san_pham: curProduct.ma_so,
                    so_luong: cartDetails[i].so_luong
                }
                await lich_su_ban_hang_model.add(sellHistory);
                cartDetails[i].so_tien = cartDetails[i].so_luong * curProduct.gia_tien;
                totalPrice += cartDetails[i].so_tien;
            }
            let totalMoney = totalPrice + shipCost;

            let paymentType = req.body.paymentType;
            let payment = {
                loai: paymentType,
            }
            if (paymentType == 1) {
                payment.dia_chi = user.dia_chi;
            } else if (paymentType == 2) {
                let bankInfo = req.body.bankInfo;
                payment.ngan_hang = bankInfo;
                payment.dia_chi = user.dia_chi;
            }
            let paymentId = await thanh_toan_model.add(payment);
            let orderForm = {
                tong_tien: totalMoney,
                ngay_lap_phieu: curDate,
                chi_phi_giao_hang: shipCost,
                tinh_trang_thanh_toan: 1,
                nguoi_dung: user.ma_so,
                thanh_toan: paymentId,
                gio_hang: user.gio_hang
            };
            let orderFormId = await phieu_dat_hang_model.add(orderForm);
            let shippingBill = {
                dia_chi_nhan: user.dia_chi,
                tong_tien: totalMoney,
                ma_phieu: orderFormId,
                nhan_vien: user.ma_so
            }
            if (paymentType == 1) {
                shippingBill.nhan_tien_nguoi_mua = 1;
            } else {
                shippingBill.nhan_tien_nguoi_mua = 0;
            }
            await don_van_chuyen_model.add(shippingBill);
            await gio_hang_model.update(user.gio_hang, 1);
            let cart = {
                tong_tien: 0,
                tinh_trang: 0
            };
            let cartId = await gio_hang_model.add(cart);
            await nguoi_dung_model.updateCartId(user.ma_so, cartId);
            res.redirect('/buyer/cart');
        } else {
            res.redirect('/');
        }
    }
});

router.get('/buyer/histories', async (req, res) => {
    if (!req.session.userID) {
        res.redirect('/');
    } else {
        user = await nguoi_dung_model.getById(req.session.userID);
        if (user.loai == 1) {
            let curCartDetails = await chi_tiet_gio_hang_model.allByCartId(user.gio_hang);
            let totalProducts = 0
            for (let i = 0; i < curCartDetails.length; i++) {
                totalProducts += curCartDetails[i].so_luong;
            }
            cart = {
                ma_so: user.gio_hang,
                tong_so_san_pham: totalProducts
            }
            let categories = await loai_san_pham_model.all();
            let orderForms = await phieu_dat_hang_model.allByUserId(user.ma_so);
            for (let i = 0; i < orderForms.length; i++) {
                let cartDetails = await chi_tiet_gio_hang_model.allByCartId(orderForms[i].gio_hang);
                let newCartDetails = [];
                let payment = await thanh_toan_model.getById(orderForms[i].thanh_toan);

                orderForms[i].thanh_toan = (payment.loai == 1 ? "Thanh toán khi nhận hàng" : "Thanh toán trực tuyến");
                for (let j = 0; j < cartDetails.length; j++) {
                    let curProduct = await san_pham_model.getById(cartDetails[j].san_pham);
                    newCartDetails.push({
                        ten_san_pham: curProduct.ten_san_pham,
                        so_luong: cartDetails[j].so_luong
                    });
                }
                orderForms[i].cartDetails = newCartDetails;
                const d = orderForms[i].ngay_lap_phieu;
                const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d)
                const mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(d)
                const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d)
                let dateFormated = `${da}-${mo}-${ye}`;
                orderForms[i].ngay_lap_phieu = dateFormated;
            }
            res.render('buyer/histories', {
                layout: 'main',
                Username: user.ten_dang_nhap,
                categories,
                cart,
                orderForms
            });
        } else {
            res.redirect('/');
        }
    }
})

router.post('/buyer/update/delete-from-cart', async (req, res) => {
    if (!req.session.userID) {
        res.redirect('/');
    } else {
        user = await nguoi_dung_model.getById(req.session.userID);
        if (user.loai == 1) {
            let cartDetailId = req.body.cartDetailId;
            await chi_tiet_gio_hang_model.deleteById(cartDetailId);
            res.redirect('/buyer/cart')
        } else {
            res.redirect('/');
        }
    }
});

router.get('/buyer/view/search/:keyWord/:pageNumber', async (req, res) => {
    if (!req.session.userID) {
        res.redirect('/');
    } else {
        user = await nguoi_dung_model.getById(req.session.userID);
        if (user.loai == 1) {
            let categories = await loai_san_pham_model.all();
            let keyWord = req.params.keyWord;
            let pageNumber = req.params.pageNumber;
            let products = await san_pham_model.allByName(keyWord);
            let productsOnPage = [];
            let pagination = [];
            let offset = (pageNumber - 1) * nProducts;
            for (let i = 0; i < nProducts && i < (products.length - (pageNumber - 1) * nProducts); i++) {
                productsOnPage.push(products[offset + i]);
            }
            let nPages;
            if (products.length < nProducts)
                nPages = 1;
            else
                nPages = Math.floor(products.length / nProducts) + products.length % nProducts;
            for (let i = 0; i < nPages; i++) {
                pagination.push({
                    keyWord: keyWord,
                    pageNumber: i + 1
                });
                if ((i + 1) == pageNumber)
                    pagination[i].isActive = true;
            }
            let previous = {
                keyWord: keyWord,
                pageNumber: pageNumber - 1
            };
            if (previous.pageNumber <= 0)
                previous.isDisabled = true;
            let next = {
                keyWord: keyWord,
                pageNumber: (+pageNumber + +1)
            };
            if (next.pageNumber > nPages)
                next.isDisabled = true;
            let cartDetails = await chi_tiet_gio_hang_model.allByCartId(user.gio_hang);
            let totalProducts = 0
            for (let i = 0; i < cartDetails.length; i++) {
                totalProducts += cartDetails[i].so_luong;
            }
            cart = {
                ma_so: user.gio_hang,
                tong_so_san_pham: totalProducts
            }
            res.render('buyer/search-results', {
                layout: 'main',
                Username: user.ten_dang_nhap,
                productsOnPage,
                previous,
                pagination,
                next,
                categories,
                cart
            })
        } else {
            res.redirect('/');
        }
    }
});

router.post('/buyer/search', async (req, res) => {
    if (!req.session.userID) {
        res.redirect('/');
    }
    else {
        user = await nguoi_dung_model.getById(req.session.userID);
        if (user.loai == 1) {
            let keyWord = req.body.keyWord;
            res.redirect(`/buyer/view/search/${keyWord}/1`)
        }
        else
            res.redirect('/');
    }
});

router.get('/buyer/profile', async (req, res) => {
    if (!req.session.userID) {
        res.redirect('/');
    }
    else {
        user = await nguoi_dung_model.getById(req.session.userID);
        if (user.loai == 1) {
            let cartDetails = await chi_tiet_gio_hang_model.allByCartId(user.gio_hang);
            let totalProducts = 0
            for (let i = 0; i < cartDetails.length; i++) {
                totalProducts += cartDetails[i].so_luong;
            }
            cart = {
                ma_so: user.gio_hang,
                tong_so_san_pham: totalProducts
            }
            let categories = await loai_san_pham_model.all();
            user.ngay_sinh_view = user.ngay_sinh.getFullYear() + '-' +
                ((user.ngay_sinh.getMonth() + 1) < 10 ? '0' + (user.ngay_sinh.getMonth() + 1) : (user.ngay_sinh.getMonth() + 1)) + '-' +
                (user.ngay_sinh.getDate() < 10 ? '0' + user.ngay_sinh.getDate() : user.ngay_sinh.getDate());
            if(user.gioi_tinh == 1)  {
                user.isMale = true;
            } else if(user.gioi_tinh == 2) {
                user.isFemale = true;
            } else {
                user.isOther = true;
            }
            res.render('buyer/profile', { 
                layout: 'main', 
                Username: user.ten_dang_nhap, 
                user,
                categories,
                cart
             });
        }
        else
            res.redirect('/');
    }
});

router.post('/buyer/profile', async (req, res) => {
    if (!req.session.userID) {
        res.redirect('/');
    }
    else {
        user = await nguoi_dung_model.getById(req.session.userID);
        if (user.loai == 1) {
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
module.exports = router;