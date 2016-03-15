module.exports={


	initializeDB: function(){
		var Knex = require('../../config/db').Knex;
		var promise = require('bluebird')

		//this is just to show that it works.  A better implementation would keep data,
		//find the most recent tweet, then fill from there
		drop_user = Knex.schema.dropTableIfExists("User")

		
		drop_tweet = Knex.schema.dropTableIfExists("Tweet")

		create_tweets = promise.all([drop_user, drop_tweet]).then(function(){


			create_user = Knex.schema.createTableIfNotExists('User', function(t){
				t.integer('id', 256).unsigned().primary();
				t.string('screen_name', 256).unique();
				t.integer('followers_count').unsigned();
				t.integer('friends_count').unsigned();
				t.integer('max_id');
				t.integer('start_id');
			});
			
			create_tweet = Knex.schema.createTableIfNotExists('Tweet', function(t){
				t.integer('id', 256).unsigned().primary();
				t.string('screen_name', 256).references("User");
				t.dateTime('time_created');
				t.string('source');
				t.string('text');
				t.boolean('is_url');
			});

			return promise.all([create_user, create_tweet]);
		})


		return create_tweets

	}

}