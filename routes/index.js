var express = require('express');
var router = express.Router();
var logger = require('../logger');
var mongojs = require('mongojs');
var db = require('../db')
var articleCollection = db.collection('articles');
var siteDataCollection = db.collection('siteData')


router.get('/', function(req, res, next) {

    //本月热门
    articleCollection.find({}).sort({
        creationDateFormat: -1,
        views: -1
    }).limit(6, function(err, monthlyArticles) {
        //article list data
        if (err) {
            logger.error(err)
            return
        }

        //轮转文章
        articleCollection.find().limit(5).sort({
            priority: -1,
            views: -1
        }, function(err, carouselArticles) {

            if (err) {
                logger.error(err)
                return
            }

            var dateSearch = new Date();
            dateSearch.setDate(dateSearch.getMonth());

            //每周精选
            articleCollection.find({
                creationDateFormat: {
                    '$gte': dateSearch
                }
            }).limit(3).sort({
                creationDateFormat: -1,
                views: -1
            }, function(err, weekly) {
                if (err) {
                    logger.error(err);
                    return;
                }

                var weeklyArticles = weekly

                siteDataCollection.find(function(err, siteData) {

                    if (err) {
                        logger.error(err);
                        return;
                    }

                    var banner = siteData[0].homePageBanner;
                    res.render('index', {
                        partials: {
                            header: '../views/partials/header',
                            head: '../views/partials/head',
                            scripts: '../views/partials/scripts',
                            footer: '../views/partials/footer'
                        },
                        weeklyArticles,
                        monthlyArticles,                       
                        carouselArticles,
                        banner,
                        title: 'Home',
                        auth: function() {
                            if (
                                req
                                .user
                            ) {
                                return req
                                    .user
                                    .admin
                            }
                        },
                    });
                })
            })
        })
    })
})

module.exports = router;