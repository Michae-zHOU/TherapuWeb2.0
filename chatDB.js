var MongoClient = require("mongodb").MongoClient;
var mongoose = require("mongoose");

var url = "mongodb://localhost:27017/therapu";
var connect = MongoClient.connect(url);

mongoose.Promise = global.Promise;
mongoose.connect(url);

mongoose.set('debug', true);

var Article = require("./models/article");
var ArticleType = require("./models/articleType");
var SiteData = require("./models/siteData");
var User = require("./models/user");
module.exports = {
  connect,
  Article,
  ArticleType,
  SiteData,
  User,
  close: function () {
    connect.then(db => db.close());
    mongoose.disconnect();
  }
};
