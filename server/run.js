var server = require('http').createServer();
var io = require('socket.io')(server);

io.on('connection', function(socket) {
	console.log('connect');
	
	socket.on('disconnect', function() {
		console.log('disconnect');
	});
});

server.listen(2015);

