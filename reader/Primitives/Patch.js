function Patch(scene, div_u, div_v, cpoints) {

    this.scene = scene;
    this.div_u = div_u;
    this.div_v = div_v;
    var degree_1 = cpoints.length - 1;
    var degree_2 = cpoints[0].length - 1;

    this.makeSurface(degree_1, degree_2, cpoints);
}

Patch.prototype = Object.create(CGFnurbsObject.prototype);
Patch.prototype.constructor = Patch;

Patch.prototype.getKnotsVector = function(degree) {
    //return vector of degree + 1 zeros and degree + 1 ones, for the degrees
    var array0 = new Array(degree + 1).fill(0);
    var array1 = new Array(degree + 1).fill(1);
    return array0.concat(array1);
}

Patch.prototype.makeSurface = function(degree_1, degree_2, cpoints) {
    //create the nurbs surface from the knots and degress
    var knots_1 = this.getKnotsVector(degree_1);
    var knots_2 = this.getKnotsVector(degree_2);

    var nurbs_surface = new CGFnurbsSurface(degree_1, degree_2, knots_1, knots_2, cpoints);

    getSurfacePoint = function(u, v) {
        return nurbs_surface.getPoint(u, v);
    };

    this.nurbs_object = new CGFnurbsObject(this.scene, getSurfacePoint, this.div_u, this.div_v);
}

Patch.prototype.display = function() {
    this.nurbs_object.display();
}

//function stubs so the MySceneGraph can invoke them on any nodes
Patch.prototype.updateTexture = function(texture) {}

//function stubs so the MySceneGraph can invoke them on any nodes
Patch.prototype.setAmplifFactor = function(amplif_s, amplif_t) {}