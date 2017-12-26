/**
 * Sphere
 * @param scene CGFscene where the Sphere will be displayed
 * @param radius Sphere radius
 * @param slices ammount of slices the sphere will be divided into along it's perimeter
 * @param stacksammount of stacks the sphere will be divided into along it's height
 * @constructor
 */
function Sphere(scene, radius, slices, stacks) {
	CGFobject.call(this, scene);

	this.radius = radius;
	this.slices = slices;
	this.stacks = stacks;

	this.initBuffers();
};

Sphere.prototype = Object.create(CGFobject.prototype);
Sphere.prototype.constructor = Sphere;

/**
 * Initializes the Sphere buffers (vertices, indices, normals and texCoords)
 */
Sphere.prototype.initBuffers = function () {
	var ang_perimeter = Math.PI * 2 / this.slices;
	var ang_height = Math.PI / this.stacks;


	this.indices = [];
	this.indicesTris = [];
	this.indicesLines = [];
	this.vertices = [];
	this.normals = [];
	this.texCoords = [];

	for (var j = 0; j <= this.slices; j++) {
		for (var i = 0; i <= this.stacks; i++) {
			var temp = Math.PI - ang_height * i;
			this.vertices.push(Math.sin(temp) * Math.cos(j * ang_perimeter) * this.radius,
				Math.sin(temp) * Math.sin(j * ang_perimeter) * this.radius,
				Math.cos(temp) * this.radius);
			this.normals.push(Math.sin(temp) * Math.cos(j * ang_perimeter),
				Math.sin(temp) * Math.sin(j * ang_perimeter),
				Math.cos(temp));
			this.texCoords.push(j / this.slices,
				1 - i / this.stacks);

			if (i > 0 && j > 0) {
				var verts = this.vertices.length / 3;
				this.indicesTris.push(verts - 2, verts - 1, verts - this.stacks - 2);
				this.indicesTris.push(verts - this.stacks - 2, verts - this.stacks - 3, verts - 2);
			}
		}
	}

	this.createIndicesLines();
	this.setFillMode();
	this.initGLBuffers();
};

/**
 * Does nothing. Required because of inheritance purposes
 */
Sphere.prototype.setAmplifFactor = function (amplif_s, amplif_t) {}

Sphere.prototype.createIndicesLines = function () {
	ntris = this.indicesTris.length / 3;
	this.indicesLines = new Array(ntris * 6);
	for (var i = 0; i < ntris; i++) {
		this.indicesLines[i * 6] = this.indicesTris[i * 3];
		this.indicesLines[i * 6 + 1] = this.indicesTris[i * 3 + 1];

		this.indicesLines[i * 6 + 2] = this.indicesTris[i * 3 + 1];
		this.indicesLines[i * 6 + 3] = this.indicesTris[i * 3 + 2];

		this.indicesLines[i * 6 + 4] = this.indicesTris[i * 3 + 2];
		this.indicesLines[i * 6 + 5] = this.indicesTris[i * 3];
	}
};

Sphere.prototype.setFillMode = function () {
	this.indices = this.indicesTris;
	this.primitiveType = this.scene.gl.TRIANGLES;
};

Sphere.prototype.setLineMode = function () {
	this.indices = this.indicesLines;
	this.primitiveType = this.scene.gl.LINES;
};