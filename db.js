var mongojs = require('mongojs');
var db = mongojs('mongodb://localhost:27017/therapu', ['users']);


module.exports = db;