
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
		consumer_key: 'CxOdceff14ViJbttAoXOMCMnF', 
		consumer_secret: '	otX6tST4w132KaMRVz8yZTMpB6Ni75jhU1izFFNIwF8EsHqsUH',
		access_token_key: '4100378968-ohyvNyy2527Udcw4zrdOjBOqB2Dt6ZAOCnMejvC',
		access_token_secret: '5XrudxawWxi8Vcs1bp8iD6FXyW7pl2HTXD6CL7PK9fzb0'
	});

	params = {"screen_name": "@LilTunechi"}

	client.get('statuses/user_timeline', params, function(error, tweets, response){
		if(error) throw error;
		console.log(tweets);  // The favorites. 
		console.log(response);  // Raw response object. 
	});
});

module.exports = router;
