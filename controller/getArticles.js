var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = require('../db')

var userCollection = db.collection('users');
var surveyCollection = db.collection('survey');
var surveyResultsCollection = db.collection('surveyResults');
var articleCollection = db.collection('articles');


module.exports = function getArticles() {
    /* GET home page. */
    var newestArticles;
    var featuredArticles;
    var fourAllArticles;
    var topAllArticle;
    var popularArticles;

    var topShehuiArticle;
    var shehuiArticles;
    var topJiaoyuArticle;
    var jiaoyuArticles;
    var topQingganArticle;
    var qingganArticles;
    var dailyArticles;

    articleCollection.find({}).limit(5, function(err, data) {
        if (err) {
        console.log(err)
        }
    featuredArticles = data
    })
    articleCollection.find().sort({views: 1}).limit(1, function(err, data) {
        if (err) {
            console.log(err)
        }
    topAllArticle = data[0]
    })
    articleCollection.find({}).sort({created_at: 1}, function(err, data) {
    if (err) {
        console.log(err)
    }
    newestArticles = data
    })
    articleCollection.find().sort({views: 1}, function(err, data) {
            if (err) {
            console.log(err)
            }
    fourAllArticle = data
    })
    articleCollection.find().sort({likes: 1}, function(err, data) {
            if (err) {
            console.log(err)
            }
    popularArticles = data
    })

    articleCollection.find({typeIdentifier: "shehui"}).limit(1, function(err, data) {
            if (err) {
            console.log(err)
            }
    topShehuiArticle = data[0]
    })
    articleCollection.find({typeIdentifier: "shehui"}, function(err, data) {
            if (err) {
            console.log(err)
            }
    shehuiArticles = data
    })
    articleCollection.find({typeIdentifier: "jiaoyu"}).limit(1, function(err, data) {
            if (err) {
            console.log(err)
            }
    topJiaoyuArticle = data[0]
    })
    articleCollection.find({typeIdentifier: "jiaoyu"}, function(err, data) {
            if (err) {
            console.log(err)
            }
    jiaoyuArticles = data
    })
    articleCollection.find({typeIdentifier: "qinggan"}).limit(1, function(err, data) {
            if (err) {
            console.log(err)
            }
    topQingganArticle = data[0]
    })
    articleCollection.find({typeIdentifier: "qinggan"}, function(err, data) {
            if (err) {
            console.log(err)
            }
    qingganArticles = data
    })
    articleCollection.find().sort({created_at:1}).limit(3, function(err, data) {
            if (err) {
            console.log(err)
            }
            for(var i=0; i < data.length; i++ ) {
            var str = data[i].article.substr(0, 100)
            data[i].article = str 
            }
    dailyArticles = data
    })



}

