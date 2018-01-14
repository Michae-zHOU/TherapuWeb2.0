var env = require('./env.json');

exports.config = function() {
	let env_node = process.env.NODE_ENV || 'development';

	return env[env_node];
};