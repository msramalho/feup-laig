function LinearAnimation(speed, controlPoints) {
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
	//calculate total time for the animation
	this.totalTime = this.totalDistance / this.speed;
}

LinearAnimation.prototype = Object.create(Animation.prototype);
LinearAnimation.prototype.constructor = LinearAnimation;

LinearAnimation.prototype.animate = function(time) {
	var matrix = mat4.create();

	 if (time >= this.totalTime){
		mat4.translate(matrix, matrix, this.controlPoints[this.controlPoints.length - 1]);
		mat4.rotate(matrix, matrix, this.calculateRotation(this.controlPoints[this.controlPoints.length - 2], this.controlPoints[this.controlPoints.length - 1]), [0, 1, 0]);
		return matrix;
	}

	var movePercentage = time % this.totalTime;//distance so far
	var currentDist = 0;
	var i;
	var dist;

		//determine which controlpoint is the current controlpoint
	for (i = 1; i < this.controlPoints.length; i++)
	{
		dist = this.calculateDistance(this.controlPoints[i - 1], this.controlPoints[i]);
		if ((currentDist + dist)/this.totalDistance < movePercentage)
			currentDist += dist;
		else
			break;
	}

	var s = currentDist; //
	var result = this.calculateMove(this.controlPoints[i - 1], this.controlPoints[i], s / dist);
	console.log(matrix);

	mat4.translate(result, matrix, matrix);

	mat4.rotate(matrix, matrix, this.calculateRotation(this.controlPoints[i - 1], this.controlPoints[i]), [0, 1, 0]);
	console.log(matrix);
	return matrix;
}

LinearAnimation.prototype.calculateRotation = function(p1, p2) {
	return Math.atan2(p2.x - p1.x, p2.y - p1.y);
}

LinearAnimation.prototype.calculateDistance = function(p1, p2) {
	return Math.sqrt(
			Math.pow(p2.x - p1.x, 2) +
			Math.pow(p2.y - p1.y, 2) +
			Math.pow(p2.z - p1.z, 2));
}

LinearAnimation.prototype.calculateMove = function(p1, p2, t) {
	var move = [];
	for (var i = 0; i < p1.length; i++)
	{
		move[i] = p1[i] * (1.0 - t) + (p2[i] * t);
	}
	return move;
}