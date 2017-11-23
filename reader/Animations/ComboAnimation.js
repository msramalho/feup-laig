function ComboAnimation(animations) {
	this.animations = [];

	//if( (typeof animations) != 'undefined' && animations != null) {
	this.animations = animations;
	//}

	this.totalTime = 0;

	for (var i = 0; i < this.animations.length; ++i) {
		this.totalTime += this.animations[i].totalTime;
	}
}

ComboAnimation.prototype = Object.create(Animation.prototype);
ComboAnimation.prototype.constructor = ComboAnimation;

ComboAnimation.prototype.animate = function (time) {
	console.log("ANIMATIONS ",this.matrix);

	if (time > this.totaltime)
		return this.matrix;

	this.matrix = mat4.create();

	if (this.animations.length === 0)
		return this.matrix;

	var remainingTime = time;

	for (var i = 0; i < this.animations.length; ++i) {
		if (remainingTime < this.animations[i].totalTime) {
			mat4.multiply(this.matrix, this.matrix, this.animations[i].animate(remainingTime));
			break;
		} else {
			remainingTime -= this.animations[i].totalTime;
		}
	}

	return this.matrix;
}