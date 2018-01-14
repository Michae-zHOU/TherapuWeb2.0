var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
   console.error('here');
    res.render('404', {
        partials: {
            header: '../views/partials/header',
            head: '../views/partials/head',
            scripts: '../views/partials/scripts',
            footer: '../views/partials/footer',
            },
        title: '404',
        auth: function() {
            if (req.user) {
                return req.user.admin;
            }
        },
    });
});

module.exports = router;
