"user strict";
class MyServer {
	constructor(url, port) {
		this.player = {};
		this.nextPlayer = {};
		this.moves = []; //the moves done so far
		this.board = []; //the game board
		this.availableColors = [];
		this.botLevel1 = MyServer.botLevels[0];
		this.botLevel2 = MyServer.botLevels[0];
		this.gameType = MyServer.gameTypes[0];
		//defaults
		this.port = port || 8081;
		this.url = url || 'http://localhost:';
		this.url += this.port + "/";
		//utils
		this.color = false;
		this.firstPlayerName = "";
	}

	// start a new game - bool
	async init() {
		let gameIndex = MyServer.gameTypes.indexOf(this.gameType);
		let command = "";

		if (gameIndex == 0) { //humanVhuman
			command = `init(${this.gameType})`;
		} else if (gameIndex == 1) { //humanVbot
			command = `init(${this.gameType},${this.botLevel1})`;
		} else if (gameIndex == 2) { //botVbot
			command = `init(${this.gameType},${this.botLevel1},${this.botLevel2})`
		} else {
			throw "invalid game type";
		}

		let start = await this.sendCommand(command);
		this.board = this.parseList(await this.sendCommand("query(board)"));
		await this.updateState();
		this.firstPlayerName = await this.sendCommand("query(player)");
		return start == "success";
	}

	validGameType() {
		return MyServer.gameTypes.indexOf(this.gameType) != -1;
	}
	validBotLevel1() {
		return this.validBotLevel(this.botLevel1) || this.gameType == "humanVhuman";
	}
	validBotLevel2() {
		return this.validBotLevel(this.botLevel2) || this.gameType == "botVhuman";
	}
	validBotLevel(level) {
		return MyServer.botLevels.indexOf(level) != -1;
	}

	// move - true or error message
	async move(Xf, Yf, Xt, Yt) {
		let response = await this.sendCommand(`action(move,${Xf},${Yf},${Xt},${Yt})`);
		await this.updateState();
		return this.saveMoveResponse(response);
	}

	// claim - true or error message
	async claim(color) {
		self = this;
		return new Promise(function (resolve, reject) {
			self.sendCommandExpectSuccess(`action(claim,${color})`).then((value) => {
				if (value) self.color = color;
				resolve(value);
			});
		});
	}

	//update board
	async updateState() {
		this.nextPlayer = this.player;
		this.player = {
			name: await this.sendCommand("query(player)"),
			score: await this.sendCommand("query(score)")
		};
	}

	// get a list of valid moves from X and Y
	async getPossibleMoves(xf, yf) {
		return this.parseList(await this.sendCommand(`query(validMoves,${xf},${yf})`));
	}
	// undo move - true or error message
	async undo() {
		return await this.sendCommandExpectSuccess("action(undo)");
	}

	async getWinner() {
		return await this.sendCommand(`query(gameOver)`);
	}
	// is the next player from a bot
	isBotNext() {
		return this.gameType == "botVbot" || this.gameType == "humanVbot" && this.player.name[0] == "b";
	}

	// make the bot move
	async playBot() {
		let response = await this.sendCommand(`action(playBot)`);
		await this.updateState();
		return this.saveMoveResponse(response);
	}

	async sendCommandExpectSuccess(command) {
		let response = await this.sendCommand(command);
		if (response == "success") return true;
		return response;
	}

	// save a move response into the moves - true or error message
	saveMoveResponse(response) {
		let parts = response.split("+");
		if (parts[0] != "success") return response;
		let coords = parts[1].split("-");
		if (parts.length == 4 && parts[3] != "none") this.color = parts[3]; //bot move comes with extra info
		this.moves.push({
			Xf: coords[0],
			Yf: coords[1],
			Xt: coords[2],
			Yt: coords[3],
			removed: this.parseList(parts[2]),
			color: this.color,
			player: this.player,
			nextPlayer: this.nextPlayer
		});
		// if (this.color) this.player.colors.push(this.color);
		this.color = false;
		return true;
	}

	lastMove() {
		return this.moves[this.moves.length - 1];
	}

	// send command
	async sendCommand(command) {
		self = this;
		return new Promise(function (resolve, reject) {
			var request = new XMLHttpRequest();
			request.open('GET', self.url + command, true);
			let res;
			request.onload = function (data) {
				console.log("[" + command + "]: " + data.target.response);
				resolve(data.target.response);
			};
			request.onerror = function () {
				console.log("Error waiting for response(" + command + ")");
				resolve(false);
			};
			request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
			request.send();
		});
	}

	//parse a prolog list into an array (atoms are strings)
	parseList(list) {
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
MyServer.gameTypes = ["humanVhuman", "humanVbot", "botVbot"];
MyServer.botLevels = ["random", "greedy", "1", "2", "3"];