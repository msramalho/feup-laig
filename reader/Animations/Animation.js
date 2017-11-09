var Animation = function() {
    if(this.constructor === Animation){
        throw new Error("This is an abstract class and cannot therefore be instantiated, use of it's descendants!");
	}
};

/**
 * Abstract methods TODO
 */
/* Animation.prototype.getMatrix = function() {
    throw new Error("getMatrix is an abstract method!");
};

Animation.prototype.animate = function(deltaTime){
    throw new Error("animate is an abstract method!");
}; */