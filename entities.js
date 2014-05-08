function crearEntidades(Q) {

	/**************************************************
	* Zombie Principal
	***************************************************/
	Q.Sprite.extend("ZombiePlayer",{
	    init: function(p) {
	      this._super(p, { x:40, y:500, sheet: "zombie", sprite: "zombie" });
	      this.add('2d, platformerControls, animation'); 

	      Q.input.on("fire", this, "launchHand");         
	    },

		launchHand: function() {

			if(Q.state.get("municion") > 0)
			{
				Q.audio.play("shot.mp3");

				Q.state.dec("municion",1);

			if(this.p.direction == "right") {
					var obj = new Q.Miembros({ x:this.p.x+34, y:this.p.y});
					this.stage.insert(obj);
					obj.add("tween");
					obj.animate({ x:this.p.x+800, y:this.p.y-50, angle:360 }, 1.5);
				}
		        else if(this.p.direction == "left") {
					var obj = new Q.Miembros({ x:this.p.x-34, y:this.p.y});
					this.stage.insert(obj);
					obj.add("tween");
					obj.animate({ x:this.p.x-800, y:this.p.y-50, angle:360 }, 1.5);
		        }

				setTimeout(function() { obj.destroy(); }, 1300);
		    }
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

	Q.Sprite.extend("EnemigoBlack",{
		init: function(p) {
			this._super(p, {
				sheet: "zombie",
				vx: -40
			});

			this.on("hit");
		},

		hit: function(col) {
			if ( col.obj.isA("ZombiePlayer") ) {
				this.destroy();
			}
		},

		step: function(dt) {
			var player = Q("ZombiePlayer").first();

			console.log(player.p.x );
		}
	});

	/**************************************************
	* Miembros para lanzar
	***************************************************/
	Q.Sprite.extend("Miembros", {
	      init: function(p) {
	          this._super(p, {
	          	sheet: "miembros",
	          	sprite: "miembros",
	          	vx: -20,
	          	cont: 1
	          });
	          
	          this.add('2d, animation');
	          
	          this.on("bump.top, bump.left, bump.right",function(collision) {
	            if(collision.obj.isA("ZombiePlayer")) {

				  this.destroy();

	              Q.state.inc("municion",1);
	            }
	          });
	      },
	       
	      step: function(dt){

	      	//gilipollez como una casa
	      	if ( this.p.cont >= 10) {
		      	if( this.p.flip ) {
		      	  	this.p.flip = false;
		  		}
		  		else {
		  			this.p.flip = "x";
		  		}
		  		this.p.cont = 1;
	  		}
	  		this.p.cont++;
	      },
	});
}
 
