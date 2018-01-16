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
      chatDB.Article.find({creationDateFormat: {'$gte': dateSearch}}).sort({creationDateFormat: -1, views: -1}).limit(3).exec(),  // [2] 本周精选      
      chatDB.SiteData.find({}).exec(),                                                                                            // [3] site 
    ];

    Promise.all(promises).then(function(results) {
        res.render('index', {          
            monthlyArticles: results[0],
            carouselArticles: results[1],
            weeklyArticles: results[2],
            siteData: results[3][0],          
            title: 'Home',
            auth: function() {
                if (req.user) {
                    return req.user.admin
                }
            },
        });
    }).catch(next);
});

// router.get('/articles', function(req, res, next){
//     var dateSearch = new Date();
//     dateSearch.setDate(dateSearch.getMonth());
//     chatDB.Article.find({creationDateFormat: {'$gte': dateSearch}}).sort({creationDateFormat: -1, views: -1}).limit(3).exec().then(function(article) {
//           res.json(article);                      
//     }).catch(next);
// });

module.exports = router;