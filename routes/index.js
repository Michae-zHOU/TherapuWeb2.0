var express = require('express');
var router = express.Router();
var chatDB = require("../chatDB");
const Promise = require('bluebird');

router.get('/', function(req, res, next) {

    var dateSearch = new Date();
    dateSearch.setDate(dateSearch.getMonth());

    var promises = [    
      chatDB.Article.find({}).sort({creationDateFormat: -1, views: -1}).limit(6).exec(),                                          // [0] 本月热门
      chatDB.Article.find({}).sort({priority: -1, views: -1}).limit(5).exec(),                                                    // [1] 轮转文章
      chatDB.SiteData.find({}).exec(),                                                                                            // [2] site 
    ];

    Promise.all(promises).then(function(results) {
        res.render('index', {          
            monthlyArticles: results[0],
            carouselArticles: results[1],         
            siteData: results[2][0],          
            title: 'Home',
            auth: function() {
                if (req.user) {
                    return req.user.admin
                }
            },
        });
    }).catch(next);
});

module.exports = router;