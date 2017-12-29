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

ComboAnimation.prototype.animate = function(time) {

    var matrix = mat4.create();

    if (this.animations.length === 0)
        return matrix;

    var remainingTime = time;

    for (var i = 0; i < this.animations.length; ++i) {
        if (remainingTime < this.animations[i].totalTime) {
            mat4.multiply(matrix, matrix, this.animations[i].animate(remainingTime));
            break;
        } else {
            remainingTime -= this.animations[i].totalTime;
        }
    }

    return matrix;
}