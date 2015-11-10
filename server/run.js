var server = require('http').createServer();
var io = require('socket.io')(server);

var exec = require('exec');

io.on('connection', function(socket) {
	console.log('connect');
	
	socket.on('exec', function(command) {
		exec(command, function(err, out, code) {
			socket.emit('error', err);
			socket.emit('result', out);
		});
	});
	
	socket.on('disconnect', function() {
		console.log('disconnect');
	});
});

server.listen(2015);

