var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = require('../db')
var userCollection = db.collection('users');

/* GET home page. */
router.get('/', function(req, res, next) {
   
    res.render('about', { 
        partials: {
            header: '../views/partials/header',
            head: '../views/partials/head',
            scripts: '../views/partials/scripts',
            footer: '../views/partials/footer'
            },
        title: 'about',
        auth: function() {
            if (req.user) {
                return req.user.admin
            }
        }, 
    });
})

module.exports = router;