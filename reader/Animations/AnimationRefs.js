function AnimationRefs(animation) {
	this.animation = animation;
	this.totalTime = animation.totalTime;
}

AnimationRefs.prototype = Object.create(Animation.prototype);
AnimationRefs.prototype.constructor = AnimationRefs;

AnimationRefs.prototype.animate = function(time){
	if (time > this.totalTime)
		return this.matrix;

	this.matrix = mat4.create();

	this.matrix = this.animation.animate(time);

	return this.matrix;
}