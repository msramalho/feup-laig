/**
 * Stack
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function Stack(scene, line, column, claimable) {
	CGFobject.call(this, scene);

	this.scene = scene;

	this.line = line || 0;
	this.column = column || 0;
	this.pieces = []; //list of Piece

	this.id = ++Stack.id;

	//for shaders
	this.picked = false;
	this.possible = false;

	//for animations:
	this.anim = false;

	//for stacks that only have one piece and are only used for claim
	this.claimable = claimable || false;

	//for undo (registers the evolution of the number of pieces between movements)
	this.piecesBeforeMove = 0;
	this.howMany = 0; //how many pieces to transfer
}
Stack.id = 0;

Stack.prototype = Object.create(CGFobject.prototype);
Stack.prototype.constructor = Stack;

Stack.prototype.display = function () {
	//animation, if exists
	if (this.anim) { //ongoing animation
		// this.scene.multMatrix(this.anim.animate(this.timer));
		// this.timer += this.scene.deltaTime;
		if (this.timer > this.anim.totalTime) { //animation end -> process move and clear varaibles
			//process move

		}
		// console.log("[stack] timer: " + this.timer);
	}
	//shaders and display
	if (this.picked) this.scene.setActiveShader(this.scene.pickedShader);
	else if (this.possible) this.scene.setActiveShader(this.scene.possibleShader);
	if (this.scene.countdownSeconds != 0 && this.scene.server.gameType != "botVbot") this.scene.registerForPick(this.id, this);
	for (let i = 0; i < this.pieces.length; i++) {
		this.scene.pushMatrix(); {
			this.pieces[i].display(this.line, this.column, i); //i is the height
		}
		this.scene.popMatrix();
	}
	if (this.picked || this.possible) this.scene.setActiveShader(this.scene.defaultShader);
};
Stack.duration = 60; //duration of an animation (number of update calls)
Stack.prototype.moveTo = function (destination, howMany) {
	this.destination = destination;
	this.howMany = howMany || this.pieces.length;

	this.anim = {
		time: 0,
		from: { //starting point
			x: this.column,
			y: this.pieces.length,
			z: this.line
		},
		to: { //ending point
			x: destination.column,
			y: destination.pieces.length,
			z: destination.line
		},
		at: { //current point
			x: this.column,
			y: this.pieces.length,
			z: this.line
		}
	};
	//curve settings
	this.anim.h = 4; //max height
	this.anim.d = Math.sqrt(this.anim.h); //horizontal displacement
	this.anim.hd = Math.abs(this.anim.to.y - this.anim.from.y) + 1; // height difference between stacks
	this.anim.diff = this.anim.d + Math.sqrt(this.anim.h - this.anim.hd); //diff between zeros
	// console.log(this.anim);
};

Stack.prototype.update = function (currTime) {
	if (this.anim) { //if animation is ongoing
		if (this.anim.time >= Stack.duration) { //animation end
			//process move
			let top = this.pieces.slice(this.pieces.length - this.howMany);
			this.pieces = this.pieces.slice(0, this.pieces.length - this.howMany);
			this.destination.pieces = this.destination.pieces.concat(top);
			this.piecesBeforeMove = top.length;
			//clear varaibles
			this.anim = false;
			this.destination = undefined;
			return;
		}

		//else animation ongoing
		let percent = this.anim.time / Stack.duration;

		this.anim.at.y = this.anim.from.y - Math.pow(percent * this.anim.diff - this.anim.d, 2) + this.anim.h - this.anim.hd; //quadratic
		this.anim.at.z = this.anim.from.z + percent * (this.anim.to.z - this.anim.from.z);
		this.anim.at.x = this.anim.from.x + percent * (this.anim.to.x - this.anim.from.x);

		for (let i = 0; i < this.pieces.length; i++)
			if(i >= this.pieces.length - this.howMany)
				this.pieces[i].update(this.anim.at.z, this.anim.at.x, this.anim.at.y + i);
		this.anim.time++;
	} else {
		for (let i = 0; i < this.pieces.length; i++)
			this.pieces[i].update(this.line, this.column, i); // i is the height
	}
};