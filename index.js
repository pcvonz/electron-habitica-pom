const ipc = require('electron').ipcRenderer

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
var start_break = document.getElementById("break");

start_pom.addEventListener("click", function(ev) { 
  start_pom.disabled = true;
  start_break.disabled = false;
  start_time = new Date().getTime() / 1000;
  display_time(ev.target, 1500); 
}, false);

start_break.addEventListener("click", function(ev) {
  start_break.disabled = true;
  start_pom.disabled = false;
  start_time = new Date().getTime() / 1000;
  display_time(ev.target, 300); 
}, false);

var start_time = new Date().getTime() / 1000;

function display_time(ev, countdown) {
  setTimeout(function() {
    set_time(ev, countdown);  
  }, 1000);
}

//time in seconds of pom
function set_time(ev, countdown) {
  var elapsed_seconds = new Date().getTime() / 1000;
  var second_countdown = (start_time + countdown) - elapsed_seconds;
  var minutes_countdown = second_countdown / 60;
  if (ev.disabled == false){
    console.log("guess not");
  } else if ((elapsed_seconds) - (start_time) > countdown) {
    var new_start_time = new Date().getTime() / 1000;
    start_time = new_start_time;
    if(ev.id == "pom") {
      update_habitica();
    }
    start_pom.disabled = false;
  } else {
    var string = (Math.floor(minutes_countdown)) + ":" + second_countdown.toFixed(0) % 60;
    time.innerHTML = string; 
    console.log(second_countdown);
    console.log(time.innerHTML);
    display_time(ev, countdown);
  }
}



//const trayBtn = document.getElementById('put-in-tray')
//let trayOn = false

//trayBtn.addEventListener('click', function (event) {
//  if (trayOn) {
//    trayOn = false
//    ipc.send('remove-tray')
//  } else {
//    trayOn = true
//    const message = 'Click demo again to remove.'
//    ipc.send('put-in-tray')
//  }
//})
//// Tray removed from context menu on icon
//ipc.on('tray-removed', function () {
//  ipc.send('remove-tray')
//  trayOn = false
//})


let trayOn = false

function putInTray() {
  if (trayOn) {
    trayOn = false
    ipc.send('remove-tray')
  } else {
    trayOn = true
    const message = 'Click demo again to remove.'
    ipc.send('put-in-tray')
  }
}
// Tray removed from context menu on icon
ipc.on('tray-removed', function () {
  ipc.send('remove-tray')
  trayOn = false
})

putInTray();
