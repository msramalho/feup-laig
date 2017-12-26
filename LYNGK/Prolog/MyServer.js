"user strict";

class MyServer {
	constructor(url, port) {
		this.player = undefined;
		this.nextPlayer = undefined;
		this.moves = []; //the moves done so far
		this.board = []; //the game board
		//defaults
		this.port = port || 8081;
		this.url = url || 'http://localhost:';
		this.url += this.port + "/";
	}

	// start a new game
	async init(gameType) {
		let start = await this.sendCommand(`init(${gameType})`);
		await this.updateBoard();
		this.player = await this.sendCommand("query(player)");
		this.nextPlayer = await this.sendCommand("query(nextPlayer)");
		return start == "success";
	}

	// move
	async move(Xfrom, Yfrom, Xto, Yto) {
		let response = await this.sendCommand(`action(move,${Xfrom},${Yfrom},${Xto},${Yto})`);
		await this.updateBoard();
		return this.saveMoveResponse(response);
	}

	//update board
	async updateBoard(){
		this.board = this.parseList(await this.sendCommand("query(board)"));
	}

	// undo move
	async undo() {
		return await this.sendCommand("action(undo)");
	}

	// private functions
	saveMoveResponse(response) {
		let parts = response.split("+");
		if (parts[0] != "success") return response;
		let coords = parts[1].split("-");
		this.moves.push({
			Xf: coords[0],
			Yf: coords[1],
			Xt: coords[2],
			Yt: coords[3],
			removed: this.parseList(parts[2])
		});
		return true;
	}

	// send command
	async sendCommand(command) {
		self = this;
		return new Promise(function (resolve, reject) {
			var request = new XMLHttpRequest();
			request.open('GET', self.url + command, true);
			let res;
			request.onload = function (data) {
				console.log("["+command+"]: " + data.target.response);
				resolve(data.target.response);
			};
			request.onerror = function () {
				console.log("Error waiting for response("+command+")");
				resolve(false);
			};

			request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
			request.send();
		});
	}

	parseList(list) {
		// console.log("list = " + list);
		list = list.replace(/\s+/g, '');
		let res = [
			[]
		];
		let level = 0; //level in the list
		let i = 0; // string index
		let string;
		while (i < list.length) {
			if (list[i] == "[") { //one level in
				res[++level] = []; //new array
				string = "";
			} else if (list[i] == "]") { //one level out
				if (string != "") res[level].push(string);
				string = "";
				res[--level].push(res[level + 1]);
				res.splice(level + 1, 1);
			} else if (list[i] == ",") { //same level, next list
				if (string != "") res[level].push(string);
				string = "";
			} else { //element inside t
				string += list[i];
			}
			i++; //next char
		}
		return res[0][0];
	}
}