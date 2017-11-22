function CircularAnimation(speed, centerx, centery, centerz, radius, startAng, rotAng) {
	this.speed = speed;
	this.centerx = centerx;
	this.centery = centery;
	this.centerz = centerz;
	this.radius = radius;
	this.startAng = startAng*Math.PI/180;
	this.rotAng = rotAng*Math.PI/180;
	this.totaltime = (this.radius * this.rotAng)/this.speed;
}

CircularAnimation.prototype = Object.create(Animation.prototype);
CircularAnimation.prototype.constructor = CircularAnimation;

CircularAnimation.prototype.animate = function(time) {
	if (time > this.totaltime)
		return this.matrix;

	this.matrix = mat4.create();

	if (time > this.speed)
		time = this.speed;

	mat4.translate(this.matrix, this.matrix, [this.centerx, this.centery, this.centerz]);
	mat4.rotate(this.matrix, this.matrix, this.startAng + (time / this.totaltime) * this.rotAng, [0, 1, 0]);
	mat4.translate(this.matrix, this.matrix, [this.radius, 0, 0]);
	if(this.rotAng > 0)
		mat4.rotate(this.matrix, this.matrix, Math.PI, [0, 1, 0]);
	return this.matrix;
}