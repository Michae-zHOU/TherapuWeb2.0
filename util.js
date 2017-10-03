var env = require('./env.json');

exports.config = function(){
	var env_node = process.env.NODE_ENV || 'development';

	return env[env_node];
}