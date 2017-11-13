function LinearAnimation(speed, controlPoints) {
	this.init(id);
	this.speed = speed;
	this.controlPoints = controlPoints;

	this.totalDistance = 0;
	for (var i = 1; i < controlPoints.length; i++)
	{
		this.totalDistance += this.calculateDistance(controlPoints[i - 1], controlPoints[i]);
	}
}

LinearAnimation.prototype = Object.create(Animation.prototype);
LinearAnimation.prototype.constructor = LinearAnimation;

LinearAnimation.prototype.animate = function(time) {
	var matrix = mat4.create();
	if (time >= this.speed)
	{
		mat4.translate(matrix, matrix, this.controlPoints[this.controlPoints.length - 1]);
		mat4.rotate(matrix, matrix, this.calculateRotation(this.controlPoints[this.controlPoints.length - 2], this.controlPoints[this.controlPoints.length - 1]), [0, 1, 0]);
		return matrix;
	}
	var totalS = this.totalDistance * time / this.speed;
	var currentDist = 0;
	var i;
	var dist;
	for (i = 1; i < this.controlPoints.length; i++)
	{
		dist = this.calculateDistance(this.controlPoints[i - 1], this.controlPoints[i]);
		if (currentDist + dist < totalS)
			currentDist += dist;
		else
			break;
	}

	var s = totalS - currentDist;
	var interp = this.lerp(this.controlPoints[i - 1], this.controlPoints[i], s / dist);
	mat4.translate(matrix, matrix, interp);

	mat4.rotate(matrix, matrix, this.calculateRotation(this.controlPoints[i - 1], this.controlPoints[i]), [0, 1, 0]);

	return matrix;
}

LinearAnimation.prototype.calculateRotation = function(p1, p2) {
	return Math.atan2(p2[0] - p1[0], p2[2] - p1[2]);
}

LinearAnimation.prototype.calculateDistance = function(p1, p2) {
	return Math.sqrt(
			Math.pow(p2[0] - p1[0], 2) +
			Math.pow(p2[1] - p1[1], 2) +
			Math.pow(p2[2] - p1[2], 2));
}

LinearAnimation.prototype.lerp = function(p1, p2, time) {
	var result = [];
	for (var i = 0; i < p1.length; i++)
	{
		result[i] = p1[i] * (1.0 - time) + (p2[i] * time);
	}
	return result;
}