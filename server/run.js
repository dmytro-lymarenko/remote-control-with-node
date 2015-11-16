var server = require('http').createServer();
var io = require('socket.io')(server);
var siofu = require("socketio-file-upload");

var exec = require('child_process').exec;

io.on('connection', function(socket) {
	console.log('connect');

	var uploader = new siofu();
    uploader.dir = "/home/stdn2/.config/node/server/uploads";
    uploader.listen(socket);
	
	socket.on('exec', function(command) {
		try {
			exec(command, function(err, out, code) {
				if(err) {
					socket.emit('successfulError', err);
				}
				if(out) {
					socket.emit('successfulResult', out);
				}
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
