var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = require('../db')
var userCollection = db.collection('users');
var surveyCollection = db.collection('survey');
var surveyResultsCollection = db.collection('surveyResults');
var articleCollection = db.collection('articles');
var siteDataCollection = db.collection('siteData')


router.get('/test/article', (req, res) => {
  articleCollection.find({}).sort({creationDateFormat: 1}).limit(10, function(err, featuredArticles) {
                  res.json(featuredArticles)
  })
})
router.get('/', function(req, res, next) {
  /* GET home page. */
  
  
articleCollection.find({}).sort({creationDateFormat: -1}).limit(6, function(err, featuredArticles) {
  //article list data
    if (err) {
      console.log(err)
    }
    console.log(featuredArticles.length)
      articleCollection.find().sort({creationDateFormat: -1}, function(err, AllArticle) {
            //全部文章
            if (err) {
              console.log(err)
            }
            var topAllArticle = AllArticle[0]
            var AllArticle = AllArticle
           
        articleCollection.find().sort({views: -1}, function(err, popularArticles) {
         //热门文章
          if (err) {
            console.log(err)
          }
          
          var topPopularArticle = popularArticles[0]
          var popularArticles = popularArticles
          articleCollection.find().sort({views: -1}).limit(5, function(err, carouselArticles) {
            //轮转文章
            if (err) {
              console.log(err)
            }
            articleCollection.find({typeIdentifier: "hunlian"}, function(err, hunlian) {
              if (err) {
                console.log(err)
              }
              var topHunlianArticle = hunlian[0]
              var hunlianArticles = hunlian
              articleCollection.find({typeIdentifier: "jiankang"}, function(err, jiankang) {
                if (err) {
                  console.log(err)
                }
                var jiankangArticles = jiankang
                var topJiankangArticle = jiankang[0]
                articleCollection.find({typeIdentifier: "zhichang"}, function(err, zhichang) {
                  if (err) {
                    console.log(err)
                  }
                  var zhichangArticles = zhichang
                  var topZhichangArticle = zhichang[0]
                  articleCollection.find({typeIdentifier: "xingxinli"}, function(err, xingxinli) {
                    if (err) {
                      console.log(err)
                    }
                    var xingxinliArticles = xingxinli
                    var topXingxinliArticle = xingxinli[0]
                    articleCollection.find({typeIdentifier: "kepu"}, function(err, kepu) {
                      if (err) {
                        console.log(err)
                      }
                      var kepuArticles = kepu
                      var topKepuArticle = kepu[0]
                      articleCollection.find({typeIdentifier: "chengzhang"}, function(err, chengzhang) {
                        if (err) {
                          console.log(err)
                        }
                        var chengzhangArticles = chengzhang
                        var topChengzhangArticle = chengzhang[0]
                        var dateSearch = new Date();
                        dateSearch.setDate(dateSearch.getMonth() - 1);
                        articleCollection.find({ creationDateFormat: { '$lte': dateSearch} }).limit(3).sort({ views: -1 }, function (err, daily) {
                          if (err) {
                            console.log(err)
                          }
                        var dailyArticles = daily
                        siteDataCollection.find(function(err, siteData) {
                          var banner = siteData[0].homePageBanner;
                          res.render('index', {
                            partials: {
                              header: '../views/partials/header',
                              head: '../views/partials/head',
                              scripts: '../views/partials/scripts',
                              footer: '../views/partials/footer'
                            },
                            featuredArticles,
                            AllArticle,
                            popularArticles,
                            topHunlianArticle,
                            topAllArticle,
                            hunlianArticles,
                            topJiankangArticle,
                            jiankangArticles,
                            topZhichangArticle,
                            zhichangArticles,
                            xingxinliArticles,
                            topXingxinliArticle,
                            kepuArticles,
                            topKepuArticle,
                            chengzhangArticles,
                            topChengzhangArticle,
                            dailyArticles,
                            carouselArticles,
                            banner,
                            title: 'Home',
                            auth: function() {
                              if (req.user) {
                                  return req.user.admin
                              }
                            }, 
                          });
                        })
                      })
                    })
                  })
                })
              })
            })
          })
        })
      })
    })
  })
})

module.exports = router;
