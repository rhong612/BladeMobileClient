"use strict";
const socket = io('http://bladegame.hopto.org',{
	reconnection: false,

});
var username = '';


function resetConn() {
	socket.removeAllListeners();
	setupConn();
}

function setupConn() {
	socket.on('display_name', function(name) {
		username = name;
	});
	socket.on('timeout', function() {
		console.log("Connection timed out due to inactivity");
		game.state.start('disconnected');	
	})
	socket.on('error_message', function(error) {
		alert(error);
	})
	socket.on('serious_error_message', function(error) {
		alert(error);
	})
}

setupConn();