var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = require('../db')
var articleCollection = db.collection('articles')
var surveyCollection = db.collection('survey')
var siteDataCollection = db.collection('siteData')
var usersCollection = db.collection('users')
function authorRequired(req, res, next) {
	if (!req.isAuthenticated()) {
		return res.redirect('/login')
	}
	next()
}
function adminRequired(req, res, next) {
	if (req.user.admin !== 2) {
		return res.redirect('/login')
	}
	next()
}
/* GET home page. */
router.get('/setting', adminRequired, function(req, res, next) {
    articleCollection.find(function(err, articles) {
        if (err) {
            console.log(err)
        }
        surveyCollection.find(function(err, surveys) {
            if (err) {
                console.log(err)
            }
            siteDataCollection.find(function(err, siteData) {
                if (err) {
                    console.log(err)
                }
                usersCollection.find(function(err, users) {
                    if (err) {
                        console.log(err)
                    }
                    var homePageBannerData = siteData[0].homePageBanner
                    // console.log(req.session)
                    
                    res.render('setting', { 
                        partials: {
                        header: '../views/partials/header',
                        footer: '../views/partials/footer',
                        head: '../views/partials/head',
                        scripts: '../views/partials/scripts'
                    },
                    title: 'Home',
                    articles,
                    surveys,
                    users,
                    homePageBannerData,
                    session: req.session,
                    auth: function() {
                            if (req.user) {
                                return req.user.admin
                            }
                        }, 
                    }) 
                })
            })
        })
    })
})

module.exports = router;