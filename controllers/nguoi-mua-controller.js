const express = require('express');
const router = express.Router();
const multer = require('../middlewares/multer');
// const product_model = require('../models/product');
const extension_func = require('../utils/extension-func');
const nguoi_dung_model = require('../models/nguoi-dung-model');
const sha = require('sha.js');
const e = require('express');
const mLoaiSP=require('../models/loai_san_pham');
const mSP=require('../models/san_pham');

router.get('/buyer', async (req, res) => {
    if (!req.session.userID) {
        res.redirect('/');
    }
    else {
        user = await nguoi_dung_model.getById(req.session.userID);
        if (user.loai == 1) {
            //console.log(user);
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
            const cats=await mLoaiSP.all();
            //Phan trang
    const page=parseInt(req.query.page) || 1;
    const rs=await mSP.allByPaging(page);
    for(let cat of cats){
        cat.isActive=false;
    }
    
    const pages=[];
    for (let i=0; i< rs.pageTotal;i++){
        pages[i]= {value: i+1, active: (i+1)===page};
    }
    const navs={};
    if(page>1){
        navs.prev= page-1;
    }
    if(page<rs.pageTotal){
        navs.next=page+1;
    }
            res.render('buyer/home', { layout: 'main', Username: user.ten_dang_nhap, cats: cats,ps: rs.products,pages: pages,
            navs: navs,});
        }
        else
            res.redirect('/');
    }
})

router.get('/buyer/:id/products', async (req, res) => {
    const id=parseInt(req.params.id);
   // console.log(req.session.userID);
    user = await nguoi_dung_model.getById(req.session.userID);
    const page=parseInt(req.query.page) || 1;
    const cats=await mLoaiSP.all();
    const rs=await mSP.allByIdPaging(id,page);
    for(let cat of cats){
        cat.isActive=false;
        if(cat.ma_so==id){
            cat.isActive=true;
        }
    }
    const pages=[];
    for (let i=0; i< rs.pageTotal;i++){
        pages[i]= {value: i+1, active: (i+1)===page};
    }
    const navs={};
    if(page>1){
        navs.prev= page-1;
    }
    if(page<rs.pageTotal){
        navs.next=page+1;
    }
    res.render('buyer/home',{
        layout: 'main', Username: user.ten_dang_nhap, cats: cats,ps: rs.products,pages: pages,
        navs: navs,
    });
});

router.get('/buyer/search', async (req, res) => {
    const name=req.query.name;
    const cats=await mLoaiSP.all();
    const page=parseInt(req.query.page) || 1;
    const ps=await mSP.allSearchNameProALL(name);
    user = await nguoi_dung_model.getById(req.session.userID);
    for(let cat of cats){
        cat.isActive=false;
    }
    
    res.render('buyer/home',{
        layout: 'main', Username: user.ten_dang_nhap, cats: cats,ps: ps,
    });
});

router.get('/buyer/cart',async(req,res)=>{
    var cart=req.session.cart;
    user = await nguoi_dung_model.getById(req.session.userID);
    res.locals.cart=cart.getCart();
    res.render('buyer/carts',{
        layout: 'main', Username: user.ten_dang_nhap,
    });
})

router.post('/buyer/cart',(req,res,next)=>{
    //console.log("oke 123");
    var productId=req.body.id;
    var quantity=isNaN(req.body.quantity)? 1 : req.body.quantity;
    //console.log(productId);
    mSP
    .allByProId(productId)
    .then(product=>{
       // console.log(product);
        var cartItem=req.session.cart.add(product,productId,quantity);
        //order=cartItem;
       //console.log(cartItem.item.item[0].name);
       var str=JSON.stringify(cartItem);
       var json =  JSON.parse(str);
       //console.log(json.item);
        res.json(json);
    })
    .catch(error=>next(error));
});


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