//temporary until I abstract these away.  I will be changing the values as soon as the project is over
CONSUMER_KEY = 'Mp9SqyDViTRezM0C4lz6EWXuo'
CONSUMER_SECRET = 'DDZTiKKakRNFAACXKEJPEygHZTSOgvaJh4ZZzkWnYuIoCqQbkf'
access_token_key = '4100378968-ofeWCenRlX46fte4teRkDsYOgMYWWj6S75P4qG9'
access_token_secret = 'BXwI1S8z0MdN4TbwOIiP1kdfLXRovRzJKkjAdjiiOZW5t'

var promise = require('bluebird')
//different twitter library because I need promise support
var twitter = require('twit')
var Knex = require('../../config/db').Knex;

//dictionary for max id storage when we run out of allowed queries
var max_ids = {}


var client = new twitter({
		consumer_key: CONSUMER_KEY, 
		consumer_secret: CONSUMER_SECRET,
		access_token: access_token_key,
		access_token_secret: access_token_secret,
		timeout_ms: 60*1000
	});



//this function allows for promisified cursoring through the tweets
function get_tweets_and_insert(screen_name){
	var Knex = require('../../config/db').Knex;


	return Knex.raw('SELECT MIN(id) AS max_id FROM Tweet WHERE screen_name="'+screen_name+'" COLLATE NOCASE')
	.then(function(data){
		console.log("\ncollecting a batch of tweets")
		console.log("max_id:")
		console.log(data[0].max_id-1)
		max_id = data[0].max_id-1
		params = {"screen_name": screen_name, "count": 150, "max_id":max_id}
		if(params.max_id==-1){
			delete params.max_id
		}
		console.log(params)

		api_get = client.get('statuses/user_timeline', params)
			.then(function(data){
				//console.log(data.data[0])
				console.log(data.data.errors)
				if(data.data.errors != undefined && data.data.errors[0].code == 88){
					//rate limit exceeded
					console.log("exceeded rate limit!");
					return Knex.raw("UPDATE User SET start_id=(SELECT MAX(ID) FROM Tweet WHERE screen_name = '"+screen_name+"') WHERE screen_name = '" + screen_name+"';")
						.then(function(data){
							console.log("updated start_id!");
							console.log(data)
						})
				}
				else if(data.data.errors != undefined && data.data.errors[0].code == 34){
					//rate limit exceeded
					console.log("page not found!");
					return data.data.errors
				}
				else if(data.data.errors != undefined){
					//rate limit exceeded
					console.log("error!");
					console.log(data.data.errors)
					return data.data.errors
				}
				if (data.data.length == 0) {
					console.log("returning due to empty data")
					return "success"
				}
				var i;

				rows = []
				for(i = 0; i < data.data.length; i++){
					if(max_id!=-1 &&i==0)continue;
					var is_url = false;
					if (data.data[i]["entities"]["urls"].length != 0){
						is_url = true;
					}/*
					console.log("id: "+data.data[i].id);
					console.log("screen_name: "+data.data[i].user.screen_name);
					console.log("time_created: "+data.data[i].created_at);
					console.log("source: "+data.data[i].source);
					console.log("text: "+data.data[i].text);
					console.log("is_url: "+is_url);
					console.log("\n\n");*/

					rows.push({
						"id":data.data[i].id,
						"screen_name":data.data[i].user.screen_name.toLowerCase(),
						"time_created":data.data[i].created_at,
						"source":data.data[i].source,
						"text":data.data[i].text,
						"is_url":is_url
					});
				}
				//console.log(rows)

				if (rows.length==0){
					console.log(data.data);
					console.log("rows was [], returning")
					return "not sure what happened"
				}

				inserts = Knex.batchInsert('Tweet', rows).then(function(){
					console.log("inserted all rows!")
				}).catch(function(error){
					console.log("error!")
					console.log(error)
					return new Error(error)
				})
				
				return inserts
				.then(get_tweets_and_insert(screen_name))


			}).catch(function(error){
				console.log("returning with error")
				console.log(error)
				return new Error(error)
			});

		console.log("returning from tweet get function")



		return api_get
	})

}


module.exports={

	add_user: function(screen_name){


		console.log("adding " + screen_name)

		Knex.select('id').from('User').where('screen_name','=', screen_name).then(function(data){
			/*if (data != []){
				return "the twitter handle already exists in the db"
			}*/

	/*
				api_get = client.get('statuses/user_timeline', {"screen_name": screen_name, "count": 2, "max_id": max_ids[screen_name]})
				.then(function(data){
					console.log(JSON.stringify(data))
				}).catch(function(error){
					console.log(error)
				});*/

			params = {"screen_name": screen_name}
			get_user = client.get('users/show', params)
			.then(function(data){
				console.log("inserting user")
				return Knex.insert({
					"id":data.data.id,
					"screen_name":data.data.screen_name.toLowerCase(),
					"followers_count":data.data.followers_count,
					"friends_count":data.data.friends_count
				}).into('User')
			}).catch(function(error){
				return error
			});
			return get_user.then(function(data){
				console.log("data from user insert: " + data)
				console.log("")
				return get_tweets_and_insert(screen_name)
			})

			
		})

	}
}