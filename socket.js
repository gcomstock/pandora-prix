
function start() {
	var socket = new WebSocket("ws://localhost:8080/racing");
	
	socket.onopen = function(event) {
		socket.send("HELLO");
	}
	
	socket.onmessage = function(event) {
		console.log(event.data);
	}

}