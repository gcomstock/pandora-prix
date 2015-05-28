
var TYPE_INFO = 5;
var TYPE_NODE_LAP = 37;

var websocketInterval = null;
var gaugeInterval = null;
var outsimInterval = null;

var plidMap = {};	// maps plid to id (1-2)

var gRaceLaps = 0;

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

	websocketInterval = setInterval(function() {
		if (socket.readyState == 1) {
			socket.send("MORE");
		} else if (socket.readyState > 1) {
			// web socket closed, server restarting?  attempt to re-connect
			clearInterval(websocketInterval);
			startWebSocket();
		}
	}, 100);

}

function update(data) {
	//console.log("update: ", data);
	var type = data['Type'];
	if (type) {
		// insim packet
		console.log("INSIM:", data)
		if (type == TYPE_INFO) {
			gRaceLaps = data.RaceLaps;
		}
		if (type == TYPE_NODE_LAP) {
			for (var i=0; i < data.Info.length; i++) {
				var lap = data.Info[i].Lap;
				var pos = data.Info[i].Position;
				var plid = data.Info[i].PLID;
				if (plidMap[plid] != null) {
					console.log("id:", plidMap[plid], ", lap:", (lap + "/" + gRaceLaps), ", pos:", pos);
					updatePosition(plidMap[plid]-1, pos);
				}
			}
		}
	}
	if (data['RPM']) {
		// gauge packet
		var id = data['ID'][0];
		var plid = data['PLID'];
		if (plidMap[plid] == null) {
			console.log("Mapping plid " + plid + " to id " + id);
		}
		plidMap[plid] = id;
		var rpm = Math.floor(data.RPM / 100) / 10;
		if (rpm == Math.floor(rpm)) {
			rpm = String(rpm) + ".0";
		}
		
		$(".timer").text(convertTime(data.Time));	// updateTimer?
		updateRpm(id-1, rpm);
		updateSpeed(id-1, Math.floor(data.Speed * 2.2));
		// data.Gear: 0 = R, 1 = N, 2 = 1st gear, 3 = 2nd gear, etc.
		console.log(id, data.Gear);
		updateGear(id-1, data.Gear-1);
		updateThrust(id-1, Math.floor(data.Throttle * 100));

		//updateTurbo(id-1, ??);	// data.Turbo seems to go from -1.0 to +1.75
		//updateFuel(id-1, ??);		// data.Fuel is from 0.0 - 1.0, usually starts at 0.5

	}
}

function convertTime(time) {
	var min = Math.floor(time / 1000 / 60);
	time -= (min * 1000 * 60);
	var sec = time / 1000;

	min = ("00" + min).substr(-2);
	if (sec < 10) {
		sec = "0" + sec;
	}
	sec = String(sec)
	if (sec.indexOf('.') == -1) {
		sec += ".";
	}
	sec = sec + "00";
	sec = sec.substring(0,5);
	return min + ":" + sec;	
}

$(function() {
	// startup code here
	startWebSocket();
});
