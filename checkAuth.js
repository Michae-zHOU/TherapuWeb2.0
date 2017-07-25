var express = require('express');
var router = express.Router();
var db = require('./db')
var session = require('express-session')
var passport = require('passport')
require('./passport')

function loginRequired(req, res, next) {
	if (!req.isAuthenticated()) {
		return res.redirect('/login')
	}
	next()
}