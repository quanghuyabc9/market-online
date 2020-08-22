const express = require('express');
const router = express.Router();
const multer = require('../middlewares/multer');
// const product_model = require('../models/product');
const extension_func = require('../utils/extension-func');
const nguoi_dung_model = require('../models/nguoi-dung-model');
const sha = require('sha.js');
const e = require('express');
const mLoaiSP=require('../models/loai-san-pham-model');
const mSP=require('../models/san-pham-model');
const mBill=require('../models/phieu_dat_hangM');
const mBillShip=require('../models/don_van_chuyenM');

router.get('/buyer', async (req, res) => {
    if (!req.session.userID) {
        res.redirect('/');
    }
    else {
        user = await nguoi_dung_model.getById(req.session.userID);
        if (user.loai == 1) {
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

router.get('/buyer/history',async(req,res)=>{
   var id=req.session.userID;
   var rs=await  mBill.allById(id);
    res.render('buyer/cartHistory',{
        layout: 'main', ps:rs,
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
       // them vao gio hang
        var cartItem=req.session.cart.add(product,productId,quantity);
       var str=JSON.stringify(cartItem);
       var json =  JSON.parse(str);
       //console.log(json.item);
        res.json(json);
    })
    .catch(error=>next(error));
});

router.put('/buyer/cart',(req,res)=>{
    var productId=req.body.id;
    var quantity=parseInt(req.body.quantity);
    var cartItem=req.session.cart.update(productId,quantity);
    // console.log("item cart: ");
    // console.log(cartItem);
    res.json(cartItem);

});
router.delete('/buyer/cart',(req,res)=>{
    var productId=req.body.id;
    req.session.cart.remove(productId);
    res.json({
        totalQuantity: req.session.cart.totalQuantity,
        totalPrice: req.session.cart.totalPrice
    });
});

router.delete('/buyer/cart/all',async(req,res)=>{
    
    const mPro= require('../models/san_pham');
    const mBill=require('../models/phieu_dat_hangM');
    const lengCart=req.session.cart.totalQuantity;//So luong
    const totalPrice=req.session.cart.totalPrice;//Gia tien
    const id=req.body.result;//id bill ma giao hang
    const feeShip=1;//phi giao hang
    const pay=1;//tong tien
    const date=req.body.date;//Ngay lap phieu
    const status=1;//Trang thai
    const user=req.session.userID;

    //Them vao data phieu dat hang
    const row= await mBill.add(id,totalPrice,date,feeShip,status,user,pay);
    //them phieu 
    const u = await nguoi_dung_model.getById(req.session.userID);
    const address=u.dia_chi;
    const money=totalPrice+1;
    const nhanVien=1;
    const r1=await mBillShip.add(address,totalPrice,money,nhanVien,date,id);

    const carts=req.session.cart.getCart();
    for (var i=0; i<lengCart;i++){
        const count=carts.items[i].quantity;//So luong
        const id_sp=carts.items[i].item[0].ma_so;
        const row1=await mBill.addDetail(count,feeShip,id,id_sp);

    }
    req.session.cart.empty();
    res.sendStatus(204);
    res.end();
    
});
module.exports = router;