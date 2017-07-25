var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy
var mongojs = require('mongojs');
var db = mongojs('mongodb://localhost:27017/therapu', ['users']);
var userCollection = db.collection('users');

passport.use(new LocalStrategy(authenticate))

function authenticate(email, password, done) {
    
    userCollection.findOne({
        email: email
    }, function(err, user) {
        if (!user || user.password !== password) {
            console.log('user not found')
            req.session.message = "user password combo incorrect"
            return done(null, false, {message: 'user password combo incorrect'});
        }
        if (err) {
            console.log(err)
        }
        console.log('User is ' + user.admin)
        done(null, user)
    })
}

passport.serializeUser(function(user, done) {
    done(null, mongojs.ObjectId(user._id))
})

passport.deserializeUser(function(id, done) {
    userCollection.findOne({
        _id: mongojs.ObjectId(id)
    }, function(err, doc) {
        if (err) {
            console.log(err)
        }
        done(null, doc)
    })
})
