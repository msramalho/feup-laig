CircularAnimation.prototype = new Animation();

function CircularAnimation(speed, center, radius, angInit, rotation) {
	this.speed = speed;
	this.center = center;
	this.radius = radius;
	this.angInit = angInit;
	this.rotation = rotation;
}

CircularAnimation.prototype = Object.create(Animation.prototype);
CircularAnimation.prototype.constructor = CircularAnimation;

CircularAnimation.prototype.animate = function(time) {
	var matrix = mat4.create();

	if (time > this.speed)
		time = this.speed;

	mat4.translate(matrix, matrix, this.center);
	mat4.rotate(matrix, matrix, this.angInit + (time / this.speed) * this.rotation, [0, 1, 0]);
	mat4.translate(matrix, matrix, [this.radius, 0, 0]);
	if(this.rotation > 0)
		mat4.rotate(matrix, matrix, Math.PI, [0, 1, 0]);
	return matrix;
}