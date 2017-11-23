function AnimationRefs(animation) {
	this.animation = animation;
}

AnimationRefs.prototype = Object.create(Animation.prototype);
AnimationRefs.prototype.constructor = AnimationRefs;

AnimationRefs.prototype.animate = function(time){
	return this.animation.animate(time);
}