const port = 3000;
const express = require('express');
const express_handlebars = require('express-handlebars');
const express_handlebars_sections = require('express-handlebars-sections');
const express_session = require('express-session');
const body_parser = require("body-parser");
const dateTimeTool = require("./utils/datetime");
const nguoi_dung_controller = require('./controllers/nguoi-dung-controller');
const nguoi_ban_controller = require('./controllers/nguoi-ban-controller');
const passport = require('./middlewares/passport');
const app = express();

app.engine('.hbs', express_handlebars({
    helpers: {
        section: express_handlebars_sections(),
        productPrice: digitals => {
            return digitals.toString().replace(/(\d)(?=(\d{3})+$)/g, '$1 ') + ' đ';
        },
        formatDateTime: dateTimeTool.getNormalDate
    },
    extname: '.hbs'
}));

app.use(express_session({
    secret: "qweasdzxc",
    resave: false,
    saveUninitialized: true
}));

let Cart=require('./models/cartM');
app.use((req,res,next)=>{
    var cart=new Cart(req.session.cart ? req.session.cart:{});
    req.session.cart=cart;
    res.locals.totalQuantity=cart.totalQuantity;
    next();
});

app.set('view engine', '.hbs');

app.use(body_parser.json());
app.use(body_parser.urlencoded({
    extended: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
})
app.use(express.static(__dirname + '/public'));
app.use("/", express.static(__dirname + '/public'));

app.use("/", nguoi_dung_controller);
app.use("/", nguoi_ban_controller);
app.use('/',require('./controllers/nguoi-mua-controller'));


require('./middlewares/errors')(app);
app.listen(port, function(req, res) {
    console.log('App is listening on port ' + port);
});