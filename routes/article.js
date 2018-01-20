var express = require('express');
var router = express.Router();
var logger = require('../logger');
var multer = require('multer')
var chatDB = require("../chatDB");
const Promise = require('bluebird');

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/assets/articles/')
    },
    filename: function(req, file, cb) {
        cb(null, `${Date.now()}${file.originalname}`)
    }
})

var upload = multer({
    storage: storage,
    limits: {
        fileSize: 1000000 // 1MB
    }
});

var uploadCKEditorImg = multer({
    storage: storage,
    limits: {
        fileSize: 1000000 // 1MB
    }
}).single('upload');

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

function articleFromRequestBody(article, req) {
        var content = req.body
        var dateObj = new Date();
        var month = dateObj.getUTCMonth() + 1; //months from 1-12
        var day = dateObj.getUTCDate();
        var year = dateObj.getUTCFullYear();
        var newdate = year + " 年 " + month + " 月 " + day + " 日 ";
        var typeArray = content.type.split(',');
        var authorShown = content.author === ''? req.user.fullName : content.author;

         article.creator = req.user;
         article.author= authorShown;
         article.article= content.article;
         article.title= content.title;
         article.description = content.description ? content.description : '';
         article.creationDateFormat = new Date();
         article.created_at = newdate;
         article.typeIdentifier = typeArray[1];
         article.type = typeArray[0];
         article.articleImg = req.file;
         article.views = 0;
         article.priority= 0;
}

router.route('/new', authorRequired).all(function(req, res, next) {
    chatDB.ArticleType.find({}).exec()
        .then(types => {
            res.locals.types = types;
            next()
        }).catch(next);
}).get(function(req, res) {
    res.render('createArticle', {
        types: res.locals.types,
        auth: function() {
            if (req.user) {
                return req.user.admin
            }
        },
        user: req.user
    })
}).post(authorRequired, upload.single('img'), function(req, res, next) {
    var article = new chatDB.Article();
    articleFromRequestBody(article, req);
    article.save().then(() => res.redirect('/setting')).catch(next);
});

router.get('/', function(req, res, next) {
    var promises = [    
      chatDB.Article.find({}).sort({creationDateFormat: -1}).exec(),            // [0] all article
      chatDB.Article.find({}).sort({views: -1}).limit(5).exec(),                // [1] carouselArticles
      chatDB.Article.find({typeIdentifier: "liangxing"}).exec(),                // [2] liangxing
      chatDB.Article.find({typeIdentifier: "jiaoyu"}).exec(),                   // [3] jiaoyu
      chatDB.Article.find({typeIdentifier: "zhichang"}).exec(),                 // [4] zhichang
      chatDB.Article.find({typeIdentifier: "jiating"}).exec(),                  // [5] jiating
      chatDB.Article.find({typeIdentifier: "kepu"}).exec(),                     // [6] jiaoyu
      chatDB.Article.find({typeIdentifier: "chengzhang"}).exec(),               // [7] chengzhang     
      chatDB.Article.find({typeIdentifier: "zixun"}).exec(),                    // [8] zixun   
      chatDB.Article.find({}).sort({created_at: 1}).limit(3).exec(),            // [9] daily
      chatDB.Article.find({}).sort({views: -1}).limit(20).exec(),               // [10] popular       
    ];

    Promise.all(promises).then(function(results) {
        res.render('articles', {           
            AllArticle: results[0],
            liangxingArticles: results[2],
            jiaoyuArticles: results[3],
            zhichangArticles: results[4],
            jiatingArticles: results[5],
            zixunArticles: results[8],
            kepuArticles: results[6],
            chengzhangArticles: results[7],
            dailyArticles: results[9],
            carouselArticles: results[1],
            popularArticles: results[10],
            title: 'Home',
            auth: function() {
                if (req.user) {
                    return req.user.admin
                }
            },
        });
    }).catch(next);
})

router.get('/:id', function(req, res, next) {
    chatDB.Article.findById(req.params.id, '-author').exec().then(function(article) {
            chatDB.Article.find({
                    type: article.type
                }, '-author').sort({
                    views: -1
                }).limit(4).exec()
                .then(function(relatedStories) {
                    res.render('article', {                      
                        title: '文章',
                        article,
                        relatedStories,
                        auth: function() {
                            if (req.user) {
                                return req.user.admin
                            }
                        },
                    })
                });
        })
        .catch(next);
})

/* Post Data from Edit Article Page to DB */
router.route('/edit/:id', authorRequired).all(function(req, res, next) {
    var id = req.params.id;
    chatDB.Article.findById(id).exec()
        .then(article => {
            if (!article) {
                res.sendStatus(404);
                return;
            }
            res.locals.article = article;
            next()
        }).catch(next);
    })
    .get(function(req, res) {
        res.render('editArticle', {
            article: res.locals.article,
            auth: function() {
                if (req.user) {
                    return req.user.admin
                }
            },
        })
    })
    .post(function(req, res, next) {
        articleFromRequestBody(res.locals.article, req);
        res.locals.article.save()
            .then(() => res.redirect("/article/" + res.locals.article.id))
            .catch(error => {
                if (error.name === "ValidationError") {
                    res.locals.errors = error.errors;
                    res.render("/edit/article");
                    return;
                }
                next(error);
            });
    });

router.post('/uploader', function(req, res, next){
    uploadCKEditorImg(req, res, function(err){
        if(err){
            var result = {
                "uploaded": 0,
                "error": {
                    "message" : "The file is too large."
                }
            }
            return res.send(result);
        };
        var result = {
            "uploaded" : 1,
            "fileName": req.file.filename,
            "url": "/assets/articles/" + req.file.filename,
        };
        res.send(result);
    });
}); 

module.exports = router;