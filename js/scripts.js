var JSONdata;


window.onload = init;

function init() {

	console.log("Start");
    /*
	var xhr = new XMLHttpRequest();
    xhr.open('GET', 'get_tweets.php', true); //this changes the state of xmlhttp
    xhr.send(null);
		    xhr.onload = function() {
		   		 	if(xhr.status == 200){
				            var tweets = JSON.parse(xhr.responseText);
							console.log(JSON.parse(xhr.responseText));
						    console.log(xhr.responseText);
						
				            //  EXAMPLE OUTPUT TO A LIST

						   document.getElementById("results").innerHTML = xhr.responseText;
				            var tweetList = "<ul>";
				            tweets.forEach(function(tweet) {
				                tweetList += "<li>" + tweet.user.name + "</li>";
				            });
				            tweetList += "</ul>"

					    		document.getElementById("results").innerHTML = tweetList;
			
					    		
					   	 	}
							else {
								console.log("REQUEST FAILED :(");
					            console.log(xhr);
					        }
					console.log("FUNCTION END.");
					}
*/

	document.addEventListener("submit", SubmitForm);
	document.getElementById("b2").addEventListener("click",check);
}

function Get(e){
	return document.getElementById(e);
}

function check(){
	console.log(JSONdata);
}

function SubmitForm(){

	var username = Get("user").value;
	console.log("The form was submitted for " + username);
	
	var xhr = new XMLHttpRequest();
    xhr.open('GET', 'get_tweets.php?q='+ username, true); //this changes the state of xmlhttp
    xhr.send(null);
	xhr.onload = function() {
				
		   		 	if(xhr.status == 200){
				            var tweets = JSON.parse(xhr.responseText);
							console.log(JSON.parse(xhr.responseText));    
						    JSONdata = JSON.parse(xhr.responseText);
						
							var name = JSONdata[0].user.name;
						
							var para = document.createElement("p");
							var node = document.createTextNode("we have found " + name + ". their most recent tweet is...  " + JSONdata[0].text);
							para.appendChild(node);

							var element = document.getElementById("div1");
							element.appendChild(para);
							
						
						
					   	 	}
							else {
								console.log("REQUEST FAILED :(");
					            console.log(xhr);
					        }
					console.log("FUNCTION END.");
					}

	return false;
}
