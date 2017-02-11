var request = require('request');

habit =  {
  "id": 4711,
  "text":"Completed a pom :tomato:",
  "type":"habit",
  "alias":"pom",
  "notes":"Created by Habit Pom",
  "tags":[""],
  "priority":2
}

function update_habitica(){
  var options = {
    url: "https://habitica.com/api/v3/tasks/:4711",
    headers: {
      "x-api-user": 'b16e0c46-c20b-4aea-9f1f-6e9dd80ad61b',
      "x-api-key": '3f1607f9-4c83-44d9-9971-1ffb0929957c'
    }
  };

  function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
      var info = JSON.parse(body);
      console.log(info);
    } else {
			var json = JSON.parse(body);
		 if	(json["error"] == "NotFound") {
				console.log("go to work");
			}
		} }
  request(options, callback);
}
var time = document.getElementById("time");
var start_pom = document.getElementById("pom");

start_pom.addEventListener("click", function() { 
 display_time(1500); 
}, false);

var start_time = new Date().getTime() / 1000;

console.log(Date.now());
function display_time(countdown) {
  setTimeout(function() {
    set_time(countdown);  
  }, 1000);
}

//time in seconds of pom
function set_time(countdown) {
  console.log("hello");
  var elapsed_seconds = new Date().getTime() / 1000;
  elapsed_seconds = (start_time + countdown) - elapsed_seconds;
  var minutes = elapsed_seconds / 60;
  if (countdown - minutes < 25) {
    var new_start_time = new Date().getTime() / 1000;
    start_time = new_start_time;
    update_habitica()
  } else {
    var string = (minutes.toFixed(0)-1) + ":" + elapsed_seconds.toFixed(0) % 60;
    console.log(time.innerHTML);
    time.innerHTML = string; 
    display_time(countdown);
  }
}
update_habitica();
