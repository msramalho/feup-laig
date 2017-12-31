/**
 * Stack
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function Stack(scene, line, column) {
    CGFobject.call(this, scene);

    this.scene = scene;

    this.line = line || 0;
    this.column = column || 0;
    this.pieces = []; //list of Piece

    //for shaders
    this.picked = false;
    this.possible = false;

    this.id = ++Stack.id;
}
Stack.id = 0;

Stack.prototype = Object.create(CGFobject.prototype);
Stack.prototype.constructor = Stack;

Stack.prototype.display = function() {
    if (this.picked) this.scene.setActiveShader(this.scene.pickedShader);
    else if (this.possible) this.scene.setActiveShader(this.scene.possibleShader);
	if (this.scene.countdownSeconds != 0) this.scene.registerForPick(this.id, this);
    for (let i = 0; i < this.pieces.length; i++) {
        this.scene.pushMatrix(); {
            this.pieces[i].display(this.line, this.column, i); //i is the height
        }
        this.scene.popMatrix();
    }
    if (this.picked || this.possible) this.scene.setActiveShader(this.scene.defaultShader);
};

Stack.prototype.moveTo = function(destination) {
    destination.pieces = destination.pieces.concat(this.pieces);
    this.pieces = [];
};