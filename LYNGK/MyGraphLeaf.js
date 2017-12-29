/**
 * MyGraphLeaf class, representing a leaf in the scene graph.
 * @constructor
 * @param graph a MySceneGraph that has a data structure that allows this method to access the parsed data from the .lsx file, calling the primitives
 * @param lsxelem the leaf element from the .lsx file
 * @see Rectangle
 * @see Triangle
 * @see Shpere
 * @see Cylinder
 * @see Patch
 * @see Piece
 **/

function MyGraphLeaf(graph, lsxelem) {
    this.graph = graph;
    this.element = lsxelem;

    //get type from accepted types
    this.type = this.graph.reader.getItem(this.element, 'type', ['rectangle', 'cylinder', 'sphere', 'triangle', 'patch', 'piece']);
    this.args = this.graph.reader.getString(this.element, 'args').split(" ").map(Number);
    this.primitive = null;
    console.log(this.type);

    //from the node type, instantiate the right primitive, with the correct arguments
    if (this.type == "rectangle") {
        this.primitive = new Rectangle(this.graph.scene, this.args[0], this.args[1], this.args[2], this.args[3]);
    } else if (this.type == "triangle") {
        this.primitive = new Triangle(this.graph.scene, this.args[0], this.args[1], this.args[2], this.args[3], this.args[4], this.args[5], this.args[6], this.args[7], this.args[8]);
    } else if (this.type == "sphere") {
        this.primitive = new Sphere(this.graph.scene, this.args[0], this.args[1], this.args[2]);
    } else if (this.type == "cylinder") {
        this.primitive = new Cylinder(this.graph.scene, this.args[0], this.args[1], this.args[2], this.args[3], this.args[4]);
    } else if (this.type == "patch") {
        this.primitive = new Patch(this.graph.scene, this.args[0], this.args[1], this.graph.patch);
    } else if (this.type == "piece") {
        this.primitive = new Piece(this.graph.scene);
    }
}