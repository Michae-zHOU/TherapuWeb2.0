var express = require('express');
var router = express.Router();
var logger = require('../logger');
var mongojs = require('mongojs');
var db = require('../db')
var userCollection = db.collection('users');
var surveyTypes = db.collection('surveyTypes');
var articleCollection = db.collection('articles');
var surveyCollection = db.collection('survey');
var articleTypes = db.collection('articleTypes');
var siteDataCollection = db.collection('siteData')
var userCollection = db.collection('users')
var multer  = require('multer')
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/assets/users/')
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}${file.originalname}`)
  }
})

var upload = multer({ storage: storage })
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
router.get('/primes', function(req, res, next) { 
    articleCollection.find().sort({priority: -1}).limit(5, function(err, primes) {       
        if (err) {
            res.send(err)
        }     
      
        res.json(primes)
    })
})
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
    var {id} = req.params;
    articleCollection.remove({_id: mongojs.ObjectId(id)}, function(err, doc) {
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
                password: user.password,
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

router.get('/session', function(req,res,next) {
    res.json(req.session)
})

module.exports = router;