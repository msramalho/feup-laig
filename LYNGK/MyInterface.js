 /**
 * MyInterface class, creating a GUI interface.
 * @constructor
 */
function MyInterface(availableShaders) {
	//call CGFinterface constructor
	this.availableShaders = availableShaders;


    CGFinterface.call(this);
};

MyInterface.prototype = Object.create(CGFinterface.prototype);
MyInterface.prototype.constructor = MyInterface;

/**
 * Initializes the interface.
 * @param {CGFapplication} application
 */
MyInterface.prototype.init = function(application) {
    // call CGFinterface init
    CGFinterface.prototype.init.call(this, application);

    // init GUI. For more information on the methods, check:
    //  http://workshop.chromeexperiments.com/examples/gui

    this.gui = new dat.GUI();


    return true;
};

/**
 * Adds a folder containing the IDs of the lights passed as parameter.
 */
MyInterface.prototype.addLightsGroup = function(lights) {
    var group = this.gui.addFolder("Lights");
    group.open();

    // add two check boxes to the group. The identifiers must be members variables of the scene initialized in scene.init as boolean
    // e.g. this.option1=true; this.option2=false;

    for (var key in lights) {
        if (lights.hasOwnProperty(key)) {
            this.scene.lightValues[key] = lights[key][0];
            group.add(this.scene.lightValues, key);
        }
    }
};

/* MyInterface.prototype.addShadersGroup = function(selectables) {
    this.shadersFolder = this.gui.addFolder("Shaders Options");
	this.shadersFolder.open();

	this.shadersFolder.add(this.scene, 'selectedSelectable', selectables).name('Selectables: ');
	this.shadersFolder.add(this.scene, 'selectedShader', this.availableShaders).name('Shaders: ');
	this.shadersFolder.addColor(this.scene, 'selectionColor').name('Selection Color: ');
	this.shadersFolder.add(this.scene,'scaleFactor', -10.0, 10.0);
	this.shadersFolder.add(this.scene, 'wireframe').name('Wireframe');
}; */