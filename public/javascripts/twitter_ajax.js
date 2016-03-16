

$("#mostActive").click(function(){
	$screen_name = $("#screenName").val()
	$.get('/twitter/time_most_active', function(data){
		$("#mostActiveText").text(data)
	})
});

$("#mostFrequent").click(function(){
	$screen_name = $("#screenName").val()
	$.get('/twitter/app_used', function(data){
		$("#mostFrequentText").text(data)
	})
});

$("#numFollowers").click(function(){
	$screen_name = $("#screenName").val()
	$.get('/twitter/num_followers', function(data){
		$("#numFollowersText").text(data)
	})
});

$("#numFriends").click(function(){
	$screen_name = $("#screenName").val()
	$.get('/twitter/num_friends', function(data){
		$("#numFriendsText").text(data)
	})
});

$("#tweetsWithLinks").click(function(){
	$screen_name = $("#screenName").val()
	$.get('/twitter/ratio_of_tweets_with_links', function(data){
		$("#tweetsWithLinksText").text(data)
	})
});

$("#topTenWords").click(function(){
	$screen_name = $("#screenName").val()
	$.get('/twitter/top_ten_words', function(data){
		$("#topTenWordsText").text(JSON.stringify(data))
	})
});
