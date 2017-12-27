var DEGREE_TO_RAD = Math.PI / 180;

/**
 * XMLscene class, representing the scene that is to be rendered.
 * @constructor
 */
function XMLscene(interface) {
	CGFscene.call(this);

	this.interface = interface;

	this.lightValues = {};
	this.selectableValues = {};
	this.pieces = [];
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

	this.gl.clearDepth(100.0);
	this.gl.enable(this.gl.DEPTH_TEST);
	this.gl.enable(this.gl.CULL_FACE);
	this.gl.depthFunc(this.gl.LEQUAL);

	this.axis = new CGFaxis(this);

	this.setUpdatePeriod(1000 / 60);
	this.timerStarted = false;
	this.startingTime = 0;
	this.currTime = 0;

	this.selectedSelectable = 0;
	this.selectedShader = 0;
	this.wireframe = false;
	this.scaleFactor = 1.0;
	this.selectionColor = [0, 128, 255, 1]; //rgba

	/* this.shaders = [
		new CGFshader(this.gl, "Shaders/main.vert", "Shaders/main.frag"),
		new CGFshader(this.gl, "Shaders/flat.vert", "Shaders/flat.frag"),
		new CGFshader(this.gl, "Shaders/texture1.vert", "Shaders/texture1.frag")
	]; */
	this.pickedShader = new CGFshader(this.gl, "Shaders/main.vert", "Shaders/main.frag");
	//game settings
	this.server = new MyServer();

	this.setPickEnabled(true);
};

/**
 * Function called every update period
 */
XMLscene.prototype.update = function (currTime) {
	if (!this.timerStarted) {
		this.startingTime = currTime;
		this.timerStarted = true;
	}
	this.updateShaders(currTime);
	this.currTime = (currTime - this.startingTime) / 1000.0;
}

XMLscene.prototype.getCurrTime = function () {
	return this.currTime;
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
	if ( typeof this.lastPicked == 'undefined' ) {//simulate static variable
        this.lastPicked = false;
    }
	if (this.pickMode == false) {
		if (this.pickResults != null && this.pickResults.length > 0) {
			for (var i = 0; i < this.pickResults.length; i++) {
				var obj = this.pickResults[i][0];
				if (obj) {
					var customId = this.pickResults[i][1];
					console.log("Picked object: " + obj + ", with pick id " + customId);
					if(this.lastPicked != obj){
						if(this.lastPicked){
							this.lastPicked.picked = false;
						}
						this.lastPicked = obj;
					}
					obj.togglePicked();
				}
			}
			this.pickResults.splice(0, this.pickResults.length);
		}
	}
};

/**
 * Initializes the scene cameras.
 */
XMLscene.prototype.initCameras = function () {
	this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
}

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
	this.interface.addLightsGroup(this.graph.lights);
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

		// Draw axis
		this.axis.display();

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
		this.graph.displayScene();

		for (let i = 0; i < this.pieces.length; i++) {
			this.pushMatrix();{
				this.pieces[i].display();
			}this.popMatrix();
		}
		this.clearPickRegistration();
	} else {
		// Draw axis
		this.axis.display();
	}

	this.popMatrix();
	// ---- END Background, camera and axis setup


};
XMLscene.prototype.updateShaders = function () {
	if (typeof counter == 'undefined') {
		counter = 0;
	} //use counter as static variable
	counter++;
	let timeFactor = Math.abs(Math.sin(counter / 10));
	let timeFactorInverted = 1 - timeFactor;
	let goalColor = vec4.fromValues(this.selectionColor[0] / 255, this.selectionColor[1] / 255, this.selectionColor[2] / 255, 1);
	let saturatedColor = vec4.fromValues(255 / 255, 100 / 255, 100 / 255, 1);
	this.pickedShader.setUniformsValues({
		timeFactor: this.scaleFactor * timeFactor,
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
		this.interface.gameFolder.close();
		this.populatePieces();
	});
};

/**
 * Load the pieces from the server into the scene
 */
XMLscene.prototype.populatePieces = function () {
	for (let l = 0; l < this.server.board.length; l++) {
		const line = this.server.board[l];
		for (let c = 0; c < line.length; c++) {
			if (line[c].length > 0) {
				this.pieces.push(new Piece(this, l, c, 0, line[c][0]));
			}
		}
	}
	console.log(this.pieces);
};