var DEGREE_TO_RAD = Math.PI / 180;

/**
 * XMLscene class, representing the scene that is to be rendered.
 * @constructor
 */
function XMLscene(interface) {
	CGFscene.call(this);

	this.interface = interface;
	this.interface.undo = () => {
		this.undo();
	};

	this.lightValues = {};
	this.selectableValues = {};
	this.stacks = [];
	this.claimableStacks = [];
	this.gameOver = true;


}

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

/**
 * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
 */
XMLscene.prototype.init = function (application) {
	CGFscene.prototype.init.call(this, application);

	this.initCameras();

	this.enableTextures(true);

	this.initTextures();

	this.gl.clearDepth(100.0);
	this.gl.enable(this.gl.DEPTH_TEST);
	this.gl.enable(this.gl.CULL_FACE);
	this.gl.depthFunc(this.gl.LEQUAL);

	this.axis = new CGFaxis(this);

	this.setUpdatePeriod(1000 / 60);
	this.timerStarted = false;
	this.startingTime = 0;
	this.currTime = 0;
	this.countdownSecondsBaseline = 60;

	this.selectedScene = 2;
	this.pieceAnimation = false;
	this.selectedShader = 0;
	this.wireframe = false;
	this.scaleFactor = 2;
	this.selectionColor = [240, 240, 40, 1]; //rgba

	/* this.shaders = [
		new CGFshader(this.gl, "Shaders/main.vert", "Shaders/main.frag"),
		new CGFshader(this.gl, "Shaders/flat.vert", "Shaders/flat.frag"),
		new CGFshader(this.gl, "Shaders/texture1.vert", "Shaders/texture1.frag")
	]; */
	this.pickedShader = new CGFshader(this.gl, "Shaders/picked.vert", "Shaders/picked.frag");
	this.possibleShader = new CGFshader(this.gl, "Shaders/possible.vert", "Shaders/possible.frag");
	//game settings
	this.server = new MyServer();

	this.setPickEnabled(true);
};
/**
 * Initialize Pieces Textures
 */
XMLscene.prototype.initTextures = function () {
	this.blackMaterial = new CGFappearance(this);
	this.blackMaterial.setAmbient(0.1, 0.1, 0.1, 1);
	this.blackMaterial.setDiffuse(0.1, 0.1, 0.1, 1);
	this.blackMaterial.setSpecular(0.34, 0.32, 0.17, 1);
	this.blackMaterial.loadTexture("Scenes/images/dirt.jpg");
	this.blackMaterial.setShininess(10);

	this.redMaterial = new CGFappearance(this);
	this.redMaterial.setAmbient(1, 0.1, 0.1, 1);
	this.redMaterial.setDiffuse(1, 0.05, 0.05, 1);
	this.redMaterial.setSpecular(0.9, 0.32, 0.17, 0.5);
	this.redMaterial.loadTexture("Scenes/images/dirt.jpg");
	this.redMaterial.setShininess(5);

	this.ivoryMaterial = new CGFappearance(this);
	this.ivoryMaterial.setAmbient(0.6, 0.6, 0.6, 1);
	this.ivoryMaterial.setDiffuse(0.3, 0.3, 0.3, 1);
	this.ivoryMaterial.setSpecular(0.75, 0.75, 0.75, 0.5);
	this.ivoryMaterial.loadTexture("Scenes/images/dirt.jpg");
	this.ivoryMaterial.setShininess(10);

	this.greenMaterial = new CGFappearance(this);
	this.greenMaterial.setAmbient(0.2, 0.2, 0.2, 1);
	this.greenMaterial.setDiffuse(0, 0.407, 0, 1);
	this.greenMaterial.setSpecular(0.05, 0.207, 0.05, 1);
	this.greenMaterial.loadTexture("Scenes/images/dirt.jpg");
	this.greenMaterial.setShininess(10);

	this.blueMaterial = new CGFappearance(this);
	this.blueMaterial.setAmbient(0.1, 0.1, 0.1, 1);
	this.blueMaterial.setDiffuse(0, 0.3, 0.8, 1);
	this.blueMaterial.setSpecular(0.2, 0.2, 1, 1);
	this.blueMaterial.loadTexture("Scenes/images/dirt.jpg");
	this.blueMaterial.setShininess(10);

	this.wildMaterial = new CGFappearance(this);
	this.wildMaterial.setAmbient(0.6, 0.6, 0.6, 1);
	this.wildMaterial.setDiffuse(0.3, 0.3, 0.3, 1);
	this.wildMaterial.setSpecular(0.75, 0.75, 0.75, 0.5);
	this.wildMaterial.loadTexture("Scenes/images/spotty.jpg");
	this.wildMaterial.setShininess(10);
}
/**
 * Function called every update period
 */
XMLscene.prototype.update = function (systemTime) {
	if (!this.timerStarted) {
		this.startingTime = systemTime;
		this.timerStarted = true;
	}
	this.updateShaders();
	this.oldTime = this.currTime;
	this.currTime = (systemTime - this.startingTime) / 1000.0;
	this.deltaTime = this.currTime - this.oldTime;
	this.decreaseCountdown();
	if (this.cameraRotation > 0) {
		this.camera.orbit(vec3.fromValues(0, 1, 0), Math.PI / 32);
		this.cameraRotation--;
	}
	if (this.selectedScene == 1 && this.camera.position != vec3.fromValues(15, 15, 15))
		this.initCameras();
}
/**
 * Initializes the scene lights with the values read from the LSX file.
 */
XMLscene.prototype.initLights = function () {
	var i = 0;
	// Lights index.

	// Reads the lights from the scene graph.
	for (var key in this.graph.lights) {
		if (i >= 8)
			break; // Only eight lights allowed by WebGL.

		if (this.graph.lights.hasOwnProperty(key)) {
			var light = this.graph.lights[key];

			this.lights[i].setPosition(light[1][0], light[1][1], light[1][2], light[1][3]);
			this.lights[i].setAmbient(light[2][0], light[2][1], light[2][2], light[2][3]);
			this.lights[i].setDiffuse(light[3][0], light[3][1], light[3][2], light[3][3]);
			this.lights[i].setSpecular(light[4][0], light[4][1], light[4][2], light[4][3]);

			this.lights[i].setVisible(true);
			if (light[0])
				this.lights[i].enable();
			else
				this.lights[i].disable();

			this.lights[i].update();

			i++;
		}
	}

}
/**
 * Logs objects picked.
 */
XMLscene.prototype.logPicking = function () {
	if (typeof this.lastPicked == 'undefined') { //simulate static variable
		this.lastPicked = false;
	}
	if (this.pickMode == false) {
		if (this.pickResults != null && this.pickResults.length > 0) {
			for (let i = 0; i < this.pickResults.length; i++) {
				let stack = this.pickResults[i][0];
				if (stack) {
					let customId = this.pickResults[i][1];
					console.log("Picked object: " + stack + ", with pick id " + customId);
					if (stack.claimable) { //this is a claiming action and not a move
						this.claim(stack);
						break;
					}
					if (this.lastPicked != stack) { //new stack picked, not the same to unpick
						if (this.lastPicked) {
							this.lastPicked.picked = false;
							if (stack.possible) { //this is actually an execute move, assumes it is valid
								this.doMove(this.lastPicked, stack);
								break;
							}
							this.clearPossible();
						}
						this.lastPicked = stack;
					}
					stack.picked = !stack.picked;
					if (stack.picked) {
						this.displayPossibleMoves(stack);
					} else {
						this.clearPossible();
					}
				}
			}
			this.pickResults.splice(0, this.pickResults.length);
		}
	}
};

XMLscene.prototype.resetCountdown = function () {
	this.countdownStarted = true;
	this.countdownSeconds = this.secondsBaseline;
};

XMLscene.prototype.decreaseCountdown = function () {
	if (this.countdownStarted) {
		this.countdownSeconds -= this.deltaTime;
		if (this.countdownSeconds <= 0) {
			this.countdownStarted = false;
			this.countdownSeconds = 0;
			let winner = "draw";
			if (this.server.player.score > this.server.nextPlayer.score)
				winner = this.server.player.name;
			else if (this.server.player.score < this.server.nextPlayer.score)
				winner = this.server.nextPlayer.name;
			this.displayGameOver(winner);
		}
	}
};

XMLscene.prototype.updateCountdownTex = function (node, digit) {
	node.textureID = "number" + Math.round(this.countdownSeconds).toString().charAt(digit - 1);
};

XMLscene.prototype.updateScoreTex = function () {
	let score1 = this.server.nextPlayer.score;
	let score2 = this.server.player.score;
	if (this.server.player.name == this.server.firstPlayerName) {
		let temp = score1;
		score1 = score2;
		score2 = temp;
	}
	this.graph.nodes["score1"].textureID = "number" + score1.toString().charAt(0);
	this.graph.nodes["score2"].textureID = "number" + score1.toString().charAt(1);
	this.graph.nodes["score3"].textureID = "number" + score2.toString().charAt(0);
	this.graph.nodes["score4"].textureID = "number" + score2.toString().charAt(1);
};

XMLscene.prototype.clearPossible = function () {
	for (let s = 0; s < this.stacks.length; s++)
		this.stacks[s].possible = false;
};

XMLscene.prototype.displayPossibleMoves = function (stack) {
	let self = this;
	this.server.getPossibleMoves(stack.line, stack.column).then(function (moves) {
		moves.forEach(move => {
			for (let i = 0; i < self.stacks.length; i++) {
				const s = self.stacks[i];
				if (move == `${s.line}-${s.column}`) {
					s.possible = true;
					break; //found the stack for this move
				}
			}
		});
	});
};

XMLscene.prototype.testGameOver = function (result) {
	if (result == "game over") { //not an error, game over
		this.server.getWinner().then((winner) => {
			this.displayGameOver(winner);
		});
	} else {
		alert(`An error occured: ${result}`);
	}
};
XMLscene.prototype.displayGameOver = function (winner) {
	alert(`Game Over the winner is: ${winner}`);
	this.gameOver = true;
	this.interface.gameFolder.open();
};

XMLscene.prototype.doMove = function (from, to) {
	this.server.move(from.line, from.column, to.line, to.column).then((moveRes) => {
		if (moveRes === true) { //success -> animate
			from.moveTo(to);
			this.updateScoreTex();
			this.resetCountdown();
			// if (this.selectedScene == 2 && this.server.gameType == "humanVhuman")
			// 	this.cameraRotation = 32;
			this.clearPossible();
			this.doBotMove(); //only if this a bot is playing will this do anything
		} else {
			this.testGameOver(moveRes);
		}
	});
};

XMLscene.prototype.doBotMove = function () {
	if (this.server.isBotNext() && !this.gameOver) {
		this.server.playBot().then((botMove) => { //bot move successful
			if (botMove === true) { //success
				this.executeMove(this.server.lastMove());
				this.updateScoreTex();
				this.doBotMove();
			} else {
				this.testGameOver(botMove);
			}

		});
	}
};
XMLscene.prototype.executeMove = function (move) {
	//find stack from and to
	let from = this.findStackByLineAndColumn(move.Xf, move.Yf);
	let to = this.findStackByLineAndColumn(move.Xt, move.Yt);
	//execute move
	from.moveTo(to);
	//execute claim, if exists
	if (move.color) { //there was also a color claim
		let claimedColorStack = this.findClaimableByColor(move.color);
		if (this.server.player.name == this.server.firstPlayerName) claimedColorStack.moveTo(this.claimed2);
		else claimedColorStack.moveTo(this.claimed1);
	}
	this.updateScoreTex();
};

XMLscene.prototype.claim = function (stack) {
	this.server.claim(stack.pieces[0].color).then((claimRes) => {
		if (claimRes === true) {
			if (this.server.player.name == this.server.firstPlayerName) stack.moveTo(this.claimed1);
			else stack.moveTo(this.claimed2);
		} else {
			this.testGameOver(claimRes);
		}
	});
};


XMLscene.prototype.undo = function () {
	this.server.undo().then((undoRes) => {
		if (undoRes === true) {
			let lm = this.server.lastMove();
			let undoFrom = this.findStackByLineAndColumn(lm.Xt, lm.Yt); //undo from = original to
			let undoTo = this.findStackByLineAndColumn(lm.Xf, lm.Yf); //undo to = original from
			undoFrom.moveTo(undoTo, undoTo.piecesBeforeMove);
		} else {
			alert(`Unable to undo: ${undoRes}`);
		}
	});
};

XMLscene.prototype.findStackByLineAndColumn = function (line, column) {
	for (let i = 0; i < this.stacks.length; i++) {
		const s = this.stacks[i];
		if (s.line == line && s.column == column)
			return this.stacks[i];
	}
};

XMLscene.prototype.findClaimableByColor = function (color) {
	for (let i = 0; i < this.claimableStacks.length; i++) {
		const s = this.claimableStacks[i];
		if (s.pieces.length > 0 && s.pieces[0].color == color)
			return this.claimableStacks[i];
	}
};

/**
 * Initializes the scene cameras.
 */
XMLscene.prototype.initCameras = function () {
	this.camera = new CGFcamera(0.5, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, -2, 0));
};

/* Handler called when the graph is finally loaded.
 * As loading is asynchronous, this may be called already after the application has started the run loop
 */
XMLscene.prototype.onGraphLoaded = function () {
	this.camera.near = this.graph.near;
	this.camera.far = this.graph.far;
	this.axis = new CGFaxis(this, this.graph.referenceLength);

	this.setGlobalAmbientLight(this.graph.ambientIllumination[0], this.graph.ambientIllumination[1],
		this.graph.ambientIllumination[2], this.graph.ambientIllumination[3]);

	this.gl.clearColor(this.graph.background[0], this.graph.background[1], this.graph.background[2], this.graph.background[3]);

	this.initLights();

	// Adds lights group.
	//this.interface.addLightsGroup(this.graph.lights);
	//this.interface.addShadersGroup(this.graph.selectables);
};

/**
 * Displays the scene.
 */
XMLscene.prototype.display = function () {
	// Calls picking logger
	this.logPicking();
	// ---- BEGIN Background, camera and axis setup

	// Clear image and depth buffer everytime we update the scene
	this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
	this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

	// Initialize Model-View matrix as identity (no transformation
	this.updateProjectionMatrix();
	this.loadIdentity();

	// Apply transformations corresponding to the camera position relative to the origin
	this.applyViewMatrix();

	this.pushMatrix();

	if (this.graph.loadedOk) {
		// Applies initial transformations.
		this.multMatrix(this.graph.initialTransforms);

		//detect changes in the lights
		var i = 0;
		for (var key in this.lightValues) {
			if (this.lightValues.hasOwnProperty(key)) {
				if (this.lightValues[key]) {
					this.lights[i].setVisible(true);
					this.lights[i].enable();
				} else {
					this.lights[i].setVisible(false);
					this.lights[i].disable();
				}
				this.lights[i].update();
				i++;
			}
		}
		// Displays the scene.
		this.graph.displayScene(this.selectedScene);

		this.displayStacks(this.stacks);
		this.displayStacks(this.claimableStacks);
		this.displayStacks([this.claimed1, this.claimed2]);


		this.clearPickRegistration();
	} else {
		// Draw axis
		this.axis.display();
	}

	this.popMatrix();
	// ---- END Background, camera and axis setup


};

XMLscene.prototype.displayStacks = function (stacks) {
	for (let i = 0; i < stacks.length; i++) {
		if (stacks[i]) {
			this.pushMatrix();
			stacks[i].display();
			this.popMatrix();
		}
	}
};

XMLscene.prototype.updateShaders = function () {
	if (typeof counter == 'undefined') {
		counter = 0;
	} //use counter as static variable
	counter++;
	let timeFactor = Math.abs(Math.sin(counter / 10));
	let timeFactorInverted = 1 - timeFactor;
	let goalColor = vec4.fromValues(this.selectionColor[0] / 255, this.selectionColor[1] / 255, this.selectionColor[2] / 255, 1);
	let saturatedColor = vec4.fromValues(255 / 255, 170 / 255, 0 / 255, 1);
	this.pickedShader.setUniformsValues({
		timeFactor: timeFactor,
		timeFactorInverted: timeFactorInverted,
		goal_r: goalColor[0],
		goal_g: goalColor[1],
		goal_b: goalColor[2],
		saturated_r: saturatedColor[0],
		saturated_g: saturatedColor[1],
		saturated_b: saturatedColor[2],
	});
};


/**
 * Start a new Game
 */
XMLscene.prototype.startNewGame = function () {
	console.log("startNewGame");
	this.gameOver = true;
	this.secondsBaseline = this.countdownSecondsBaseline;
	this.initCameras();
	if (!this.server.validGameType()) {
		alert(`Invalid game type selected: ${this.server.gameType}`);
		return;
	}
	if (!this.server.validBotLevel1()) {
		alert(`Invalid botlevel 1 type selected: ${this.server.botLevel1}`);
		return;
	}
	if (!this.server.validBotLevel2()) {
		alert(`Invalid botlevel 2 type selected: ${this.server.botLevel2}`);
		return;
	}
	this.server.init().then((value) => {
		this.gameOver = false;
		this.interface.gameFolder.close();
		this.populateStacks();
		this.populateClaimableStacks();
		this.doBotMove();
	}).catch((error) => {
		alert(`Unable to start game, check if server is open`);
	});
};

/**
 * Load the stacks from the server into the scene
 */
XMLscene.prototype.populateStacks = function () {
	this.stacks = [];
	for (let l = 0; l < this.server.board.length; l++) {
		const line = this.server.board[l];
		for (let c = 0; c < line.length; c++) {
			if (line[c].length > 0) {
				let stack = new Stack(this, l, c);
				stack.pieces.push(new Piece(this, line[c][0]));
				this.stacks.push(stack);
			}
		}
	}
	//After stacks are populated countdown starts counting
	this.resetCountdown();
};

XMLscene.prototype.populateClaimableStacks = function () {
	this.claimableStacks = [];
	let colors = ["blue", "green", "black", "red", "ivory"];
	for (let l = 0; l < colors.length; l++) {
		let stack = new Stack(this, l * 2 + 2, 9, true);
		stack.pieces.push(new Piece(this, colors[l]));
		this.claimableStacks.push(stack);
	}
	//color already claimed go into these 2 stacks:
	this.claimed1 = new Stack(this, 15, 0);
	this.claimed2 = new Stack(this, -1, 0);
};

XMLscene.prototype.gameMovie = function () {
	//TODO: desativar tudo do user
	this.populateStacks();
	this.populateClaimableStacks();

	for (let i = 0; i < this.server.moves.length; i++) {
		console.log("executing: " + JSON.stringify(this.server.moves[i]));
		const move = this.server.moves[i];
		this.server.player = move.player;
		this.server.nextPlayer = move.nextPlayer;
		setTimeout(function() {this.executeMove(move);}.bind(this), 2000*i);
	}
};