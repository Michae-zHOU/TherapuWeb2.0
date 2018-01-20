var express = require('express');
var router = express.Router();
var logger = require('../logger');
var mongojs = require('mongojs');
var db = require('../db')
var chatDB = require("../chatDB");
var userCollection = db.collection('users');
var surveyTypes = db.collection('surveyTypes');
var articleCollection = db.collection('articles');
var surveyCollection = db.collection('survey');
var articleTypes = db.collection('articleTypes');
var siteDataCollection = db.collection('siteData')
var userCollection = db.collection('users')
var crypt = require('../crypt');
var multer  = require('multer')

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/assets/articles/')
    },
    filename: function(req, file, cb) {
        cb(null, `${Date.now()}${file.originalname}`)
    }
});

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
/* GET home page. */
router.post('/updatePrime', function(req, res, next) {
    var primes = req.body;
     
    for (var i in primes) {            
        if (primes[i] !== null && primes[i] !== '')
        {
           articleCollection.update({_id: mongojs.ObjectId(primes[i])}, {$set: {priority:  new Date() }}, function(err, result) {
            if (err) {
                res.send(err)
            }

            if (!result) {
                res.send('没有查到第一个输入框内的文章ID，请确认后重试')
            }            
        });
       }                    
   }

    res.redirect('/setting');  
})

router.get('/get_week', function(req, res, next){
    var pageNo = parseInt(req.query.pg)
    var size = 3
    var query = {}
    if(pageNo < 0 || pageNo === 0 || pageNo > 50 || size > 20) {
        response = {"error" : true,"message" : "invalid page number, should start with 1"};
        return res.json(response)
    }
    query.skip = size * (pageNo - 1)
    query.limit = size 

    var dateSearch = new Date();
    dateSearch.setDate(dateSearch.getMonth());
    //chatDB.Article.find({creationDateFormat: {'$gte': dateSearch}}).sort({creationDateFormat: -1, views: -1}).exec().then(function(article) {
    chatDB.Article.find().sort({creationDateFormat: -1, views: -1}).limit(query.limit).skip(query.skip).exec().then(function(article) {
          res.json(article);                      
    }).catch(next);
});


router.get("/articles", function (req, res, next) {
   chatDB.Article.find({},'-author').exec()
    .then(function (articles) {
      res.json(articles);
    })
    .catch(next);
});

router.get("/articlesP", function (req, res, next) {
    var offset =  parseInt(req.query.offset) || 0,
        limit =  parseInt(req.query.limit) || 800,      
        search = req.query.search || '',
        name = req.query.sort || 'creationDateFormat',
        order = req.query.order || 'desc',
        sort = {},  
        result = {
                    total: req.query.total || 800,
                    rows: []
                };

    sort[name] = order;

    var promises = [    
      chatDB.Article.count({}).exec(),
      chatDB.Article.find({'title': {'$regex': search}},'-author').sort(sort).skip(offset).limit(limit).exec()  
    ];

    Promise.all(promises).then(function(results) {
          result.total = results[0];
          result.rows = results[1];
          res.json(result);
    }).catch(next);
});


router.get("/users", adminRequired, function (req, res, next) {
    var offset =  parseInt(req.query.offset) || 0,
        limit =  parseInt(req.query.limit) || 800,      
        search = req.query.search || '',
        name = req.query.sort || 'creationDateFormat',
        order = req.query.order || 'desc',
        sort = {},  
        result = {
                    total: req.query.total || 800,
                    rows: []
                };

    sort[name] = order;

    var promises = [    
      chatDB.User.count({}).exec(),
      chatDB.User.find({'email': {'$regex': search}}).sort(sort).skip(offset).limit(limit).exec()  
    ];

    Promise.all(promises).then(function(results) {
          result.total = results[0];
          result.rows = results[1];
          res.json(result);
    }).catch(next);
});


router.get("/articles/:articleId", function (req, res, next) {
   chatDB.Article.findbyId({_id: req.params.id}).exec()
    .then(function (articles) {
      res.json(articles);
    })
    .catch(next);
});

router.get('/surveyTypes', function(req, res, next) {
    surveyTypes.find(function(err, doc) {
        if (err) {
            logger.error(err)
        }
    res.json(doc)
    })
})
router.get('/articleTypes', function(req, res, next) {
    articleTypes.find(function(err, doc) {
        if (err) {
            logger.error(err)
        }
    res.json(doc)
    })
})
router.get('/article/:type', function(req, res, next) {
    var type = req.params;
    articleCollection.find({typeIdentifier: type} ,function(err, doc) {
        if (err) {
            logger.error(err)
        }
    res.json(doc)
    })
})
router.get('/survey/:id', function(req, res, next) {
    var { id } = req.params;
    surveyCollection.findOne({_id: mongojs.ObjectId(id)}, function(err, doc) {
        res.json(doc)
    })
})
router.get('/delete/article/:id', adminRequired, function(req, res, next) {   
    chatDB.Article.remove({_id: req.id}, function(err, doc) {
        res.send(doc.title)
    })
})
router.get('/delete/survey/:id',  adminRequired, function(req, res, next) {
    var {id} = req.params;
    surveyCollection.remove({_id: mongojs.ObjectId(id)}, function(err, doc) {
        res.send(doc.title)
    })
})
router.get('/update/homePageBanner/:newBanner', adminRequired, function(req, res, next) {
    var { newBanner } = req.params;
    if (newBanner == 'empty') {
        siteDataCollection.find(function(err, data) {
            var original = data[0]
            siteDataCollection.update({_id: mongojs.ObjectId(original._id)}, {homePageBanner: ''}, function(err, doc) {
                res.json(doc)
            })
        })
    } else {
        siteDataCollection.find(function(err, data) {
            var original = data[0]
            siteDataCollection.update({_id: mongojs.ObjectId(original._id)}, {homePageBanner: newBanner ? newBanner : ''}, function(err, doc) {
                res.json(doc)
            })
        })
    }
})
router.get('/delete/user/:id', adminRequired, function(req, res, next) {
    var { id } = req.params;   
    userCollection.remove({_id:mongojs.ObjectId(id)}, function(err, removedUser) {
        if (err) {          
            logger.error(err)
            return err
        }
        if (!removedUser) {
            res.send('删除失败')
        }        
        res.json(removedUser)
    })
})

// create a new user
router.post('/register', adminRequired, upload.single('avatar'), function(req, res, next) {

    var user = req.body
    var dateObj = new Date();
    var month = dateObj.getUTCMonth() + 1; //months from 1-12
    var day = dateObj.getUTCDate();
    var year = dateObj.getUTCFullYear();
    newdate = year + " 年 " + month + " 月 " + day + " 日 ";
    
    userCollection.findOne({email: user.email}, function(err, duplicatedUser) {

        let passwordData = crypt.createPassword(user.password);

        if (err) {
            logger.error(err);
            return err;
        }

        if (duplicatedUser) {
            req.session.duplicatedUser = duplicatedUser
            res.redirect(`/setting#userManagement`)
        } else {            
            userCollection.save({
                email: user.email,
                password: passwordData.passwordHash,
                salt: passwordData.salt,
                description: user.description,
                admin: 1,
                fullName: user.fullName,
                created_at: newdate,
                creationDateFormat: dateObj,
                userAvatar: req.file ? req.file : {filename: "user-default.jpg"},
            },  function(err, newUser) {
                req.session.newUser = newUser
                res.redirect(`/setting#userManagement`)
            })
        }
    })
})

router.post('/uploader', adminRequired,  function(req, res, next){  
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


router.get('/session', function(req,res,next) {
    res.json(req.session)
})


module.exports = router;