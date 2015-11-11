var removeFromHistory;
var againCommand;

window.addEventListener('load', function() {
	var commandElement = document.getElementById('command');
	var showHistoryElement = document.getElementById('showHistory');
	var historyElement = document.getElementById('history');
	var executeElement = document.getElementById('execute');
	var outputElement = document.getElementById('output');

	// history
	var history = {
		visible: false,
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
					+ '<button onclick="againCommand(' + i + ', \'' + command +'\')">Again</button>'
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
	};

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
	};

	var socket = io('http://localhost:2015');
		
	socket.on('successfulResult', function (data) {
		print('successfulResult:', data);
	});

	socket.on('successfulError', function (data) {
		print('successfulError:', data);
	});

	socket.on('execError', function (data) {
		print('execError:', data);
	});

	var executeCommand = function(command) {
		socket.emit('exec', command);
	};

	againCommand = function(index, command) {
		commandElement.value = command;
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
		var command = commandElement.value;
		executeCommand(command);
		history.add(command);
		commandElement.value = '';
		renderHistory();
	});

	commandElement.addEventListener('keypress', function(event) {
		if(event.keyCode == 13) {
			executeElement.click();
		}
	})
});
