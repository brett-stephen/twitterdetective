class timePeriod {
  constructor(start, end) {
    this.start = start;
    this.end = end;
  }
}

const dawn = new timePeriod(0,5);
const morning = new timePeriod(6,10);
const noon = new timePeriod(11,13);
const afternoon = new timePeriod(14,17);
const evening = new timePeriod(18,21);
const night = new timePeriod(22,24);

window.onload = init;

function init() {


    
    
    
	document.addEventListener("submit", SubmitForm);
	//document.getElementById("b2").addEventListener("click",check);
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
        
        var results = document.getElementById("results");
				
		   		 	if(xhr.status == 200)
					{
							if(JSON.parse(xhr.responseText).error =="Not authorized."){
									console.log("can't access");
                                    alert("Cannot access profile. Private profiles cannot be used.")
                                    results.style.visibility = 'hidden';
							}
							else{
                                        results.style.visibility = 'visible';
                                
							            var tweets = JSON.parse(xhr.responseText);
										console.log(JSON.parse(xhr.responseText));    
									   
                                        var user = tweets[0].user;
                                        var location = user.location;
										var name = user.name;
									       
                                        /*
										var para = document.createElement("p");
										var node = document.createTextNode("we have found " + name + ". their most recent tweet is...  " + JSONdata[0].text);
										para.appendChild(node);

										var element = document.getElementById("div1");
										element.appendChild(para);
                                        */
                                        document.getElementById("_location").innerHTML = location;
									
										document.getElementById("_name").innerHTML = name;
                                        
                                        var deviceOfChoice = arrayMax(getSourceCount(tweets));
                                
                                        if(deviceOfChoice==0){ deviceOfChoice="Iphone";}
                                        else if(deviceOfChoice==1){ deviceOfChoice="Android Phone";}
                                        else if(deviceOfChoice==2){ deviceOfChoice="Web Client";}
                                        else{ deviceOfChoice="Other";}
                                        document.getElementById("_device").innerHTML = deviceOfChoice;
                                
                                        console.log("time count: ",getTweetTimes(tweets));
                                
                                        var tTimes = getTweetTimes(tweets);
                                        var groupedTime = groupTweetsByTime(tTimes);
                                        console.log("time grouped: ",groupedTime);
                                        //getTime(time);
                                
                                        var popularTime = 0;
                                        popularTime = arrayMax(groupedTime);
                                        console.log("your most popular time to tweet is", popularTime);
                                        
                                        if(popularTime==0){ popularTime="Dawn";}
                                        else if(popularTime==1){ popularTime="Morning";}
                                        else if(popularTime==2){ popularTime="Noon";}
                                        else if(popularTime==3){ popularTime="Afternoon";}
                                        else if(popularTime==4){ popularTime="Evening";}
                                        else if(popularTime==5){ popularTime="Night";}
                                
    
                                        document.getElementById("_geoEnabled").innerHTML = user.geo_enabled;
                                            
                                        document.getElementById("_mostActive").innerHTML = popularTime;
                                
                                        var chart = new CanvasJS.Chart("chartContainer", {
                                        animationEnabled: true,
                                        backgroundColor: null,
                                        title: {
                                            text: "twitter activity",
                                            fontFamily: "Playfair Display",
                                        },
                                        data: [{
                                            type: "doughnut",
                                            startAngle: 240,
                                            indexLabelFontFamily: "Poppins",
                                            //yValueFormatString: "##0.00\"%\"",
                                            indexLabel: "{label} {y}",
                                            dataPoints: [
                                                {y: groupedTime[0], label: "Dawn"},
                                                {y: groupedTime[1], label: "Morning"},
                                                {y: groupedTime[2], label: "Noon"},
                                                {y: groupedTime[3], label: "Afternoon"},
                                                {y: groupedTime[4], label: "Evening"},
                                                {y: groupedTime[5], label: "Night"}
                                            ]
                                        }]
                                    });
                                    chart.render();
                                
                                    var avgLocation = document.getElementById("avgLocation");
                                
                                    if(getLocation(tweets) != null){
                                        avgLocation.style.visibility = 'visible';
                                        initMap(tweets);
                                    }
                                    else
                                    {
                                        avgLocation.style.visibility = 'hidden';
                                    }
								
							   	 }
					}
					else {
						console.log("REQUEST FAILED :(");
					    console.log(xhr);
					   }
					console.log("FUNCTION END.");
					}

	return false;
}


function getSourceCount(tweets){
    
    var iphoneCount=0;
    var androidCount=0;
    var webCount=0;
    var other=0;
     
	for(var i =0; i < tweets.length; i++)
	{
        var recentSource = tweets[i].source;
        //Use regular expressions to parse source data to look for certain identifiers.
		if(recentSource.search(/iphone/i) != -1 ){
            //document.getElementById("Tlocation").innerHTML = "on the iphone";
            iphoneCount++;
		}
		else if(recentSource.search(/android/i) != -1 ){
            //document.getElementById("Tlocation").innerHTML = "on the android";
            androidCount++;
		}	
		else if(recentSource.search(/web/i) != -1 ){
            //document.getElementById("Tlocation").innerHTML = "on the web";
            webCount++;
		}
        else
        {
            other++;
        }
	}    
    
    //console.log("heres all the tweets we got "+tweetTime);
    var arr = [iphoneCount,androidCount,webCount,other];
    
    return arr;
}

/*
// gets tweet times and stores them in an array
*/
function getTweetTimes(tweets){

    var tweetTime=[];
     
	for(var i =0; i < tweets.length; i++)
	{     
        var time = getTime(tweets[i].created_at);
        
        tweetTime.push(time);
	}    
    
    return tweetTime;
}

/*
// Extracts time from twitter's "created_at" format
*/
function getTime(dateTime){
                                
    //use regex to extract the time at which tweet occured.
    var match = /\d\d:\d\d:\d\d/.exec(dateTime);
    
    var tweetHour = dateTime.substring(match.index, match.index+2);
    var tweetMinute = dateTime.substring(match.index+3, match.index+5); //hard coded indexes cuz im lazy
    
    var time = {hour: tweetHour, minute: tweetMinute};
    
    return time;
}


/*
// Catagorizes time into active Hours
*/
function groupTweetsByTime(time){
    
    var timeCount=[0,0,0,0,0,0];
    
    for(var i =0; i < time.length; i++)
	{
        if(dawn.start <= time[i].hour && time[i].hour <= dawn.end)
        {
            timeCount[0]++;
        }
        else if(morning.start <= time[i].hour && time[i].hour <= morning.end)
        {
            timeCount[1]++;
        }
        else if(noon.start <= time[i].hour && time[i].hour <= noon.end)
        {
            timeCount[2]++;
        }
        else if(afternoon.start <= time[i].hour && time[i].hour <= afternoon.end)
        {
            timeCount[3]++;
        }
        else if(evening.start <= time[i].hour && time[i].hour <= evening.end)
        {
            timeCount[4]++;
        }
        else if(night.start <= time[i].hour && time[i].hour <= night.end)
        {
            timeCount[5]++;
        }
    }
    
    //var activty = {dawn: timeCount[0], morning: timeCount[1], noon: timeCount[2], afternoon: timeCount[3], evening: timeCount[4], night: timeCount[5]};
    //return activty;
    
    return timeCount;
}

/*
// Finds biggest integer in an array
*/
function arrayMax(arr){
    if (arr.length === 0) {
        return -1;
    }

    var max = arr[0];
    var maxIndex = 0;

    for (var i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            maxIndex = i;
            max = arr[i];
        }
    }

    return maxIndex;
}


/*
// gets avg location
*/
function getLocation(tweets){
    
    var arrX=[];
    var arrY=[];
    
    var len = tweets.length;

    for(var i =0; i < len; i++)
	{     
        if(tweets[i].geo != null){
            var coor = tweets[i].geo.coordinates;
            arrX.push(coor[0]);
            arrY.push(coor[1]);
        }
        else{
        console.log("no coordinates for ",i);
            return null;
        }
	}    
    
    var sumX = 0.000;
    var sumY = 0.000;
    for( var i = 0; i < arrX.length; i++ ){
        //sumX += parseInt( arrX[i], 10 );
        //sumY += parseInt( arrY[i], 10 );
        sumX += arrX[i];
        sumY += arrY[i];
    }
    
    var avgX = 0.00;   
    var avgY = 0.00; 
    avgX = sumX/arrX.length;   
    avgY = sumY/arrY.length; 
    
    Math.round(avgX * 1000)/1000;
    Math.round(avgY * 1000)/1000;

    return [avgX,avgY];
}


function initMap(tweets) {

    var coor = getLocation(tweets);
                                
    var avgLocation = {lat: coor[0], lng: coor[1]};
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: new google.maps.LatLng(coor[0], coor[1]),
    });
    var marker = new google.maps.Marker({
        position: avgLocation,
        map: map
    });                                 
}



