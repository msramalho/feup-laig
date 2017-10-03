/**
 * MyGraphLeaf class, representing a leaf in the scene graph.
 * @constructor
 **/

function MyGraphLeaf(graph, xmlelem) {
    this.graph = graph;
    this.element = xmlelem;

    this.type = this.graph.reader.getItem(this.element, 'type', ['rectangle', 'cylinder', 'sphere', 'triangle']);
    this.args = this.graph.reader.getString(this.element, 'args').split(" ").map(Number);
    this.primitive = null;
    console.log(this.type);

    if (this.type == "rectangle") {
        this.primitive = new Rectangle(this.graph.scene,0,4,5,0)/*(this.graph.scene, this.args[0], this.args[1], this.args[2], this.args[3])*/ ;
    } else if (this.type == "triangle") {
        this.primitive = new Triangle(this.graph.scene, this.args[0], this.args[1], this.args[2], this.args[3], this.args[4], this.args[5], this.args[6], this.args[7], this.args[8]);
    } else if (this.type == "sphere") {
        this.primitive = new Sphere(this.graph.scene, this.args[0], this.args[1], this.args[2]);
    } else if (this.type == "cylinder") {
        this.primitive = new Cylinder(this.graph.scene, this.args[0], this.args[1], this.args[2], this.args[3], this.args[4]);
    }
}

