/**
 * Piece
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function Piece(scene, line, column, height, color) {
	CGFobject.call(this, scene);

	this.scene = scene;

	this.part1 = new Cylinder(this.scene, 0.8, 2.5, 2, 50, 50);
	this.part2 = new Cylinder(this.scene, -0.5, 2.8, 2, 50, 50);
	this.part3 = new Cylinder(this.scene, 1, 3.3, 3.3, 50, 50);
	this.part4 = new Cylinder(this.scene, 0, 3.3, 2.8, 50, 50);
	this.part5 = new Cylinder(this.scene, 0, 2, 0, 50, 50);
	this.part6 = new Cylinder(this.scene, 0, 3.3, 0, 50, 50);

	this.x = column || 0;
	this.y = height || 0;
	this.z = line || 0;
	this.color = color || "noColor";
}
//scale factor from prolog coordinates into the board size
Piece.factors = {
	z: 2.25,
	x: 3.9,
	y: 1
};
Piece.boardStart = {
	z: 10.5,
	x: 9.5,
	y: -0.1
};
Piece.prototype = Object.create(CGFobject.prototype);
Piece.prototype.constructor = Piece;

Piece.prototype.display = function () {
	this.scene.translate(
		Piece.factors.x * this.x + Piece.boardStart.x,
		Piece.factors.y * this.y + Piece.boardStart.y,
		Piece.factors.z * this.z + Piece.boardStart.z);
	this.scene.scale(0.45, 0.45, 0.45);
	this.scene.rotate(Math.PI / 2, -1, 0, 0);

	this.scene.pushMatrix();
	this.scene.translate(0, 0, 0.2);
	this.part1.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
	this.scene.translate(0, 0, 1);
	this.part2.display();
	this.part4.display();
	this.part5.display();
	this.scene.popMatrix();

	this.part3.display();

	this.scene.pushMatrix();
	this.scene.rotate(Math.PI, 0, 1, 0);
	this.part6.display();
	this.scene.popMatrix();
}