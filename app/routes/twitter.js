
var express = require('express');
var router = express.Router();
var Twitter = require('twitter');



function mode(arr){
	var frequency = {}  // array of frequency.
	var max = 0  // holds the max frequency.
	var result   // holds the max frequency element.
	for(var i in arr) {
		frequency[arr[i]]=(frequency[arr[i]] || 0)+1 // increment frequency.
		if(frequency[arr[i]] > max) { // is this frequency > max so far ?
			max = frequency[arr[i]]  // update max.
			result = arr[i]          // update result.
		}
	}
	return result
}

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

function make_client(){
	return new Twitter({
		//this would be obfuscated in an encrypted file if I had more time
		consumer_key: 'Mp9SqyDViTRezM0C4lz6EWXuo', 
		consumer_secret: 'DDZTiKKakRNFAACXKEJPEygHZTSOgvaJh4ZZzkWnYuIoCqQbkf',
		access_token_key: '4100378968-ofeWCenRlX46fte4teRkDsYOgMYWWj6S75P4qG9',
		access_token_secret: 'BXwI1S8z0MdN4TbwOIiP1kdfLXRovRzJKkjAdjiiOZW5t'
	});
}


router.get('/load_user_into_db', function(req, res, next){
	var services = require('../services');



	var screen_name = req.query.screen_name;
	
	if (screen_name == undefined || screen_name == null || screen_name == ""){
		res.send("please type a twitter name to add to the db")
		return
	}
	screen_name = screen_name.toLowerCase()

	result = services.populateDBService.add_user(screen_name);

	result.then(function(data){
		res.send(data)
	}).catch(function(error){
		res.send(error)
	})

});



router.get('/time_most_active', function(req, res, next){
	var Knex = require('../../config/db').Knex;



	var screen_name = req.query.screen_name;

	if (screen_name == undefined || screen_name == null || screen_name == ""){
		screen_name = "LilTunechi";
	}

	screen_name = screen_name.toLowerCase()

	//default values


	Knex.select('time_created').from("Tweet").where('screen_name','=', screen_name)
	.then(function(data){

		if (data.length==0){
			res.send("couldn't find user " + screen_name)
			return
		}

		times_created = []

		//match just the time value in the string.  I don't care about dates
		time_regex = /([0-9]{2}:){2}[0-9]{2}/

		for (var i = 0; i < data.length; i++){

			match = time_regex.exec(data[i].time_created)
			//if the match is found, it will be in the first location of the returned array
			if(match!=null){
				times_created.push(parseInt(match[0].substring(0,2)))
			}
		}


		res.send(get_most_active_time(times_created))
	});
});


router.get('/app_used', function(req, res, next){
	var Knex = require('../../config/db').Knex;


	//default values
	var screen_name = "LilTunechi";

	if(!isNaN(req.query.screen_name)){
		screen_name = req.query.screen_name;
	}
	screen_name = screen_name.toLowerCase()

	Knex.select('source').from("Tweet").where('screen_name','=', screen_name)
	.then(function(data){
		//console.log(data)

		sources = []
		source_regex = />[a-zA-Z ]+</


		for (var i = 0; i < data.length; i++){
			match = source_regex.exec(data[i].source)
			//if the match is found, it will be in the first location of the returned array
			if(match!=null){
				sources.push(match[0].substring(1, match[0].length -1))
			}
		}
		//console.log(sources)
		console.log(mode(sources))
		res.send(mode(sources))

	});



});


router.get('/num_followers', function(req, res, next){
	var Knex = require('../../config/db').Knex;


	//default values
	var screen_name = "LilTunechi";

	if(!isNaN(req.query.screen_name)){
		screen_name = req.query.screen_name;
	}
	screen_name = screen_name.toLowerCase()

	Knex.select('followers_count').from("User").where('screen_name','=', screen_name)
	.then(function(data){
		console.log(data)
		
		res.send(String(data[0].followers_count))

	});

});

router.get('/num_friends', function(req, res, next){
	var Knex = require('../../config/db').Knex;


	//default values
	var screen_name = "LilTunechi";

	if(!isNaN(req.query.screen_name)){
		screen_name = req.query.screen_name;
	}
	screen_name = screen_name.toLowerCase()

	Knex.select('friends_count').from("User").where('screen_name','=', screen_name)
	.then(function(data){
		console.log(data)
		
		res.send(String(data[0].friends_count))

	});


});


router.get('/ratio_of_tweets_with_links', function(req, res, next){
	var Knex = require('../../config/db').Knex;


	//default values
	var screen_name = "@LilTunechi";

	if(!isNaN(req.query.screen_name)){
		screen_name = req.query.screen_name;
	}
	screen_name = screen_name.toLowerCase()


	Knex.raw('SELECT (SELECT COUNT(*) FROM Tweet WHERE is_url = 1) AS has_url, count(*) as total FROM Tweet;')// WHERE screen_name=\'' + screen_name + '\';')
	.then(function(data){
		console.log(data);
		res.send(data[0].has_url + '/' + data[0].total)

	});


});


router.get('/top_ten_words', function(req, res, next){
	var Knex = require('../../config/db').Knex;


	//default values
	var screen_name = "LilTunechi";

	if(!isNaN(req.query.screen_name)){
		screen_name = req.query.screen_name;
	}
	word_count = {}


	screen_name = screen_name.toLowerCase()


	Knex.select('text').from("Tweet").where('screen_name','=', screen_name)
	.then(function(data){

		words = []

		word_regex = /[\w']+/g;
		//this is a bad regex with some false positives, but its way faster than the full URL regex
		url_regex = /(https?:\/\/[^\s]+)/g


		for (var i = 0; i < data.length; i++){
			lowercase_text = data[i].text.toLowerCase()
			lowercase_text = lowercase_text.replace(url_regex, "")
			new_words = lowercase_text.match(word_regex)
			if (new_words != null){
				words = words.concat(new_words)
			}
		}


		for(var i = 0; i < words.length; i++){
			word_count[words[i]] = word_count[words[i]] == undefined? 1: word_count[words[i]]+1;
		}

		max_list = {'':-Infinity, ',':-Infinity, '.':-Infinity, '/':-Infinity, ';':-Infinity, 
					'$':-Infinity, '=':-Infinity, '-':-Infinity, '[':-Infinity, ']':-Infinity}

		for( var word in word_count) {

			//check the word's count against the array's minimum.
			//this could be faster if I built a datastructure to remember the min value
			temp_min = -1
			temp_min_value = Infinity
			for(var i in max_list){
				if(max_list[i] <= temp_min_value){
					temp_min = i
					temp_min_value = max_list[i]
				}
			}

			//if the min is less than the word_count, replace it
			if(word_count[word] > temp_min_value){
				delete max_list[temp_min]
				max_list[word] = word_count[word]
			}
		}


		res.send(max_list)

	});


});








router.get('/direct_time_most_active', function(req, res, next){
	var client = make_client();


	//default values
	var screen_name = "@LilTunechi";

	if(!isNaN(req.query.screen_name)){
		screen_name = req.query.screen_name;
	}
	params = {"screen_name": screen_name, "count": 150}

	client.get('statuses/user_timeline', params, function(error, tweets, response){
		if(error) {
			res.send(JSON.stringify(error))
			return
		}

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

		res.send(get_most_active_time(times_created))
	});
});


router.get('/direct_app_used', function(req, res, next){
	var client = make_client();


	//default values
	var screen_name = "@LilTunechi";

	if(!isNaN(req.query.screen_name)){
		screen_name = req.query.screen_name;
	}
	params = {"screen_name": screen_name}


	client.get('statuses/user_timeline', params, function(error, tweets, response){
		if(error) {
			res.send(JSON.stringify(error))
			return
		}

		sources = []
		source_regex = />[a-zA-Z ]+</


		for (var i = 0; i < tweets.length; i++){
			match = source_regex.exec(tweets[i]['source'])
			//if the match is found, it will be in the first location of the returned array
			if(match!=null){
				sources.push(match[0].substring(1, match[0].length -1))
			}
		}
		console.log(sources)
		console.log(mode(sources))
		res.send(mode(sources))
	});
});

router.get('/direct_num_followers', function(req, res, next){
	var client = make_client();


	//default values
	var screen_name = "@LilTunechi";

	if(!isNaN(req.query.screen_name)){
		screen_name = req.query.screen_name;
	}
	params = {"screen_name": screen_name }

	client.get('users/show', params, function getData(error, data, response){
		if(error) {
			res.send(JSON.stringify(error))
			return
		}

		res.send(data["followers_count"] + ' friends')
	});
});

router.get('/direct_num_friends', function(req, res, next){
	var client = make_client();


	//default values
	var screen_name = "@LilTunechi";

	if(!isNaN(req.query.screen_name)){
		screen_name = req.query.screen_name;
	}
	params = {"screen_name": screen_name}

	client.get('users/show', params, function getData(error, data, response){
		if(error) {
			res.send(JSON.stringify(error))
			return
		}


		res.send(data["friends_count"] + ' friends')
	});


});
module.exports = router;

router.get('/direct_ratio_of_tweets_with_links', function(req, res, next){
	var client = make_client();


	//default values
	var screen_name = "@LilTunechi";

	if(!isNaN(req.query.screen_name)){
		screen_name = req.query.screen_name;
	}
	params = {"screen_name": screen_name, "count": 150}

	client.get('statuses/user_timeline', params, function getData(error, tweets, response){
		if(error) {
			res.send(JSON.stringify(error))
			return
		}


		num_links = 0

		for (var i = 0; i < tweets.length; i++){
			if (tweets[i]["entities"]["urls"].length != 0){
				num_links ++
			}
		}


		res.send(num_links + "/" + tweets.length)
	});


});


router.get('/direct_top_ten_words', function(req, res, next){
	var client = make_client();


	//default values
	var screen_name = "@LilTunechi";

	if(!isNaN(req.query.screen_name)){
		screen_name = req.query.screen_name;
	}
	params = {"screen_name": screen_name, "count": 150}

	word_count = {}

	client.get('statuses/user_timeline', params, function getData(error, tweets, response){
		if(error) {
			res.send(JSON.stringify(error))
			return
		}

		words = []

		word_regex = /[\w']+/g;
		//this is a bad regex with some false positives, but its way faster than the full URL regex
		url_regex = /(https?:\/\/[^\s]+)/g

		for (var i = 0; i < tweets.length; i++){
			lowercase_text = tweets[i]["text"].toLowerCase()
			lowercase_text = lowercase_text.replace(url_regex, "")
			new_words = lowercase_text.match(word_regex)
			if (new_words != null){
				words = words.concat(new_words)
			}
		}


		for(var i = 0; i < words.length; i++){
			word_count[words[i]] = word_count[words[i]] == undefined? 1: word_count[words[i]]+1;
		}

		max_list = {'':-Infinity, ',':-Infinity, '.':-Infinity, '/':-Infinity, ';':-Infinity, 
					'$':-Infinity, '=':-Infinity, '-':-Infinity, '[':-Infinity, ']':-Infinity}

		for( var word in word_count) {

			//check the word's count against the array's minimum.
			//this could be faster if I built a datastructure to remember the min value
			temp_min = -1
			temp_min_value = Infinity
			for(var i in max_list){
				if(max_list[i] <= temp_min_value){
					temp_min = i
					temp_min_value = max_list[i]
				}
			}
			//console.log(temp_min + ": " + temp_min_value)
			//if the min is less than the word_count, replace it
			if(word_count[word] > temp_min_value){
				delete max_list[temp_min]
				max_list[word] = word_count[word]
			}
		}


		res.send(max_list)
	});


});

module.exports = router;
