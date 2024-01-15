const express = require ('express');
const socketio = require('socket.io');

//SETUP++++++
var app = express();
var server = require('http').Server(app);

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html')
} );

app.use('/login.css', express.static(__dirname + '/login.css'));
app.use('/assets', express.static(__dirname + '/assets'));

var port = process.env.PORT || 5000;

server.listen(port);
console.log("Server Running!");
var io = require('socket.io') (server, {});

var SOCKET_LIST = {};


io.sockets.on('connection', function(socket){//SOCKETS++++++
	SOCKET_LIST[socket.id] = socket;
});