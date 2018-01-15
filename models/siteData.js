var mongoose = require("mongoose");

var schemaOptions = {
  collection: "siteData"
};

var schema = new mongoose.Schema({
  homePageBanner: { type: String, required: true},
}, schemaOptions);

module.exports = mongoose.model("siteData", schema);
