
var express = require('express');
var router = express.Router();
var Twitter = require('twitter');


/* GET home page.  API call with no  */
router.get('/', function(req, res, next) {
	
	res.send('twitter');
});
router.get('/connect', function(req, res, next) {
	
	res.send('twitter');
});

router.get('/time_most_active', function(req, res, next){
	var client = new Twitter({
		//this would be obfuscated in an encrypted file if I had more time
		consumer_key: 'Mp9SqyDViTRezM0C4lz6EWXuo', 
		consumer_secret: 'DDZTiKKakRNFAACXKEJPEygHZTSOgvaJh4ZZzkWnYuIoCqQbkf',
		access_token_key: '4100378968-ofeWCenRlX46fte4teRkDsYOgMYWWj6S75P4qG9',
		access_token_secret: 'BXwI1S8z0MdN4TbwOIiP1kdfLXRovRzJKkjAdjiiOZW5t'
	});


	params = {"screen_name": "@LilTunechi"}

	client.get('statuses/user_timeline', params, function(error, tweets, response){
		if(error) throw new Error(JSON.stringify(error));
		//console.log(tweets);  // The favorites. 

		time_created = []


		for (var i = 0; i < tweets.length; i++){
			console.log(tweets[i])
			console.log(tweets[i]['created_at'])
			time_created.push(tweets[i]['created_at'])
		}
		console.log(time_created)
		//console.log(response);  // Raw response object. 
	});
});

module.exports = router;
