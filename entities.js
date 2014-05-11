function crearEntidades(Q) {

	/**************************************************
	* Zombie Principal
	***************************************************/
	Q.Sprite.extend("ZombiePlayer",{
	    init: function(p) {
	      this._super(p, {
	      	x:40, y:500,
	      	sheet: "zombieR", 
	      	jumpSpeed: 0
	      });
	      this.add('2d, platformerControls'); 

	      Q.input.on("fire", this, "launchHand");
	      //this.on("draw");
	      this.on("trepar");
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

	        // 	var dir;

	        // 	if (this.p.direction == "right") {
	        // 		dir = 1;
	        // 	}
	        // 	else if (this.p.direction == "left") {
	        // 		dir = -1;
	        // 	}

	        // 	console.log("posicion del player: " + this.p.x + " " + this.p.y + " hasta " + (this.p.x+this.p.w) + " " + (this.p.y+this.p.h));

	        // 	console.log("la caja está en: " + 3*34 + " " + 17*34 + " hasta " + (3*34+34) + " " + (17*34+34) );

	        // 	console.log("se busca una caja en: ");
	        // 	console.log(this.p.x + dir * 34);
	        // 	console.log(this.p.y+this.p.h*3/4);

	        // 	Q.ctx.fillStyle = "red";
      			// Q.ctx.beginPath();
      			// Q.ctx.arc(this.p.x + dir * 34, this.p.y+this.p.h*3/4, 5,0,Math.PI*2); 
      			// Q.ctx.fill();

	        // 	var caja = Q.stage().locate( this.p.x + dir * 34, this.p.y+this.p.h*3/4, "CajaTrepable");

	        // 	console.log(caja);
	        // 	Q.pauseGam()
	   		console.log(this.p.delaytrepar);

	        if ( !this.p.delaytrepar ) {
		        if(this.p.xcaja && this.p.ycaja) {
		        	this.p.x = this.p.xcaja;
		        	this.p.y = this.p.ycaja;
		        	this.p.xcaja = null;
		        	this.p.ycaja = null;

		        	var self = this;

		        	this.p.delaytrepar = true;
		        	setTimeout( function() {
		        		self.p.delaytrepar = undefined;
		        	}, 500);
		        }
		    }

	        } /*else if(this.p.vx > 0) {
	          this.p.flip="x";         
	          this.play("run_right");
	        } else if(this.p.vx < 0) {
	          this.p.flip="";           
	          this.play("run_left");
	        } else {
	          this.play("stand_" + this.p.direction); 
	        }*/
	        if(this.p.x <= 32) {
	        	this.p.x = 32;
	        }

	        if ( this.p.y >= Q.height + 150 ) {
	        	this.p.x = 40;
	        	this.p.y = 550;
	        	//this.destroy();
	        	//console.log("he muerto");
	        }
	    },

	    draw: function(ctx) {
	    	Q.ctx.fillStyle = "blue";
      		Q.ctx.beginPath();
      		Q.ctx.arc(this.p.x, this.p.y, 10,0,Math.PI*2); 
      		Q.ctx.fill();

      		this._super();
	    },

	    trepar: function(coords) {
	    	this.p.xcaja = coords.x;
	    	this.p.ycaja = coords.y;
	    }
	                   
	});

	Q.Sprite.extend("Localizer", {
 		init: function(p) {
 			this._super(p, {
 				x: 3*34,
 				y: 17*34,
 				w: 10,
 				gravity: 0,
 				type: Q.SPRITE_NONE,
 				collisionMask: Q.SPRITE_NONE
 			});
 		},
 
 		draw: function(ctx) {
 			ctx.fillStyle = "red";
 	      ctx.beginPath();
 	      ctx.arc(-this.p.cx,
               -this.p.cy,
               this.p.w/2,0,Math.PI*2); 
       		ctx.fill();
 		}
 	});

	Q.Sprite.extend("CajaTrepable", {
		init: function(p) {
			this._super(p, {
				sheet: "caja"
			});
			this.add("2d");

			this.on("bump.left, bump.right", this, "colisiones");
		},

		colisiones: function(col) {

			if(col.obj.isA("ZombiePlayer")) {

				  col.obj.trigger("trepar", {x:this.p.x, y:this.p.y});
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

			//console.log(player.p.x );
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
 
