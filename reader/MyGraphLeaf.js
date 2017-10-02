/**
 * MyGraphLeaf class, representing a leaf in the scene graph.
 * @constructor
**/

function MyGraphLeaf(graph, xmlelem) {
    this.graph = graph;
    this.element = xmlelem;

    this.type=this.graph.reader.getItem(this.element, 'type', ['rectangle', 'cylinder', 'sphere', 'triangle']);
    this.args = this.graph.reader.getString(this.element, 'args').split(" ");
    this.primitive = null;
    console.log(this.type);
    
    if (this.type == "rectangle"){
        
    }
    
}

