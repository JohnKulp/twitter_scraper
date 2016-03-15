
var express = require('express');
var router = express.Router();
var Twitter = require('twitter');


router.get('/', function(req, res, next) {
	
	res.send('twitter');
});
router.get('/connect', function(req, res, next) {
	
	res.send('twitter');
});

function get_most_active_time(times){
	morning = 0
	noon = 0
	evening = 0
	night = 0

	//populate bins to represent times
	for (var i = 0; i < times.length; i++){

		if (times[i] > 6 && times[i] <= 10){
			morning ++
		}
		if (times[i] > 10 && times[i] <= 14){
			noon ++
		}
		if (times[i] > 14 && times[i] <= 21){
			evening ++
		}
		else{
			night ++
		}
	}


	//find the max times and return them as an array of strings of the max
	time_list = [morning, noon, evening, night]

	console.log("morning: " + morning + ", noon: " + noon + ", evening: " + evening + ", night: " + night)
	console.log(time_list)

	result = []
	//this allows for a multi-way tie
	if (Math.max.apply(null, time_list) == morning){
		result.push("morning")
	}
	if (Math.max.apply(null, time_list) == noon){
		result.push("noon")
	}
	if (Math.max.apply(null, time_list) == evening){
		result.push("evening")
	}
	if (Math.max.apply(null, time_list) == night){
		result.push("night")
	}

	return result
}

router.get('/time_most_active', function(req, res, next){
	var client = new Twitter({
		//this would be obfuscated in an encrypted file if I had more time
		consumer_key: 'Mp9SqyDViTRezM0C4lz6EWXuo', 
		consumer_secret: 'DDZTiKKakRNFAACXKEJPEygHZTSOgvaJh4ZZzkWnYuIoCqQbkf',
		access_token_key: '4100378968-ofeWCenRlX46fte4teRkDsYOgMYWWj6S75P4qG9',
		access_token_secret: 'BXwI1S8z0MdN4TbwOIiP1kdfLXRovRzJKkjAdjiiOZW5t'
	});


	//default values
	var screen_name = "@LilTunechi";

	if(!isNaN(req.query.screenName)){
		screen_name = req.query.screenName;
	}
	params = {"screen_name": screen_name}

	client.get('statuses/user_timeline', params, function(error, tweets, response){
		if(error) throw new Error(JSON.stringify(error));
		//console.log(tweets);  // The favorites. 

		times_created = []

		//match just the time value in the string.  I don't care about dates
		time_regex = /([0-9]{2}:){2}[0-9]{2}/

		for (var i = 0; i < tweets.length; i++){
			match = time_regex.exec(tweets[i]['created_at'])
			//if the match is found, it will be in the first location of the returned array
			if(match!=null){
				times_created.push(parseInt(match[0].substring(0,2)))
			}
		}
		console.log(times_created)

		res.send(get_most_active_time(times_created))
	});
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

		times_created = []

		//match just the time value in the string.  I don't care about dates
		time_regex = /([0-9]{2}:){2}[0-9]{2}/

		for (var i = 0; i < tweets.length; i++){
			match = time_regex.exec(tweets[i]['created_at'])
			//if the match is found, it will be in the first location of the returned array
			if(match!=null){
				times_created.push(parseInt(match[0].substring(0,2)))
			}
		}
		console.log(times_created)

		res.send(get_most_active_time(times_created))
	});
});

module.exports = router;
