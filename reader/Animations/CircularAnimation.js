function CircularAnimation(speed, centerx, centery, centerz, radius, startAng, rotAng) {
	this.speed = speed;
	this.centerx = centerx;
	this.centery = centery;
	this.centerz = centerz;
	this.radius = radius;
	this.startAng = startAng;
	this.rotAng = rotAng;
}

CircularAnimation.prototype = Object.create(Animation.prototype);
CircularAnimation.prototype.constructor = CircularAnimation;

CircularAnimation.prototype.animate = function(time) {
	var matrix = mat4.create();

	if (time > this.speed)
		time = this.speed;

	mat4.translate(matrix, matrix, [this.centerx, this.centery, this.centerz]);
	mat4.rotate(matrix, matrix, this.startAng + (time / this.speed) * this.rotAng, [0, 1, 0]);
	mat4.translate(matrix, matrix, [this.radius, 0, 0]);
	if(this.rotAng > 0)
		mat4.rotate(matrix, matrix, Math.PI, [0, 1, 0]);
	return matrix;
}