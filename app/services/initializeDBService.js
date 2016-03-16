module.exports={


	initializeDB: function(){
		var Knex = require('../../config/db').Knex;
		var promise = require('bluebird')

		//this is just to show that it works.  A better implementation would keep data,
		//find the most recent tweet, then fill from there
		/*drop_user = Knex.schema.dropTableIfExists("User")

		
		drop_tweet = Knex.schema.dropTableIfExists("Tweet")

		create_tweets = promise.all([drop_user, drop_tweet]).then(function(){*/
			
			console.log("checking if user table exists")
			create_user = Knex.schema.hasTable('User').then(function(exists) {
				if (!exists) {
					console.log("creating user table")
					return Knex.schema.createTable('User', function(t){
						t.integer('id', 256).unsigned().primary();
						t.string('screen_name', 256).unique();
						t.integer('followers_count').unsigned();
						t.integer('friends_count').unsigned();
						t.integer('max_id');
						t.integer('start_id');
					});
				}
			});

			console.log("checking if tweet table exists")
			create_tweet = Knex.schema.hasTable('Tweet').then(function(exists) {
				if (!exists) {
					console.log("creating tweet table")
					return Knex.schema.createTable('Tweet', function(t){
						t.integer('id', 256).unsigned().primary();
						t.string('screen_name', 256).references("User");
						t.dateTime('time_created');
						t.string('source');
						t.string('text');
						t.boolean('is_url');
					});
				}
			});

			Knex.select().from("User").then(function(data){
				console.log("vanessa table:")
				console.log(data)
			})

			return promise.all([create_user, create_tweet]);
		/*})


		return create_tweets*/

	}

}