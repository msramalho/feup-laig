function BezierAnimation(speed, controlPoints) {
	this.speed = speed;
	this.controlPoints = [];
	console.log("CONTROL POINT", controlPoints);

	controlPoints.forEach(cp => {
		this.controlPoints.push(cp);
	}, this);

	this.calculateDistance();

	this.totaltime = this.totalDistance / this.speed;
}

BezierAnimation.prototype = Object.create(Animation.prototype);
BezierAnimation.prototype.constructor = BezierAnimation;

BezierAnimation.prototype.animate = function (time) {
	if (time > this.totaltime)
		return this.matrix;

	this.matrix = mat4.create();

	this.t = time / this.totaltime;

	if (this.t < 1.0) {
		var calc1 = Math.pow(1 - this.t, 3);
		var calc2 = 3 * this.t * (Math.pow(1 - this.t, 2));
		var calc3 = 3 * Math.pow(this.t, 2) * (1 - this.t);
		var calc4 = Math.pow(this.t, 3);

		var new_x = calc1 * this.controlPoints[0].x + calc2 * this.controlPoints[1].x + calc3 * this.controlPoints[2].x + calc4 * this.controlPoints[3].x;
		var new_y = calc1 * this.controlPoints[0].y + calc2 * this.controlPoints[1].y + calc3 * this.controlPoints[2].y + calc4 * this.controlPoints[3].y;
		var new_z = calc1 * this.controlPoints[0].z + calc2 * this.controlPoints[1].z + calc3 * this.controlPoints[2].z + calc4 * this.controlPoints[3].z;

		var dx = new_x - this.x;
		var dy = new_y - this.y;
		var dz = new_z - this.z;

		this.angleY = Math.atan(dx / dz) + (dz < 0 ? 180.0 * degToRad : 0);
		this.angleX = Math.atan(dy / Math.sqrt(dx * dx + dy * dy + dz * dz));

		/*   this.y_offset = (1 - this.t) * -1.6;
    if (this.y_offset > 0)
        this.y_offset = 0;
    this.z_offset = (1 - this.t) * 1.5;
    if (this.z_offset < 0)
		this.z_offset = 0; */

		mat4.translate(this.matrix, this.matrix, [new_x, new_y, new_z]);
	}
	return this.matrix;
}

BezierAnimation.prototype.calculateDistance = function () {
	var l1 = vec3.fromValues(this.controlPoints[0].x, this.controlPoints[0].y, this.controlPoints[0].z);
	var auxp2 = vec3.fromValues(this.controlPoints[1].x, this.controlPoints[1].y, this.controlPoints[1].z);
	var auxp3 = vec3.fromValues(this.controlPoints[2].x, this.controlPoints[2].y, this.controlPoints[2].z);
	var r4 = vec3.fromValues(this.controlPoints[3].x, this.controlPoints[3].y, this.controlPoints[3].z);
	var divide_aux = vec3.fromValues(2, 2, 2);

	var l2 = vec3.create();
	vec3.add(l2, l1, auxp2);
	vec3.divide(l2, l2, divide_aux);

	var h = vec3.create();
	vec3.add(h, auxp2, auxp3);
	vec3.divide(h, h, divide_aux);

	var l3 = vec3.create();
	vec3.add(l3, l2, h);
	vec3.divide(l3, l3, divide_aux);

	var r3 = vec3.create();
	vec3.add(r3, auxp3, r4);
	vec3.divide(r3, r3, divide_aux);

	var r2 = vec3.create();
	vec3.add(r2, h, r3);
	vec3.divide(r2, r2, divide_aux);

	this.totalDistance = vec3.distance(l1, l2) + vec3.distance(l2, l3) + vec3.distance(l3, r2) + vec3.distance(r2, r3) + vec3.distance(r3, r4);
	console.log("DISTANCIA", this.totalDistance);
}