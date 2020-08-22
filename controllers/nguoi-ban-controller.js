const express = require('express');
const router = express.Router();
const multer = require('../middlewares/multer');
const nguoi_dung_model = require('../models/nguoi-dung-model');
const cua_hang_model = require('../models/cua-hang-model');
const loai_san_pham_model = require('../models/loai-san-pham-model');
const san_pham_model = require('../models/san-pham-model');
const lich_su_ban_hang_model = require('../models/lich-su-ban-hang-model');
const phieu_trao_doi_model = require('../models/phieu-trao-doi-model');
const sha = require('sha.js');
const nProducts = 8;
const maxRating = 5;

router.get('/seller', async (req, res) => {
    if (!req.session.userID) {
        res.redirect('/');
    } else {
        res.redirect('/seller/page/1')
    }
}),

    router.get('/seller/page/:pageNumber', async (req, res) => {
        if (!req.session.userID) {
            res.redirect('/');
        }
        else {
            user = await nguoi_dung_model.getById(req.session.userID);
            if (user.loai == 2) {
                haveShop = false;
                if (user.cua_hang != null) {
                    haveShop = true;
                    products = await san_pham_model.all(user.cua_hang);
                    sellHistories = await lich_su_ban_hang_model.allByShopId(user.cua_hang);
                    for (let i = 0; i < sellHistories.length; i++) {
                        let product = san_pham_model.getById(sellHistories[i].san_pham);
                        sellHistories[i].san_pham_du_lieu = product;
                        sellHistories[i].STT = i + 1;
                    }
                    const pageNumber = req.params.pageNumber;
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
                            pageNumber: i + 1
                        });
                        if ((i + 1) == pageNumber)
                            pagination[i].isActive = true;
                    }
                    let previous = {
                        pageNumber: pageNumber - 1
                    }
                    if (previous.pageNumber <= 0)
                        previous.isDisabled = true;
                    let next = {
                        pageNumber: (pageNumber + +1)
                    }
                    if (next.pageNumber > nPages)
                        next.isDisabled = true;
                    res.render('seller/home', {
                        layout: 'main',
                        Username: user.ten_dang_nhap,
                        haveShop,
                        productsOnPage,
                        sellHistories,
                        previous,
                        pagination,
                        next
                    });

                } else {
                    res.render('seller/home', {
                        layout: 'main',
                        Username: user.ten_dang_nhap,
                        haveShop
                    });
                }
            }
            else
                res.redirect('/');
        }
    }),

    router.get('/seller/profile', async (req, res) => {
        if (!req.session.userID) {
            res.redirect('/');
        }
        else {
            user = await nguoi_dung_model.getById(req.session.userID);
            if (user.loai == 2) {
                user.ngay_sinh_view = user.ngay_sinh.getFullYear() + '-' +
                    ((user.ngay_sinh.getMonth() + 1) < 10 ? '0' + (user.ngay_sinh.getMonth() + 1) : (user.ngay_sinh.getMonth() + 1)) + '-' +
                    (user.ngay_sinh.getDate() < 10 ? '0' + user.ngay_sinh.getDate() : user.ngay_sinh.getDate());
                console.log(user);
                res.render('seller/profile', { layout: 'main', Username: user.ten_dang_nhap, user });
            }
            else
                res.redirect('/');
        }
    }),

    router.post('/seller/profile', async (req, res) => {
        if (!req.session.userID) {
            res.redirect('/');
        }
        else {
            user = await nguoi_dung_model.getById(req.session.userID);
            if (user.loai == 2) {
                const fullname = req.body.fullname;
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
    }),

    router.get('/seller/shop', async (req, res) => {
        if (!req.session.userID) {
            res.redirect('/');
        } else {
            user = await nguoi_dung_model.getById(req.session.userID);
            if (user.loai == 2) {
                haveShop = false;
                if (user.cua_hang != null) haveShop = true;
                if (!haveShop) {
                    console.log(haveShop);
                    res.render('seller/shop', { layout: 'main', Username: user.ten_dang_nhap, haveShop });
                } else {
                    user = await nguoi_dung_model.getById(req.session.userID);
                    shop = await cua_hang_model.getById(user.cua_hang);
                    categories = await loai_san_pham_model.getByShopId(shop.ma_so);
                    if (categories.length > 0) {
                        res.redirect(`/seller/shop/${categories[0].ma_so}/1`);
                        return;
                    }
                    categories = [];
                    products = [];
                    res.render('seller/shop', {
                        layout: 'main',
                        Username: user.ten_dang_nhap,
                        haveShop,
                        shop,
                        categories,
                        products
                    });
                }
            }
            else
                res.redirect('/');
        }
    }),

    router.get('/seller/shop/:catId/:pageNumber', async (req, res) => {
        if (!req.session.userID) {
            res.redirect('/');
        } else {
            user = await nguoi_dung_model.getById(req.session.userID);
            if (user.loai == 2) {
                haveShop = false;
                if (user.cua_hang != null) haveShop = true;
                if (!haveShop) {
                    res.render('seller/shop', { layout: 'main', Username: user.ten_dang_nhap, haveShop });
                } else {
                    const catId = req.params.catId;
                    user = await nguoi_dung_model.getById(req.session.userID);
                    shop = await cua_hang_model.getById(user.cua_hang);
                    categories = await loai_san_pham_model.getByShopId(shop.ma_so);
                    products = await san_pham_model.allByCatId(catId);

                    const pageNumber = req.params.pageNumber;
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


                    res.render('seller/shop', {
                        layout: 'main',
                        Username: user.ten_dang_nhap,
                        haveShop,
                        shop,
                        categories,
                        productsOnPage,
                        previous,
                        pagination,
                        next
                    });
                }
            }
            else
                res.redirect('/');
        }
    }),

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
    }),

    router.get('/seller/shop/add-new-product', async (req, res) => {
        if (!req.session.userID) {
            res.redirect('/');
        }
        else {
            user = await nguoi_dung_model.getById(req.session.userID);
            categories = await loai_san_pham_model.getByShopId(user.cua_hang);
            if (user.loai == 2)
                res.render('seller/add-new-product', { layout: 'main', categories });
            else
                res.redirect('/');
        }
    }),

    router.post('/seller/shop/add-new-product', multer.array('inputAvatar'), async (req, res) => {
        if (!req.session.userID) {
            res.redirect('/')
        } else {
            user = await nguoi_dung_model.getById(req.session.userID);
            const product = {
                ten_san_pham: req.body.productName,
                gia_tien: req.body.price,
                so_luong: req.body.quantity,
                mo_ta: req.body.fullDes,
                muc_danh_gia: 0,
                hinh_anh: req.files[0].filename,
                trao_doi: req.body.trade == 'on' ? 1 : 0,
                loai_san_pham: req.body.category,
                cua_hang: user.cua_hang,
            }
            await san_pham_model.add(product);
            res.render('seller/add-new-product-successfully', { layout: 'main' });
        }
    }),

    router.get('/seller/create-shop', async (req, res) => {
        if (!req.session.userID) {
            res.redirect('/');
        } else {
            res.render('seller/create-shop', { layout: 'main' });
        }
    }),

    router.post('/seller/create-shop', async (req, res) => {
        if (!req.session.userID) {
            res.redirect('/');
        }
        else {
            let shopName = req.body.shopName;
            const d = new Date();
            const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d)
            const mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(d)
            const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d)
            let curDate = `${ye}-${mo}-${da}`;
            let fullDes = req.body.fullDes;
            const shop = {
                ten_cua_hang: shopName,
                ngay_tham_gia: curDate,
                mo_ta: fullDes
            }
            let shopId = await cua_hang_model.add(shop);
            await nguoi_dung_model.update(req.session.userID, shopId);
            res.redirect('/seller/shop');
        }
    }),

    router.get('/seller/product-detail/:proID', async (req, res) => {
        if (!req.session.userID) {
            res.redirect('/');
        }
        else {
            user = await nguoi_dung_model.getById(req.session.userID);
            if (user.loai == 2) {
                let proID = req.params.proID;
                let product = await san_pham_model.getById(proID);
                let category = await loai_san_pham_model.getById(product.loai_san_pham);
                let shop = await cua_hang_model.getById(product.cua_hang);
                let trade;
                let rating = [];
                for (let i = 0; i < maxRating; i++) {
                    if (i < product.muc_danh_gia)
                        rating.push({
                            checked: true,
                        })
                    else
                        rating.push({
                            checked: false,
                        })
                }
                if (product.trao_doi == 0) {
                    trade = false;
                } else {
                    trade = true;
                }
                res.render('seller/product-detail', { layout: 'main', Username: user.ten_dang_nhap, product, rating, category, trade, user, shop });
            }
            else
                res.redirect('/');
        }
    }),

    router.post('/seller/shop/edit-shop', async (req, res) => {
        if (!req.session.userID) {
            res.redirect('/');
        }
        else {
            user = await nguoi_dung.getById(req.session.userID);
            if (user.loai == 2) {
                shopName = req.body.shopName;
                fullDes = req.body.fullDes;
                cua_hang_model.update(user.cua_hang, shopName, fullDes);
                redirect('/seller/shop')
            }
            else
                res.redirect('/');
        }
    })

router.post('/seller/shop/add-category', async (req, res) => {
    if (!req.session.userID) {
        res.redirect('/');
    }
    else {
        user = await nguoi_dung_model.getById(req.session.userID);
        if (user.loai == 2) {
            category = {
                ten: req.body.categoryName,
                cua_hang: user.cua_hang
            };
            await loai_san_pham_model.add(category);
            res.redirect('/seller/shop')
        }
        else
            res.redirect('/');
    }
}),

    router.get('/seller/trade', async (req, res) => {
        if (!req.session.userID) {
            res.redirect('/');
        } else {
            user = nguoi_dung_model.getById(req.session.userID);
            if (user.loai == 2) {
                tradeOrders = phieu_trao_doi_model.all();
                if (tradeOrders == null) {
                    tradeOrdersOfShop = [];
                    res.render('seller/trade', { layout: 'main', tradeOrdersOfShop });
                    return;
                }
                tradeOrdersOfShop = [];
                for (let i = 0; i < tradeOrders.length; i++) {
                    productRequest = san_pham_model.getById(tradeOrders[i].san_pham_duoc_trao_doi);
                    if (productRequest.cua_hang == user.cua_hang) {
                        userRequest = nguoi_dung_model.getById(tradeOrdes[i].nguoi_trao_doi);
                        productUse = san_pham_model.getById(tradeOrders[i].san_pham_trao_doi);
                        const d = tradeOrders[i].ngay_lap_phieu;
                        const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d)
                        const mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(d)
                        const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d)
                        let dateCreate = `${da}-${mo}-${ye}`;
                        tradeOrdersOfShop.push({
                            dateCreate,
                            userRequest,
                            productRequest,
                            productUse
                        })
                    }
                    res.render('seller/trade', { layout: 'main', tradeOrdersOfShop });
                }
            } else {
                res.redirect('/');
            }
        }
    }),
    router.post('/seller/shop/product-detail/update/delete-product', async (req, res) => {
        if (!req.session.userID) {
            res.redirect('/');
        }
        else {
            user = await nguoi_dung_model.getById(req.session.userID);
            if (user.loai == 2) {
                let proId = req.body.proId;
                await san_pham_model.deleteById(proId);
                res.redirect(`/seller/shop`);
            }
            else
                res.redirect('/');
        }
    }),
    router.get('/seller/shop/update/delete-category/:catId', async (req, res) => {
        if (!req.session.userID) {
            res.redirect('/');
        }
        else {
            user = await nguoi_dung_model.getById(req.session.userID);
            if (user.loai == 2) {
                let catId = req.params.catId;
                await loai_san_pham_model.deleteById(catId);
                res.redirect(`/seller/shop`);
            }
            else
                res.redirect('/');
        }
    }),
    router.get("/seller/statistic", async (req, res) => {
        if (!req.session.userID) {
            res.redirect('/');
        }
        else {
            user = await nguoi_dung_model.getById(req.session.userID);
            if (user.loai == 2) {
                haveShop = false;
                if(user.cua_hang != null) haveShop = true;
                res.render('seller/statistic', {layout : "main", haveShop})
            }
            else
                res.redirect('/');
        }
    })
module.exports = router;