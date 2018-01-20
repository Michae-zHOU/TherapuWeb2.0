var mongoose = require("mongoose");

var schemaOptions = {
  collection: "articleTypes"
};

var schema = new mongoose.Schema({
  type: { type: String, required: true},  
  py: { type: String, required: true},
}, schemaOptions);

module.exports = mongoose.model("articleType", schema);
