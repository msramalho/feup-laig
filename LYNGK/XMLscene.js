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
    this.stacks = [];
}

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

/**
 * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
 */
XMLscene.prototype.init = function(application) {
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
XMLscene.prototype.initTextures = function() {
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
XMLscene.prototype.update = function(systemTime) {
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
		this.camera = new CGFcamera(0.5, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, -2, 0));
}
/**
 * Initializes the scene lights with the values read from the LSX file.
 */
XMLscene.prototype.initLights = function() {
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
XMLscene.prototype.logPicking = function() {
    if (typeof this.lastPicked == 'undefined') { //simulate static variable
        this.lastPicked = false;
    }
    if (this.pickMode == false) {
        if (this.pickResults != null && this.pickResults.length > 0) {
            for (var i = 0; i < this.pickResults.length; i++) {
                var stack = this.pickResults[i][0];
                if (stack) {
                    var customId = this.pickResults[i][1];
                    console.log("Picked object: " + stack + ", with pick id " + customId);
                    if (this.lastPicked != stack) { //new stack picked, not the same to unpick
                        if (this.lastPicked) {
							if (stack.possible) { //this is actually an execute move, assumes it is valid
								/* this.pieceAnimation = this.lastPicked;
								this.pieceAnimation.to = stack;
								this.pieceAnimation.timer = 0; */
								/* this.pieceAnimation.animation = new CircularAnimation( //CIRCULAR TRY
									10,
									stack.pieces[0].x - this.pieceAnimation.pieces[0].x,
									stack.pieces[0].y - this.pieceAnimation.pieces[0].y,
									stack.pieces[0].z - this.pieceAnimation.pieces[0].z,
									10,
									0,
									180); */
								/* this.pieceAnimation.animation = new BezierAnimation( //BEZIER TRY
									10,
									[{ x: this.pieceAnimation.pieces[0].x, y: this.pieceAnimation.pieces[0].y, z: this.pieceAnimation.pieces[0].z },
									{ x: this.pieceAnimation.pieces[0].x, y: 3, z: this.pieceAnimation.pieces[0].z },
									{ x: stack.pieces[0].x, y: 3, z: stack.pieces[0].z },
									{ x: stack.pieces[0].x, y: stack.pieces[0].y, z: stack.pieces[0].z }]); */
								/* this.pieceAnimation.animation = new LinearAnimation(
									5,
									[{ x: 0, y: 0, z: 0 },
									{ x: stack.column - this.pieceAnimation.column, y: stack.pieces.length - this.pieceAnimation.pieces.length, z: stack.line - this.pieceAnimation.line }]);
								console.log("[PIECE ANIMATION TIME]", this.pieceAnimation.animation.totalTime); */
                                this.doMove(this.lastPicked, stack);
								this.clearPossible();
                                this.updateScoreTex();
                                break;
                            }
                            this.lastPicked.picked = false;
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

XMLscene.prototype.resetCountdown = function() {
    this.countdownStarted = true;
    this.countdownSeconds = this.secondsBaseline;
};

XMLscene.prototype.decreaseCountdown = function() {
    if (this.countdownStarted) {
        this.countdownSeconds -= this.deltaTime;
        if (this.countdownSeconds <= 0) {
            this.countdownStarted = false; //TODO: GAME OVER
			this.countdownSeconds = 0;
        }
    }
};

XMLscene.prototype.updateCountdownTex = function(node, digit) {
    node.textureID = "number" + Math.round(this.countdownSeconds).toString().charAt(digit - 1);
};

XMLscene.prototype.updateScoreTex = function() { //TODO: Diference between player 1/2 AND score always 20
    this.graph.nodes["score1"].textureID = "number" + this.server.player.score.toString().charAt(0);
    this.graph.nodes["score2"].textureID = "number" + this.server.nextPlayer.score.toString().charAt(1);
};

XMLscene.prototype.clearPossible = function() {
    for (let s = 0; s < this.stacks.length; s++)
        this.stacks[s].possible = false;
};

XMLscene.prototype.displayPossibleMoves = function(stack) {
    let self = this;
    this.server.getPossibleMoves(stack.line, stack.column).then(function(moves) {
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

XMLscene.prototype.doMove = function(from, to) {
    this.server.move(from.line, from.column, to.line, to.column).then((moveRes) => {
		if (moveRes) { //success -> animate
			from.moveTo(to);
            this.resetCountdown();
            // if (this.selectedScene == 2)
            //     this.cameraRotation = 32;
            this.clearPossible();
        } else {
            alert(`An error occured: ${moveRes}`);
        }
    });
};
/**
 * Initializes the scene cameras.
 */
XMLscene.prototype.initCameras = function() {
    this.camera = new CGFcamera(0.5, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, -2, 0));
}

/* Handler called when the graph is finally loaded.
 * As loading is asynchronous, this may be called already after the application has started the run loop
 */
XMLscene.prototype.onGraphLoaded = function() {
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
XMLscene.prototype.display = function() {
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

        for (let i = 0; i < this.stacks.length; i++) {
            this.pushMatrix(); {
				// if(this.stacks[i] == this.pieceAnimation){ //Checks if stack is going to be animated
				// 	if (this.pieceAnimation.timer < this.pieceAnimation.animation.totalTime) { //Stack animation
				// 		this.multMatrix(this.pieceAnimation.animation.animate(this.pieceAnimation.timer));
				// 		this.pieceAnimation.timer += this.deltaTime;
				// 	} else { //Moves after finishing animation
				// 		this.pieceAnimation.moveTo(this.pieceAnimation.to);
				// 		this.pieceAnimation = false;
				// 	}
				// }
				this.stacks[i].display();
            }
            this.popMatrix();
        }
        this.clearPickRegistration();
    } else {
        // Draw axis
        this.axis.display();
    }

    this.popMatrix();
    // ---- END Background, camera and axis setup


};
XMLscene.prototype.updateShaders = function() {
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
XMLscene.prototype.startNewGame = function() {
	console.log("startNewGame");
	this.secondsBaseline = this.countdownSecondsBaseline
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
        this.stacks = [];
        this.populateStacks();
    });
};

/**
 * Load the stacks from the server into the scene
 */
XMLscene.prototype.populateStacks = function() {
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
    console.log(this.stacks);
    //After stacks are populated countdown starts counting
    this.resetCountdown();
};