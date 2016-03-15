module.exports={


	initializeDB: function(){
		var Knex = require('../../config/db').Knex;

		//this is just to show that it works.  A better implementation would keep data,
		//find the most recent tweet, then fill from there
		promise = Knex.schema.dropTableIfExists("User").then(function(){
			return Knex.schema.dropTableIfExists("Tweet")
		})
		.then(function(){
			return Knex.schema.createTableIfNotExists('User', function(t){
				t.integer('id', 256).unsigned().primary();
				t.string('screen_name', 256).unique();
				t.integer('followers_count').unsigned();
				t.integer('friends_count').unsigned();
			});
		})
		.then(function(){
			return Knex.schema.createTableIfNotExists('Tweet', function(t){
				t.integer('id', 256).unsigned().primary();
				t.string('screen_name', 256).references("User");
				t.dateTime('time_created');
				t.string('active_time');
				t.string('source');
				t.string('text');
				t.boolean('has_urls');

			});
		})
	}

}