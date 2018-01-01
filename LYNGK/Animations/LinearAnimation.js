function LinearAnimation(speed, controlPoints) {
    this.speed = speed;
    this.controlPoints = [];
    // console.log("CONTROL POINT", controlPoints);

    controlPoints.forEach(cp => {
        this.controlPoints.push(cp);
    }, this);

    this.totalDistance = 0;
    this.distance = [];
    this.distance.push(0);
    this.times = [];
    this.angles = [];
    this.animations = [];
    this.lastMatrix = undefined;


    for (var i = 1; i < this.controlPoints.length; i++) {
        this.distance.push(this.calculateDistance(this.controlPoints[i - 1], this.controlPoints[i]));
        this.times.push(this.distance[i] / this.speed);
        // console.log("DIST", this.distance[i] / this.speed);
        this.totalDistance += this.distance[i];
    }
    this.getAnimations();
    // console.log("[Linear]", this.totalDistance, this.times, this.distance, this.animations);
    this.totalTime = this.totalDistance / this.speed;

    // console.log("[Linear] totalTime: ", this.totalTime);
}

LinearAnimation.prototype = Object.create(Animation.prototype);
LinearAnimation.prototype.constructor = LinearAnimation;

LinearAnimation.prototype.animate = function(time) {
    if (this.animations.length == 0 || (typeof this.animations[0] === 'undefined' || !this.animations[0])) {
        return this.lastMatrix;
    }
    var matrix = mat4.create();

    if (time >= this.animations[0]['time']) {
        this.animations.shift();
        this.times.shift();
    }

    var animationTime = time - this.times[0];
    var animationDistance = animationTime * this.speed;
    var p1;
    try {
        p1 = this.animations[0]['p1'];
    } catch (error) {
        return this.lastMatrix;
    }
    var p2 = this.animations[0]['p2'];

    this.vec = vec3.fromValues(p2.x - p1.x, p2.y - p1.y, p2.z - p1.z);
    vec3.normalize(this.vec, this.vec);
    var orient = vec3.fromValues(1, 0, 0);
    this.angles = this.calcAngle(orient, this.vec);
    let aux = Object.values(this.vec);
    this.vec[0] = this.vec[0] * animationDistance;
    this.vec[1] = this.vec[1] * animationDistance;
    this.vec[2] = this.vec[2] * animationDistance;

    mat4.translate(matrix, matrix, [this.vec[0], this.vec[1], this.vec[2]]);

    mat4.rotateY(matrix, matrix, this.angles);

    this.lastMatrix = matrix;
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

LinearAnimation.prototype.getAnimations = function() {
    var lastTime = 0;
    var lastDistance = 0;
    // console.log(this.distance.length);
    for (var i = 1; i < this.distance.length; i++) {
        // console.log(this.controlPoints[i - 1]);
        // console.log(this.controlPoints[i]);
        // console.log(this.times[i - 1]);
        // console.log(this.distance[i]);
        // console.log(this.times[i - 1] - lastTime);
        // console.log(this.distance[i] - lastDistance);

        this.animations.push({ p1: this.controlPoints[i - 1], p2: this.controlPoints[i], time: this.times[i - 1], distance: this.distance[i], realtime: this.times[i - 1] - lastTime, realdistance: this.distance[i] - lastDistance });

        lastTime = this.times[i - 1];
        lastDistance = this.distance[i];
    }
}

LinearAnimation.prototype.calcAngle = function(vecA, vecB) {
    vec3.normalize(vecA, vecA);
    vec3.normalize(vecB, vecB);
    return Math.acos(vec3.dot(vecA, vecB));
}