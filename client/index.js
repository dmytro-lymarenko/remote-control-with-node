var olegUrl = 'http://192.168.99.241:2015';
var socketUrl = 'http://localhost:2015';

socketUrl = olegUrl;

var removeFromHistory;
var againCommand;

window.addEventListener('load', function() {
	var statusElement = document.getElementById('status');
	var commandElement = document.getElementById('command');
	var showHistoryElement = document.getElementById('showHistory');
	var historyElement = document.getElementById('history');
	var executeElement = document.getElementById('execute');
	var outputElement = document.getElementById('output');

	var closeChromeElement = document.getElementById('closeChrome');
	var closeFirefoxElement = document.getElementById('closeFirefox');
	var closeSkypeElement = document.getElementById('closeSkype');
	var closePhpStormAndAndroidStudioElement = document.getElementById('closePhpStormAndAndroidStudio');
	var closeGeditElement = document.getElementById('closeGedit');
	var closeSublimeElement = document.getElementById('closeSublime');

	var openUrlElement = document.getElementById('openUrl');
	var openUrlInChromeElement = document.getElementById('openUrlInChrome');
	var openUrlInFirefoxElement = document.getElementById('openUrlInFirefox');

	var playVkSoundElement = document.getElementById('playVkSound');
	var alertMessageElement = document.getElementById('alertMessage');
	var showAlertElement = document.getElementById('showAlert');

	var uploadFileElement = document.getElementById('uploadFile');
	var progressFileUploadPercentElement = document.getElementById('progressFileUploadPercent');
	var showUploadedFiles = document.getElementById('showUploadedFiles');

	var updateServerScriptElement = document.getElementById('updateServerScript');

	// history
	var history = {
		visible: true,
		items: [],

		add: function(command) {
			this.items.push(command);
		},

		remove: function(index) {
			if(index >= 0 && index < this.items.length) {
				this.items.splice(index, 1);
			}
		},

		render: function() {
			var res = '';
			for (var i = this.items.length - 1; i >= 0; i--) {
				var command = this.items[i];
				res += '<li><span>' + command + '</span>'
					+ '<button onclick="againCommand(' + i + ')">Again</button>'
					+ '<button onclick="removeFromHistory(' + i + ')">Remove</button></li>';
			}
			return res;
		},

		getButtonText: function() {
			if(this.visible) {
				return 'Hide history';
			}
			return 'Show history';
		}
	};

	var renderHistory = function() {
		if(history.visible) {
			historyElement.innerHTML = history.render();
		}
		showHistoryElement.innerHTML = history.getButtonText();
	};
	renderHistory();

	removeFromHistory = function(index) {
		history.remove(index);
		renderHistory();
	};

	var print = function(title, data) {
		var text;
		if(data instanceof Object) {
			text = JSON.stringify(data);
		} else {
			text = data;
		}
		output.value += '********************************\n' + title + '\n' + text + '\n';
		output.scrollTop = output.scrollHeight;
	};

	var socket = io(socketUrl);

	socket.on('connect', function() {
		statusElement.innerHTML = 'Status: online';
		statusElement.style['color'] = 'green';
	});

	socket.on('disconnect', function() {
		statusElement.innerHTML = 'Status: offline';
		statusElement.style['color'] = 'red';
	});
		
	socket.on('successfulResult', function (data) {
		print('successfulResult:', data);
	});

	socket.on('successfulError', function (data) {
		print('successfulError:', data);
	});

	socket.on('execError', function (data) {
		print('execError:', data);
	});

	var uploader = new SocketIOFileUpload(socket);
	uploader.listenOnInput(uploadFileElement);
	
	uploader.addEventListener('start', function(event) {
		progressFileUploadPercent.style['background-color'] = 'yellow';
		progressFileUploadPercent.style['width'] = '0';
	});

	uploader.addEventListener('progress', function(event) {
		progressFileUploadPercent.style['width'] = ((event.bytesLoaded / event.file.size) * 200) + 'px';
	});

	uploader.addEventListener('complete', function(event) {
		progressFileUploadPercent.style['background-color'] = 'green';
	});

	uploader.addEventListener('error', function(event) {
		print('Error upload file:', event.message);
		progressFileUploadPercent.style['background-color'] = 'red';
	});

	showUploadedFiles.addEventListener('click', function() {
		executeCommand('ls -al uploads');
	});

	updateServerScriptElement.addEventListener('click', function() {
		executeCommand('cp uploads/run.js run.js');
		executeCommand('npm install');
	});

	var executeCommand = function(command) {
		socket.emit('exec', command);
		history.add(command);
		renderHistory();
	};

	againCommand = function(index) {
		commandElement.value = history.items[index];
		removeFromHistory(index);
	};

	showHistoryElement.addEventListener('click', function() {
		if(history.visible) {
			history.visible = false;
			historyElement.innerHTML = '';
			showHistoryElement.innerHTML = history.getButtonText();
		} else {
			history.visible = true;
			historyElement.innerHTML = history.render();
			showHistoryElement.innerHTML = history.getButtonText();
		}
	});

	executeElement.addEventListener('click', function() {
		executeCommand(commandElement.value);
		commandElement.value = '';
	});

	commandElement.addEventListener('keypress', function(event) {
		if(event.keyCode == 13) {
			executeElement.click();
		}
	});

	closeChromeElement.addEventListener('click', function() {
		executeCommand('killall chrome');
	});

	closeFirefoxElement.addEventListener('click', function() {
		executeCommand('killall firefox');
	});

	closeSkypeElement.addEventListener('click', function() {
		executeCommand('killall skype');
	});

	closePhpStormAndAndroidStudioElement.addEventListener('click', function() {
		executeCommand('killall java');
	});

	closeGeditElement.addEventListener('click', function() {
		executeCommand('killall gedit');
	});

	closeSublimeElement.addEventListener('click', function() {
		executeCommand('killall sublime_text');
	});

	openUrlInChromeElement.addEventListener('click', function() {
		if(openUrlElement.value.trim()) {
			executeCommand('google-chrome "' + openUrlElement.value + '"');
		} else {
			openUrlElement.value = '';
			openUrlElement.focus();
		}
	});

	openUrlInFirefoxElement.addEventListener('click', function() {
		if(openUrlElement.value.trim()) {
			executeCommand('firefox "' + openUrlElement.value + '"');
		} else {
			openUrlElement.value = '';
			openUrlElement.focus();
		}
	});

	playVkSoundElement.addEventListener('click', function() {
		executeCommand('play uploads/vk.wav');
	});

	showAlertElement.addEventListener('click', function() {
		executeCommand('notify-send "' + alertMessageElement.value + '"');
	});
});
