var express = require('express');
var router = express.Router();
var logger = require('../logger');
var db = require('../db')
var session = require('express-session')
var passport = require('passport')
require('../passport')
require('../checkAuth')

var userCollection = db.collection('users');

/* GET home page. */
router.get('/login', function(req, res, next) {
	
   res.render('login', {    
    title: 'Home',
	auth: function() {
            if (req.user) {
                return req.user.admin
            }
		}, 
	error: req.flash('message')
   });
});
router.post('/login', passport.authenticate('local', {
	successRedirect: '/',
	failureRedirect: '/login',
	failureFlash: true,
}))
router.get('/logout', (req, res, next) => {
	req.session.destroy((err) => {
		res.redirect('/login')
	})
})






router.get('/status', (req, res, next)=> {
		res.send({
			session: req.session,
			user: req.user,
			authenticate: req.isAuthenticated()
		})
	})


module.exports = router;
