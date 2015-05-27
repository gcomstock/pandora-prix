
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
		update(JSON.parse(event.data));
	}

	setInterval(function() {
		socket.send("MORE");
	}, 100);

}

function startMockData() {
	setTimeout(function() {
		// start of race
		update({'RaceLaps': 18, 'QualMins': 0, 'Finish': 301, 'NumP': 8, 'Split3': 65535, 'NumNodes': 323, 'Track': 'BL1', 'Split1': 86, 'Zero': 0, 'Weather': 0, 'Flags': 227, 'ReqI': 0, 'Timing': 66, 'Split2': 213, 'Type': 17, 'Wind': 0, 'Size': 28});
	}, 5000);

	var gcount = 0;
	gaugeInterval = setInterval(function() {
		var rpm = 1000 + Math.abs(Math.sin(gcount/100) * 4000);
		if (gcount % 100 == 0) {
			gear = Math.floor(Math.random() * 5) + 1;
		}
		gcount++;
		update({
			"Brake": 0.0,
			"Car": "XFG",
			"Clutch": 0.0,
			"DashLights": 870,
			"Display1": "Fuel 49.1%   ",
			"Display2": "Brake Bal Fr 80",
			"EngTemp": 0.0,
			"Flags": 0,
			"Fuel": 0.4910677671432495,
			"Gear": gear,
			"ID": [
				1
			],
			"OilPress": 0.0,
			"OilTemp": 0.0,
			"PLID": 1,
			"RPM": rpm,
			"ShowLights": 0,
			"Speed": 29.84549903869629,
			"Throttle": 1.0,
			"Time": 83050,
			"Turbo": 0.0
		})
	}, 10);

	outsimInterval = setInterval(function() {
		update({
			"Accel": [
				-2.0604679584503174,
				0.3716476559638977,
				-0.4093566834926605
			],
			"AngVel": [
				-0.01265785563737154,
				-0.021960975602269173,
				0.03105371631681919
			],
			"Heading": 1.3083518743515015,
			"ID": [
				1
			],
			"Pitch": -0.0021619272883981466,
			"Pos": [
				18514362,
				-50478592,
				28234
			],
			"Roll": 0.001038084737956524,
			"Time": 387350,
			"Vel": [
				-26.521665573120117,
				7.065586090087891,
				-0.048398956656455994
			]
		});
	}, 10);

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
		var plid = data['PLID'];
		var rpm = Math.floor(data.RPM / 100) / 10;
		if (rpm == Math.floor(rpm)) {
			rpm = rpm + ".0";
		}
		updateRpm(plid == 4 ? 0 : 1, rpm);

		//console.log("plid: ", data.PLID, " rpm: ", data.RPM, " gear: ", data.Gear);
	}
}

$(function() {
	// startup code here
	//startMockData();
	startWebSocket();
});
