<?php

	require_once('TwitterAPIExchange.php');
	 
	// Set access tokens: https://dev.twitter.com/apps/
	$settings = array(
	    'oauth_access_token' => "975794383898296320-8wWoNtKdW8qmlUm5ujDKtSlvDWesXvh",
	    'oauth_access_token_secret' => "woUSGT9jRUUtY5uVf7WfTpovOapiOh5d9WCa1TsqxxhAT",
	    'consumer_key' => "PjLn4nIuwwdQhiv9tQj9YUdIW",
	    'consumer_secret' => "D8j9CobSmSUE0WgA1uWg6BJVlW4mnari7ajQVudI0qVC9QgMd4"
	);
	
	$q = $_REQUEST["q"];

	// Choose URL and Request Method
	$url = 'https://api.twitter.com/1.1/statuses/user_timeline.json';
	$getfield = '?screen_name='.$q.'&count=30'; // queries start with ? and are strung together with, placing the name as a variable, and requesting the last 50 tweets to be pulled
	//$getfield = '?screen_name=barackobama'; // queries start with ? and are strung together with &
	$requestMethod ='GET';
	
	//Perform the request!
	$twitter = new TwitterAPIExchange($settings);
	echo $twitter->setGetfield($getfield)
	             ->buildOauth($url, $requestMethod)
	             ->performRequest();

?>

