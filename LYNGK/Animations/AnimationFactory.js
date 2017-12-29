/**
 * Returns a new Animation based on:
 * @param type (animationType): linear, circular, bezier, combo
 * @param p (animationProperties) some of the following:
 * 		. [single vars]: speed, centerx, centery, centerz, radius, startang, rotang
 * 		. [array of {x,y,z}]: controlpoints
 * 		. [array of Animation (or it's children)]: spanrefs
 */
function AnimationFactory(type, p) {
    if (type == "linear") {
        return new LinearAnimation(p.speed, p.controlpoints);
        //same as: return new LinearAnimation(p["speed"], p["controlpoints"]);
    } else if (type == "circular") {
        return new CircularAnimation(p.speed, p.centerx, p.centery, p.centerz, p.radius, p.startang, p.rotang);
    } else if (type == "bezier") {
        return new BezierAnimation(p.speed, p.controlpoints);
    } else if (type == "combo") {
        return new ComboAnimation(p.spanrefs);
    }
    return null;
}