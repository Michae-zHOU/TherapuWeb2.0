var mongoose = require("mongoose");

var schemaOptions = {
  collection: "articles"
};

var schema = new mongoose.Schema({
  title: { type: String, required: true},
  article: String,
  description: String,
  creationDateFormat: Date ,
  typeIdentifier: String,
  type: { type: String, required: true},
  articleImg: Object,
  views: Number,
  created_at: String,
  author: { type: String, required: true},
  priority: Number,
}, schemaOptions);

module.exports = mongoose.model("article", schema);
