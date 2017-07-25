var express = require('express');
var router = express.Router();
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
router.get('/surveyTypes', function(req, res, next) {
    surveyTypes.find(function(err, doc) {
        if (err) {
            console.log(err)
        }
    res.json(doc)
    })
})
router.get('/articleTypes', function(req, res, next) {
    articleTypes.find(function(err, doc) {
        if (err) {
            console.log(err)
        }
    res.json(doc)
    })
})
router.get('/article/:type', function(req, res, next) {
    var type = req.params;
    articleCollection.find({typeIdentifier: type} ,function(err, doc) {
        if (err) {
            console.log(err)
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
router.get('/deleteUser/:id', adminRequired, function(req, res, next) {
    var { id } = req.params;
     console.log(id)
    userCollection.remove({_id:mongojs.ObjectId(id)}, function(err, removedUser) {
        if (err) {
            res.json(err)
        }
        if (!removedUser) {
            res.send('删除失败')
        }
        console.log(removedUser)
        res.json(removedUser)
    })
})
router.post('/register', adminRequired, upload.single('avatar'), function(req, res, next) {
    console.log(req.body)
    console.log(req.file)
    var user = req.body
    var dateObj = new Date();
    var month = dateObj.getUTCMonth() + 1; //months from 1-12
    var day = dateObj.getUTCDate();
    var year = dateObj.getUTCFullYear();
    newdate = year + " 年 " + month + " 月 " + day + " 日 ";
    
    userCollection.findOne({email: user.email}, function(err, duplicatedUser) {
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
                userAvatar: req.file,
            },  function(err, newUser) {
                req.session.newUser = newUser
                res.redirect('/setting')
            })
        }
    })
})
router.get('/session', function(req,res,next) {
    res.json(req.session)
})


module.exports = router;