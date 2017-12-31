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
	this.animation = false;
	this.timer = 0;

	//for stacks that only have one piece and are only used for claim
	this.claimable = claimable || false;
}
Stack.id = 0;

Stack.prototype = Object.create(CGFobject.prototype);
Stack.prototype.constructor = Stack;

Stack.prototype.display = function () {
	//animation, if exists
	if (this.animation) { //ongoing animation
		this.scene.multMatrix(this.animation.animate(this.timer));
		this.timer += this.scene.deltaTime;
		if (this.timer > this.animation.totalTime) { //animation end -> process move and clear varaibles
			this.destination.pieces = this.destination.pieces.concat(this.pieces);
			this.animation = false;
			this.pieces = [];
			this.destination = undefined;
			this.timer = 0;
		}
		// console.log("[stack] timer: " + this.timer);
	}
	//shaders and display
	if (this.picked) this.scene.setActiveShader(this.scene.pickedShader);
	else if (this.possible) this.scene.setActiveShader(this.scene.possibleShader);
	if (this.scene.countdownSeconds != 0) this.scene.registerForPick(this.id, this);
	for (let i = 0; i < this.pieces.length; i++) {
		this.scene.pushMatrix(); {
			this.pieces[i].display(this.line, this.column, i); //i is the height
		}
		this.scene.popMatrix();
	}
	if (this.picked || this.possible) this.scene.setActiveShader(this.scene.defaultShader);
};

Stack.prototype.moveTo = function (destination) {
	// this.animation = new LinearAnimation(
	// 	5, [{
	// 			x: Piece.factors.x * this.column + Piece.boardStart.x,
	// 			y: Piece.factors.y * this.pieces.length + Piece.boardStart.y,
	// 			z: Piece.factors.z * this.line + Piece.boardStart.z
	// 		}, {
	// 			x: Piece.factors.x * this.column + Piece.boardStart.x,
	// 			y: Piece.factors.y * this.pieces.length + Piece.boardStart.y,
	// 			z: Piece.factors.z * this.line + Piece.boardStart.z + 10
	// 		}
	// 		/* ,{
	// 					x: Piece.factors.x * destination.column + Piece.boardStart.x,
	// 					y: Piece.factors.y * destination.pieces.length + Piece.boardStart.y,
	// 					z: Piece.factors.z * destination.line + Piece.boardStart.z
	// 				} */
	// 	]);
	// this.animation = new CircularAnimation(speed, centerx, centery, centerz, radius, startAng, rotAng);4
	// this.animation = new CircularAnimation(1, Piece.factors.x * this.column + Piece.boardStart.x, Piece.factors.y * this.pieces.length + Piece.boardStart.y, Piece.factors.z * this.line + Piece.boardStart.z, 10, 0, 90);
	this.animation = new LinearAnimation(
		500, [{
			x: 0,
			y: 0,
			z: 0
		},{
			x: 0,
			y: 0,
			z: 1
		}]);
	this.destination = destination;
	// console.log(this.animation);
};