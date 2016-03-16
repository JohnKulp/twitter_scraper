

$("#loadTweets").click(function(){
	$screen_name = $("#screenName").val()
	$.get('/twitter/load_user_into_db?screen_name=' + $screen_name, function(data){
		$("#loadTweetsResp").text(data)
	})
});

$("#mostActive").click(function(){
	$screen_name = $("#screenName").val()
	$.get('/twitter/time_most_active?screen_name=' + $screen_name, function(data){
		$("#mostActiveText").text(data)
	})
});

$("#mostFrequent").click(function(){
	$screen_name = $("#screenName").val()
	$.get('/twitter/app_used?screen_name=' + $screen_name, function(data){
		$("#mostFrequentText").text(data)
	})
});

$("#numFollowers").click(function(){
	$screen_name = $("#screenName").val()
	$.get('/twitter/num_followers?screen_name=' + $screen_name, function(data){
		$("#numFollowersText").text(data)
	})
});

$("#numFriends").click(function(){
	$screen_name = $("#screenName").val()
	$.get('/twitter/num_friends?screen_name=' + $screen_name, function(data){
		$("#numFriendsText").text(data)
	})
});

$("#tweetsWithLinks").click(function(){
	$screen_name = $("#screenName").val()
	$.get('/twitter/ratio_of_tweets_with_links?screen_name=' + $screen_name, function(data){
		$("#tweetsWithLinksText").text(data)
	})
});

$("#topTenWords").click(function(){
	$screen_name = $("#screenName").val()
	$.get('/twitter/top_ten_words?screen_name=' + $screen_name, function(data){
		$("#topTenWordsText").text(JSON.stringify(data))
	})
});
