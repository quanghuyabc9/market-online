const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const nguoi_dung_model = require('../models/nguoi-dung-model');
const funcs = require('../utils/extension-func');
const run = funcs.errorHandle;
const hash = require('../utils/hash');

passport.serializeUser( (user, done) => {
    done(null, user.ma_so);
});

passport.deserializeUser(async (id, done) => {
    const [user, err] = await run(nguoi_dung_model.getById(id));
    done(err, user);
});

passport.use(new LocalStrategy(
    async (username, password, done) => {
        const [user, err] = await run(nguoi_dung_model.getByUsername(username));
        if (err) {
            return done(err);
        }
        if (user === null) {
            return done(null, false, {message: 'Tên đăng nhập không tồn tại.'});
        }
        if(!hash.comparePassword(password, user.mat_khau)) {
            return done(null, false, {message: 'Sai mật khẩu.'});
        }
        return done(null, user);
    }
));

module.exports = passport;