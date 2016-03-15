//temporary until I abstract these away.  I will be changing the values as soon as the project is over
CONSUMER_KEY = 'Mp9SqyDViTRezM0C4lz6EWXuo'
CONSUMER_SECRET = 'DDZTiKKakRNFAACXKEJPEygHZTSOgvaJh4ZZzkWnYuIoCqQbkf'
access_token_key = '4100378968-ofeWCenRlX46fte4teRkDsYOgMYWWj6S75P4qG9'
access_token_secret = 'BXwI1S8z0MdN4TbwOIiP1kdfLXRovRzJKkjAdjiiOZW5t'

var bluebird = require('bluebird')
//different twitter library because I need promise support
var twitter = require('twit')
var Knex = require('../../config/db').Knex;

function make_client(){
	return new twitter({
		//this would be obfuscated in an encrypted file if I had more time
		consumer_key: CONSUMER_KEY, 
		consumer_secret: CONSUMER_SECRET,
		access_token: access_token_key,
		access_token_secret: access_token_secret,
		timeout_ms: 60*1000
	});
}



module.exports={

	add_user: function(screen_name){

		var client = make_client();

		params = {"screen_name": screen_name}

		return client.get('users/show', params)
		.then(function(data){

			return Knex.insert({
				"id":data.data.id,
				"screen_name":data.data.screen_name,
				"followers_count":data.data.followers_count,
				"friends_count":data.data.friends_count
			}).into('User')
		}).catch(function(error){
			return error
		});


	},

	populate_user: function(screen_name){


		var client = make_client();

		params = {"screen_name": screen_name, "count": 150}

		client.get('statuses/user_timeline', params)
		.then(function(data){
			console.log(data)

		}).catch(function(error){
			console.log(error)
		});

	}
}