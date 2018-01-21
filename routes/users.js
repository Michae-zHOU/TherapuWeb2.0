var express = require('express');
var router = express.Router();
var chatDB = require("../chatDB");
var crypt = require('../crypt');
const Promise = require('bluebird');
var multer = require('multer')
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

// Create New User
router.route('/new',adminRequired)
    .all(function(req, res, next) {
        var id = req.params.email;
        chatDB.User.findOne({email:id}).exec()
        .then(user => {
            if (user) {
                req.session.duplicatedUser = duplicatedUser
                res.redirect(`/setting#userManagement`)
            }          
            next()
        }).catch(next);
    })
   .get(authorRequired, function(req, res) {
    res.render('createUser', {        
        auth: function() {
            if (req.user) {
                return req.user.admin
            }
        }})
    })
   .post(authorRequired, upload.single('avatar'), function(req, res, next) {   
    var user = new chatDB.User();
    userCreateFromRequestBody(user, req);
    console.log(user);
    user.save().then(() => res.redirect('/setting#userManagement')).catch(next);
});

/* Post Data from Edit Article Page to DB */
router.route('/edit/:id', adminRequired).all(function(req, res, next) {
    var id = req.params.id;
    chatDB.User.findById(id).exec()
        .then(user => {
            if (!user) {
                res.sendStatus(404);
                return;
            }
            res.locals.user = user;
            next()
        }).catch(next);
    })
    .get(adminRequired, function(req, res) {
        res.render('editUser', {
            user: res.locals.user,
            auth: function() {
                if (req.user) {
                    return req.user.admin
                }
            },
        })
    })
    .post(adminRequired, function(req, res, next) {
        userFromRequestBody(res.locals.user, req);
        res.locals.user.save()
            .then(() => res.redirect("/setting/"))
            .catch(error => {
                if (error.name === "ValidationError") {
                    res.locals.errors = error.errors;
                    res.render("/users/edit/" + res.locals.user.id);
                    return;
                }
                next(error);
            });
    });

function userCreateFromRequestBody(user, req) {
    var dateObj = new Date();
    var month = dateObj.getUTCMonth() + 1; //months from 1-12
    var day = dateObj.getUTCDate();
    var year = dateObj.getUTCFullYear();
    newdate = year + " 年 " + month + " 月 " + day + " 日 ";

    var content = req.body;
    user.email= content.email;
    user.fullName = content.fullName;
    user.description = content.description || "";
    user.admin = content.type || 1;
   
    let passwordData = crypt.createPassword(content.password);
    user.password = passwordData.passwordHash;
    user.salt = passwordData.salt;
    
    user.created_at = newdate;
    user.creationDateFormat = dateObj;
    user.userAvatar= req.file ? req.file : {filename: "user-default.jpg"};
    user.lastLogin = dateObj;
}


function userFromRequestBody(user, req) {
    var content = req.body
    user.fullName = content.fullName;
    user.description = content.description || "";
    user.admin = content.type || 1
    if (content.password) {
        let passwordData = crypt.createPassword(content.password);
        user.password = passwordData.passwordHash;
        user.salt = passwordData.salt;
    }
}

module.exports = router;
