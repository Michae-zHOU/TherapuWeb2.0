var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
   console.error('here');
    res.render('404', {       
        title: '404',
        auth: function() {
            if (req.user) {
                return req.user.admin;
            }
        },
    });
});

module.exports = router;
