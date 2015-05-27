
var TYPE_NEW_CONNECTION = 18;
var TYPE_NEW_PLAYER = 21;

var gaugeInterval = null;
var outsimInterval = null;
var gear = 1;

function startWebSocket() {
	var socket = new WebSocket("ws://localhost:8080/racing");
	
	socket.onopen = function(event) {
		socket.send("START");
	}
	
	socket.onmessage = function(event) {
		if (event.data) {
			update(JSON.parse(event.data));
		}
	}

	setInterval(function() {
		socket.send("MORE");
	}, 100);

}

function update(data) {
	//console.log("update: ", data);
	var type = data['Type'];
	if (type) {
		// insim packet
		if (type == TYPE_NEW_PLAYER) {
			// Map username to player id
			var PName = data['PName'];
			var PLID = data['PLID'];

		}
	}
	if (data['RPM']) {
		// gauge packet
		console.log(data);
		var id = data['ID'][0];
		var plid = data['PLID'];
		var rpm = Math.floor(data.RPM / 100) / 10;
		if (rpm == Math.floor(rpm)) {
			rpm = String(rpm) + ".0";
		}
		//console.log(id, data.Speed);
		//console.log(data.Time);
		updateRpm(id-1, rpm);
		updateSpeed(id-1, Math.floor(data.Speed));
		updateGear(id-1, data.Gear);


		//console.log("plid: ", data.PLID, " rpm: ", data.RPM, " gear: ", data.Gear);
	}
}

$(function() {
	// startup code here
	startWebSocket();
});
