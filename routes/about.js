var express = require('express');
var router = express.Router();
var logger = require('../logger');
var mongojs = require('mongojs');
var db = require('../db');
var userCollection = db.collection('users');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('about', {
        partials: {
            header: '../views/partials/header',
            head: '../views/partials/head',
            scripts: '../views/partials/scripts',
            footer: '../views/partials/footer',
            },
        title: 'about',
        auth: function() {
            if (req.user) {
                return req.user.admin;
            }
        },
    });
});
router.get('/waiver', function(req, res, next) {
    res.render('waiver', {
        partials: {
            header: '../views/partials/header',
            head: '../views/partials/head',
            scripts: '../views/partials/scripts',
            footer: '../views/partials/footer',
            },
        title: '法律声明',
        auth: function() {
            if (req.user) {
                return req.user.admin;
            }
        },
    });
});
router.get('/copyright', function(req, res, next) {
    res.render('copyright', {
        partials: {
            header: '../views/partials/header',
            head: '../views/partials/head',
            scripts: '../views/partials/scripts',
            footer: '../views/partials/footer',
            },
        title: '版权及免责声明',
        auth: function() {
            if (req.user) {
                return req.user.admin;
            }
        },
    });
});
router.get('/privacy', function(req, res, next) {
    res.render('privacy', {
        partials: {
            header: '../views/partials/header',
            head: '../views/partials/head',
            scripts: '../views/partials/scripts',
            footer: '../views/partials/footer',
            },
        title: '隐私权保护声明',
        auth: function() {
            if (req.user) {
                return req.user.admin;
            }
        },
    });
});


module.exports = router;
