"user strict";

class MyServer {
	constructor(url, port) {
		this.player = undefined;
		this.nextPlayer = undefined;
		this.moves = [];
		//defaults
		this.port = port || 8081;
		this.url = url || 'http://localhost:';
		this.url += this.port + "/";
	}

	// start a new game
	init(gameType) {

	}

	// move
	async move(Xfrom, Yfrom, Xto, Yto) {
		return await sendCommand(`action(move,${Xfrom},${Yfrom},${Xto},${Yto})`) == "success";
	}


	// undo move
	undo() {

	}

	// send command
	async sendCommand(command) {
		var request = new XMLHttpRequest();
		request.open('GET', this.url + command, true);
		request.onload = function (data) {
			console.log("Request successful. Reply: " + data.target.response);
			return data.target.response;
		};
		request.onerror = function () {
			console.log("Error waiting for response");
			return false;
		};

		request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
		request.send();
	}

	// private functions
	saveMoveResponse(response, restult) {
		let parts = response.split("+");
		if (parts[0] != "success") return false;

	}

	parseList(list) {
		list = list.replace(/\s+/g, '');
		let res = [
			[]
		];
		let level = 0; //level in the list
		let i = 0; // string index
		let string;
		while (i < list.length) {
			console.log("----", JSON.stringify(res), "----", string);
			if (list[i] == "[") { //one level in
				console.log((" ".repeat(level * 2)) + "start(" + level + ")");
				res[++level] = []; //new array
				string = "";
			} else if (list[i] == "]") { //one level out
				console.log((" ".repeat(level * 2)) + "end(" + level + ")[" + string + "]");
				if (string != "") {
					res[level].push(string);
				}
				string = "";
				level--;
				res[level].push(res[level + 1]);
				res.splice(level + 1, 1);
			} else if (list[i] == ",") { //same level, next list
				console.log((" ".repeat(level * 2)) + "comma(" + level + ")");
				if (string != "") {
					res[level].push(string);
				}
				string = "";
			} else { //element inside t
				console.log((" ".repeat(level * 2)) + list[i] + "(" + level + ")");
				string += list[i];
				// res[level].push(list[i]);
			}
			i++; //next char
		}
		console.log(JSON.stringify(res[0][0]));
		return res[0][0];
	}
}