 /**
 * MyInterface class, creating a GUI interface.
 * @constructor
 */
function MyInterface() {
    //call CGFinterface constructor
    CGFinterface.call(this);
}
;

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

    // add a group of controls (and open/expand by defult)

    return true;
};

/**
 * Adds a folder containing the IDs of the lights passed as parameter.
 */
MyInterface.prototype.addLightsGroup = function(lights) {
	console.log("this.scene.lightValues");
	console.log(this.scene.lightValues);

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

/**
 * Adds a folder containing the IDs of the selectable nodes passed as parameter.
 */
MyInterface.prototype.addSelectablesGroup = function(selectables) {
	this.scene.selectableValues = {};
	for (let i = 0; i < selectables.length; i++) {
		const selectable = selectables[i];
		this.scene.selectableValues[selectable] = false;

	}

    var group = this.gui.addFolder("Selectables");
	group.open();

    for (var key in selectables) {
        if (selectables.hasOwnProperty(key)) {
            group.add(this.scene.selectableValues, selectables[key]);
        }
    }
};

