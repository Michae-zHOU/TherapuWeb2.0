var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongojs = require('mongojs');
var db = mongojs('mongodb://localhost:27017/therapu', ['users']);
var userCollection = db.collection('users');
var crypt = require('./crypt')
passport.use(new LocalStrategy({passReqToCallback: true}, authenticate));

function authenticate(req, email, password, done) {
    userCollection.findOne({
        email: email,
    }, function(err, user) {     
        if (!user || !crypt.verifyPassword(password, user.salt, user.password)) {
            console.error('user not found');
            return done(null, false, req.flash('message', '登录失败，账号或密码错误'));
        }
        if (err) {
            console.error(err);
        }

        req.flash('message', '登录成功');
        done(null, user);
    });
}

passport.serializeUser(function(user, done) {
    done(null, mongojs.ObjectId(user._id));
});

passport.deserializeUser(function(id, done) {
    userCollection.findOne({
        _id: mongojs.ObjectId(id),
    }, function(err, doc) {
        if (err) {
            console.error(err);
        }
        done(null, doc);
    });
});
