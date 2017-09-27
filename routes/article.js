var express = require('express');
var router = express.Router();
var multer  = require('multer')
var mongojs = require('mongojs');
var db = require('../db')

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/assets/articles/')
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}${file.originalname}`)
  }
})

var upload = multer({ storage: storage, limits: {fileSize: 5000000}})

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

var userCollection = db.collection('users');
var surveyCollection = db.collection('survey');
var surveyResultsCollection = db.collection('surveyResults');
var articleCollection = db.collection('articles');
var articleTypes = db.collection('articleTypes')
var siteDataCollection = db.collection('siteData')
/* GET home page. */



/* GET home page. */
router.post('/create/article', authorRequired, upload.single('img'), function(req, res, next) {
        var article = req.body        

        var dateObj = new Date();
        var month = dateObj.getUTCMonth() + 1; //months from 1-12
        var day = dateObj.getUTCDate();
        var year = dateObj.getUTCFullYear();
        newdate = year + " 年 " + month + " 月 " + day + " 日 ";

        var typeArray = article.type.split(',')

        var newArticle = {
            author: req.user,
            article: article.article,
            title: article.title,
            description: article.description ? article.description: '',
            creationDateFormat: new Date(),
            created_at: newdate,
            typeIdentifier: typeArray[1],
            type: typeArray[0],
            articleImg: req.file,
            views: 0,
            priority: 0,
        }
        
        articleCollection.save(newArticle, (err, doc) => {
            if (err) {
                console.error(err)
            }
            res.redirect('/articles')
        })
})

router.get('/articles', function(req, res, next) {
    articleCollection.find({}).sort({creationDateFormat: -1}).limit(5, function(err, featuredArticles) {

  //article list data
    if (err) {
      console.error(err)
    }
      articleCollection.find().sort({creationDateFormat: -1}, function(err, AllArticle) {
            //全部文章
            if (err) {
              console.error(err)
            }
            var topAllArticle = AllArticle[0]
            var AllArticle = AllArticle
        articleCollection.find().sort({views: -1}, function(err, popularArticles) {
         //热门文章
          if (err) {
            console.error(err)
          }
          var topPopularArticle = popularArticles[0]
          var popularArticles = popularArticles
          articleCollection.find().sort({views: -1}).limit(5, function(err, carouselArticles) {
            //轮转文章
            if (err) {
              console.error(err)
            }
            articleCollection.find({typeIdentifier: "liangxing"}, function(err, liangxing) {
              if (err) {
                console.error(err)
              }
              var liangxingArticles = liangxing
              articleCollection.find({typeIdentifier: "jiaoyu"}, function(err, jiaoyu) {
                if (err) {
                  console.error(err)
                }
                var jiaoyuArticles = jiaoyu
                articleCollection.find({typeIdentifier: "zhichang"}, function(err, zhichang) {
                  if (err) {
                    console.error(err)
                  }
                  var zhichangArticles = zhichang
                  articleCollection.find({typeIdentifier: "jiating"}, function(err, jiating) {
                    if (err) {
                      console.error(err)
                    }
                    var jiatingArticles = jiating
                    articleCollection.find({typeIdentifier: "kepu"}, function(err, kepu) {
                      if (err) {
                        console.error(err)
                      }
                      var kepuArticles = kepu
                      articleCollection.find({typeIdentifier: "chengzhang"}, function(err, chengzhang) {
                        if (err) {
                          console.error(err)
                        }
                        var chengzhangArticles = chengzhang
                        articleCollection.find({typeIdentifier: "zixun"}, function(err, zixun) {
                            if (err) {
                                console.error(err)
                            }
                            var zixunArticles = zixun
                            articleCollection.find().sort({created_at:1}).limit(3, function(err, daily) {
                            if (err) {
                                console.error(err)
                            }
                            var dailyArticles = daily
                            siteDataCollection.find(function(err, siteData) {
                                articleCollection.find().limit(3).sort({priority: -1}, function(err, primeArticles) {
                                        if (err) {
                                            console.error(err)
                                        }
                                        var banner = siteData[0].homePageBanner;
                                        res.render('articles', { 
                                        partials: {
                                        header: '../views/partials/header',
                                        head: '../views/partials/head',
                                        scripts: '../views/partials/scripts',
                                        footer: '../views/partials/footer'
                                        },
                                        featuredArticles,
                                        AllArticle,
                                        popularArticles,
                                        topAllArticle,
                                        liangxingArticles,
                                        jiaoyuArticles,
                                        zhichangArticles,
                                        jiatingArticles,
                                        zixunArticles,
                                        kepuArticles,
                                        chengzhangArticles,
                                        dailyArticles,
                                        carouselArticles,
                                        banner,
                                        primeArticles,
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
  })
})

router.get('/article/:id', function(req, res, next) {
    console.error("1");
    const { id } = req.params;
    articleCollection.findOne({_id: mongojs.ObjectId(id)}, function(err, articleData) {
        if (err) {
            console.error(err);
	    return err;
        }
        
	if( !articleData){	           
	    return res.render('404', { url: req.url });
	}

	articleCollection.find({type: articleData.type}).limit(4, function(err, relatedStories) {
        if (err) {
            console.error(err);
        }
        articleCollection.update({_id: mongojs.ObjectId(id)}, {$inc: {views: 1}}, function(err, doc) {
        if (err) {
       	    console.error(err)
        }
        res.render('article', {
       	 partials: {
                        header: '../views/partials/header',
                        footer: '../views/partials/footer',
                        head: '../views/partials/head',
                        scripts: '../views/partials/scripts'
                    },
                    title: '文章',
                    articleData,
                    relatedStories,
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
/* GET home page. */
router.get('/article/new/create', authorRequired, function(req, res, next) {
    var types;
    articleTypes.find(function(err, docs) {
        if (err) {
            console.error(err)
        }
        types = docs
        res.render('createArticle', { 
                partials: {
                        header: '../views/partials/header',
                        footer: '../views/partials/footer',
                        head: '../views/partials/head',
                        scripts: '../views/partials/scripts'
                },
                title: 'Home',
                types,
                auth: function() {
                    if (req.user) {
                        return req.user.admin
                    }
                }, 
                user: req.user
        })
    })
       
    
})

router.get('/article/edit/:id', authorRequired, (req, res, next) => {
    const { id } = req.params;
    articleCollection.findOne({_id: mongojs.ObjectId(id)}, function(err, article) {
        if (err) {
            console.error(err)
        }
        if (!article) {
            console.error('document not found!')
        }
        articleTypes.find(function(err, types) {
            if (err) {
                console.error(err)
            }
            res.render('editArticle', {
                partials: {
                            header: '../views/partials/header',
                            footer: '../views/partials/footer',
                            head: '../views/partials/head',
                            scripts: '../views/partials/scripts'
                    },
                    articleId: id,
                    types,
                    articleTitle: article.title,
                    articleDescription: article.description,
                    articleBody: article.article,
                    articleImg: article.articleImg,
                    articleAuthor: article.author,
                    articleType: article.type,
                    articlePy: article.typeIdentifier,
                    auth: function() {
                    if (req.user) {
                        return req.user.admin
                    }
                }, 
            })
        })
    })
})
router.post('/edit/article/:id', authorRequired, (req, res, next) => {
    const {id} = req.params;
    const article = req.body;
    articleCollection.findOne({_id: mongojs.ObjectId(id)}, function(err, original) {
          
        articleCollection.update({_id: mongojs.ObjectId(id)}, {
            title: article.title,
            author: article.author,
            article: article.article,
            description: article.description,
            creationDateFormat: original.creationDateFormat,
            created_at: original.created_at,
            typeIdentifier: original.typeIdentifier,
            type: original.type,
            articleImg: original.articleImg,
            author: original.author,
            views: original.views
        }, function(err, updatedArticle) {
            if (err) {
                console.error(err)
            }
            if (!article) {
                console.error('document not updated!')
            }
            console.error('chagned:', updatedArticle)
            res.redirect(`/article/${id}`)
        })
    })
})




module.exports = router;
