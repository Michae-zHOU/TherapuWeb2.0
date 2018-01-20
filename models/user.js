var mongoose = require("mongoose");

var schemaOptions = {
  collection: "users"
};

var schema = new mongoose.Schema({
  email: { type: String, required: true},  
  password: { type: String, required: true},
  salt: {type:String, required: true},
  admin: {type: Boolean},
  fullName: { type: String, required: true},
  created_at:  { type: String, required: true},  
  creationDateFormat:  { type: Date, required: true},  
  userAvatar:Object,
  description:  { type: String},  
}, schemaOptions);

module.exports = mongoose.model("user", schema);
