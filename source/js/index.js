const ipc = require('electron').ipcRenderer
const notifier = require('node-notifier');
var request = require('request');
var habitica = require('habitrpg-api');
var fs = require('fs');

var delta
var exp
var gp
var hp
var mp 
var lvl

var api;

var api_key = document.getElementById("api");
var uid_key = document.getElementById("uid");

var time = document.getElementById("time");
var start_pom = document.getElementById("pom");
var start_break = document.getElementById("break");
var start_long_break = document.getElementById("long");
var stop = document.getElementById("stop");
var controls = document.getElementById("controls");
var user_form = document.getElementById("user_form");
var message = document.getElementById("message");
var log = document.getElementById("log");

fs.readFile("user.config", 'utf8', function (err, data) {
	if (err) {
		return console.log(err);
	} else{
		var arr = JSON.parse(data);
		api = new habitica(arr.uid, arr.api, "https://habitica.com/api/v3");
    init();
	}
});

var task = {
	text: 'Habit Pom Finished',
	type: 'habit',
	alias: 'habit_pom'
}

function init() {
	api.getUser(function(response, error){
    if(error.body.success == true) {
      console.log(error);
      message.innerHTML = "Logged in as " + error.body.data.profile.name;
      stats = error.body.data.stats
      delta = stats.delta;
      exp = stats.exp;
      gp = stats.gp;
      hp = stats.hp;
      mp = stats.mp;
      lvl = stats.lvl;
    } else {
      console.log(error.body.success);
      message.innerHTML = "Login:"
    }
	});

	api.getTask("habit_pom", function(response, error) {
		if(JSON.parse(error.text).success == false) {
			api.createTask(task, function(response, error) {
			});
		}
	});
}

function update_habitica(){
	api.updateTaskScore('habit_pom', true, function(response, error) {
    console.log("helloooo");
		console.log(error.body);
			stats = error.body.data
			var string = 'exp: ' + (stats.exp - exp) + "\n" +
			'gp: +' + (stats.gp - gp) + "\n" + 
			'hp: +' + (stats.hp - hp) + "\n" + 
			'mp: +' + (stats.mp - mp) + "\n"
			notifier.notify(string);
			stats = error.body.data.buffs
			delta = stats.delta;
			exp = stats.exp;
			gp = stats.gp;
			hp = stats.hp;
			mp = stats.mp;
			lvl = stats.lvl;
	});
}

function add_log(start_time, end_time, length) {
  var el =  document.createElement("p");
  el.className = "log-entry";
  el.innerHTML = start_time + " " + end_time + " (" + length +")"
  log.appendChild(el);
}


function update_time(new_time) {
	time.innerHTML = new_time;
	document.title = new_time;
}

start_pom.addEventListener("click", function(ev) { 
  start_pom.disabled = true;
  start_break.disabled = false;
  start_long_break.disabled = false;
  stop.disabled = false;
  start_time = new Date().getTime() / 1000;
  start_time_format = moment();
  display_time(ev.target, 1500); 
}, false);

start_break.addEventListener("click", function(ev) {
	update_time("5:00");
  start_break.disabled = true;
  start_pom.disabled = false;
  start_long_break.disabled = false;
  stop.disabled = false;
  start_time = new Date().getTime() / 1000;
  start_time_format = moment();
  display_time(ev.target, 300); 
}, false);
start_long_break.addEventListener("click", function(ev) {
	update_time("20:00");
  start_break.disabled = false;
  start_pom.disabled = false;
  start_long_break.disabled = true;
  stop.disabled = false;
  start_time = new Date().getTime() / 1000;
  start_time_format = moment();
  display_time(ev.target, 60*20); 
}, false);
stop.addEventListener("click", function(ev) {
  start_break.disabled = false;
  start_pom.disabled = false;
  start_long_break.disabled = false;
  display_time(ev.target, 60*20); 
}, false);

var start_time = new Date().getTime() / 1000;
var start_time_format = moment();

function display_time(ev, countdown) {
  if(ev.disabled == true) {
    setTimeout(function() {
      set_time(ev, countdown);  
    }, 1000);
  }
}

//time in seconds of pom
function set_time(ev, countdown) {
  var elapsed_seconds = new Date().getTime() / 1000;
  var second_countdown = (start_time + countdown) - elapsed_seconds;
  var minutes_countdown = second_countdown / 60;
  if (ev.disabled == false){
		notifier.notify("Timer Stopped!");
    var end_time = moment();
    var total_time_format = "";
    add_log(start_time_format.format('hh:mm'), end_time.format('hh:mm'), total_time_format);
  } else if (second_countdown.toFixed(0) >= 0) {
    var end_time = moment().format('hh:mm');
    var total_time_format = "";
    add_log(start_time_format('hh:mm'), end_time.format('hh:mm'), total_time_format);
    var new_start_time = new Date().getTime() / 1000;
    start_time = new_start_time;
    if(ev.id == "pom") {
      update_habitica();
    } else {
			notifier.notify('Breaks up!');	
		}
    start_pom.disabled = false;
  } else {
    var string = (Math.floor(minutes_countdown)) + ":" + second_countdown.toFixed(0) % 60;
		update_time(string);
		ipc.send('update-tray', string);
    display_time(ev, countdown);
  }
}


const set_password = document.getElementById('set_password')

set_password.addEventListener('click', function (event) {
	var config = '{"api":"'+ api_key.value +'","uid":"'+ uid_key.value +'"}';
	fs.writeFile("user.config", config, 'utf8', function(err) {
		if (err) {
			return console.log(err);
		} else {
			api = new habitica(uid_key.value, api_key.value, "https://habitica.com/api/v3");
      api.getUser(function(response, error){
        if(error.body.success == false) {
          message.innerHTML = "Failed login"; 
        } else {
          message.innerHTML = "Login success!"; 
        }
      })
		}
	});
});


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
