var winston = require('winston');
var Mail = require('winston-mail').Mail;
var common = require('./util');
var config = common.config();

const tsFormat = () => (new Date()).toLocaleString();

var logger = new winston.Logger({
	transports:[
	new(winston.transports.Console)({
		level: config.logLevel,
		timestamp: tsFormat,
		colorize: true,
		prettyPrint: true
	}),
	new(Mail)({
		to: config.email,
		from: 'therapuqingyu@gmail.com',
		subject: config.subject,
		level: 'error',
		host: 'smtp.gmail.com',
		username: 'therapuqingyu@gmail.com',
		password: 'qingyu123',
		ssl: true
	})
	],
	exceptionHandlers:[
	new(winston.transports.Console)({	
		timestamp: tsFormat,
		colorize: true,
		prettyPrint: true,
		humanReadableUnhandledException: true
	}),
	new(Mail)({
		to: config.email,
		from: 'therapuqingyu@gmail.com',
		subject: config.subject,
		level: 'error',
		host: 'smtp.gmail.com',
		username: 'therapuqingyu@gmail.com',
		password: 'qingyu123',
		ssl: true
	})
	],
	exitOnError: false
});

module.exports = logger;