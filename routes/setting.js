var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = require('../db')
var articleCollection = db.collection('articles')
var surveyCollection = db.collection('survey')
var siteDataCollection = db.collection('siteData')
var usersCollection = db.collection('users')
function authorRequired(req, res, next) {
    console.log(req.admin ? req.admin : 'no user')
	if (!req.isAuthenticated()) {
		return res.redirect('/login')
    }
	next()
}
function adminRequired(req, res, next) {
    console.log(req.admin ? req.admin : 'no user')
	if (!req.user || req.user.admin == 1) {
		return res.redirect('/login')
    }
	next()
}
/* GET home page. */

router.get('/setting', adminRequired, function(req, res, next) {
    articleCollection.find().sort({_id: -1},function(err, articles) {
        if (err) {
            console.log(err)
        }
        surveyCollection.find().sort({_id: -1}, function(err, surveys) {
            if (err) {
                console.log(err)
            }
            console.log(surveys)
            siteDataCollection.find(function(err, siteData) {
                if (err) {
                    console.log(err)
                }
                usersCollection.find().sort({creationDateFormat: -1}, function(err, users) {
                    if (err) {
                        console.log(err)
                    }
                    articleCollection.find().sort({priority: -1}, function(err, primes) {
                        var homePageBannerData = siteData[0].homePageBanner
                        console.log(primes[0].priority, primes[1].priority, primes[2].priority)
                        
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
                        primes,
                        homePageBannerData,
                        flash: req.flash('updateMessage'),
                        session: req.session,
                        auth: function() {
                                if (req.user) {
                                    return req.user.admin
                                }
                                if (!req.user.admin) {
                                    return null
                                }
                            }, 
                        }) 
                    })
                })
            })
        })
    })
})

module.exports = router;