var dbConfig = {
	client: 'sqlite',
	connection: {
		filename: "./db/twitterdb.sqlite"
	}
};

var Knex = require('knex')(dbConfig);

var services = require('../app/services');


//this function switches to the test database
module.exports.test = function(){
	var dbTestConfig = {
		client: 'sqlite',
		connection: {
			filename: "./db/twittertestdb.sqlite"
		},
		pool: {
			max: 1
		}
	};

	var testKnex = require('knex')(dbTestConfig);

	module.exports.Knex = testKnex
	return testKnex;
}

module.exports.Knex = Knex;