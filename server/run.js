var server = require('http').createServer();
var io = require('socket.io')(server);

var exec = require('child_process').exec;

io.on('connection', function(socket) {
	console.log('connect');
	
	socket.on('exec', function(command) {
		try {
			exec(command, function(err, out, code) {
				if(err) {
					socket.emit('successfulError', err);
				}
				socket.emit('successfulResult', out);
			});
		} catch(e) {
			socket.emit('execError', e);
		}
	});
	
	socket.on('disconnect', function() {
		console.log('disconnect');
	});
});

console.log('run server');
server.listen(2015);
