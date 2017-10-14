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
	if (!req.user || req.user.admin == 1) {
		return res.redirect('/login')
    }
	next()
}

/* GET home page. */
router.get('/authorSetting', authorRequired, function(req, res, next) {
    //console.error(mongojs.ObjectId(req.user._id))

    articleCollection.find({
        "author._id": mongojs.ObjectId(req.user._id)
    }).sort({_id: -1},function(err, articles) {
        if (err) {
            console.error(err)
            return
        }
      
        surveyCollection.find({
            "author._id": mongojs.ObjectId(req.user._id)
        }).sort({_id: -1}, function(err, surveys) {
            if (err) {
                console.error(err)
                return
            }
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

router.get('/setting', adminRequired, function(req, res, next) {
    articleCollection.find().sort({_id: -1},function(err, articles) {
        if (err) {
            console.error(err)
            return
        }
        surveyCollection.find().sort({_id: -1}, function(err, surveys) {
            if (err) {
                console.error(err)
                return
            }
            siteDataCollection.find(function(err, siteData) {
                if (err) {
                    console.error(err)
                    return
                }
                usersCollection.find().sort({creationDateFormat: -1}, function(err, users) {
                    if (err) {
                        console.error(err)
                        return
                    }
                    articleCollection.find().sort({priority: -1}).limit(5, function(err, primes) {  


                        if (err) {
                            console.error(err)
                            return
                        }

                        primes.forEach(function(element, index){
                            element.idx = index;
                        });

                        var homePageBannerData = siteData[0].homePageBanner
                        
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