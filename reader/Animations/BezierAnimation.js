function BezierAnimation(speed, controlPoints) {
	this.speed = speed;
	this.controlPoints = [];
	console.log("CONTROL POINT" , controlPoints);

	controlPoints.forEach(cp => {
		this.controlPoints.push(cp);
	}, this);

	this.totalDistance = 0;
	for (var i = 1; i < this.controlPoints.length; i++)
	{
		this.totalDistance += this.calculateDistance(this.controlPoints[i - 1], this.controlPoints[i]);
	}
}

BezierAnimation.prototype = Object.create(Animation.prototype);
BezierAnimation.prototype.constructor = BezierAnimation;

BezierAnimation.prototype.animate = function(time) {
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

	var time = s / dist;
	var p1 = this.controlPoints[i - 1];
	var p2 = this.controlPoints[i];
	var result = [];

	for (var j = 1; j < this.controlPoints[j - 1].length; j++)
	{
		result[j] = p1[j] * (1.0 - time) + (p2[j] * time);
	}
	return result;

	mat4.translate(matrix, matrix, result);

	mat4.rotate(matrix, matrix, this.calculateRotation(this.controlPoints[i - 1], this.controlPoints[i]), [0, 1, 0]);

	return matrix;
}

BezierAnimation.prototype.calculateRotation = function(p1, p2) {
	return Math.atan2(p2.x - p1.x, p2.y - p1.y);
}

BezierAnimation.prototype.calculateDistance = function(p1, p2) {
	return Math.sqrt(
			Math.pow(p2.x - p1.x, 2) +
			Math.pow(p2.y - p1.y, 2) +
			Math.pow(p2.y - p1.y, 2));
}