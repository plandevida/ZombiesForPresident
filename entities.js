function crearEntidades(Q) {

	/**************************************************
	* Zombie Principal
	***************************************************/
	Q.Sprite.extend("ZombiePlayer",{
	    init: function(p) {
	      this._super(p, { x:40, y:500 });
	      this.add('2d, platformerControls, animation');           
	    },
	    step: function(dt) {
	        if(Q.inputs['up']) {
	        
	        } else if(this.p.vx > 0) {
	          this.p.flip="x";         
	          this.play("run_right");
	        } else if(this.p.vx < 0) {
	          this.p.flip="";           
	          this.play("run_left");
	        } else {
	          this.play("stand_" + this.p.direction); 
	        }
	    } 
	                   
	});

}
 
