function update_habitica(){
  var options = {
    url: "https://habitica.com/api/v3/user",
    headers: {
      "x-api-user": 'b16e0c46-c20b-4aea-9f1f-6e9dd80ad61b',
      "x-api-key": '3f1607f9-4c83-44d9-9971-1ffb0929957c'
    }
  };

  function callback(error, response, body) {
    console.log(body);
    if (!error && response.statusCode == 200) {
      var info = JSON.parse(body);
      console.log(info);
    }
  }
  request(options, callback);
}
var time = document.getElementById("time");
var start_time = new Date().getTime() / 1000;

console.log(Date.now());
function display_time() {
  setTimeout('set_time()', 1000);
}

function set_time() {

  var elapsed_seconds = new Date().getTime() / 1000;
  elapsed_seconds = elapsed_seconds - start_time;
  var minutes = elapsed_seconds / 60;
  if (minutes > 25) {
    var new_start_time = new Date().getTime() / 1000;
    start_time = new_start_time;
    update_habitica()
  }
  time.innerHTML = minutes.toFixed(0) + ":" + elapsed_seconds.toFixed(0); 
  display_time();
}
display_time();
