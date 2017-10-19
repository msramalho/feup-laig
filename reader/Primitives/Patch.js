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
    
    Patch.prototype.getKnotsVector = function(degree){

      var v = new Array();
    
      for (let i = 0; i <= degree; i++) {
        v.push(0);
      }
      for (let i = 0; i <= degree; i++) {
        v.push(1);
      }

      /*
      var array0 = new Array(degree).fill(0);
      var array1 = new Array(degree).fill(1);
      array0.concat(array1);
      */
      return v;
    }
    
    Patch.prototype.makeSurface = function(degree_1, degree_2, cpoints) {
      
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
    
    Patch.prototype.updateTexture = function(texture) {}

    Patch.prototype.setAmplifFactor = function(amplif_s, amplif_t) {}