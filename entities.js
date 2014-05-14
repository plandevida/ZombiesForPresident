function crearEntidades(Q) {

	/**************************************************
	* Zombie Principal
	***************************************************/
	Q.Sprite.extend("ZombiePlayer",{
	    init: function(p) {
	      this._super(p, { 
	      	sheet: "zombieR",
	      	x: 40,
	      	y: 500
	      });

	      this.add('2d, platformerControls, tween'); 

	      //Q.input.on("fire", this, "launchHand");  
	      this.on("box.hit", "boxCollision");     
	    },

		/*launchHand: function() {

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
		},*/
		boxCollision: function(forwards) {
			
			if(Q.inputs['up']) {
				if(!this.p.climbing) {
					this.p.climbing = true;
					//this.del('platformerControls');
					var that = this;
					var newY = this.p.y - 66;
					var newX;

					if(forwards) newX = this.p.x + 64;
					else         newX = this.p.x - 64;
					
			
					this.animate({ y: newY }, 1, Q.Easing.Linear);
					this.animate({ x: newX , y: newY }, 0.5, Q.Easing.Linear, { delay: 1, callback: function() {
						that.p.climbing = false;
						//that.add('platformerControls');
					}});
				}
			}
			
		},

	    step: function(dt) {
	        if(this.p.x <= 32) this.p.x = 32;
	    } 
	                   
	});

	Q.Sprite.extend("Enemy",{
		init: function(p) {
			this._super(p, {
				sheet: "enemy1",
				shootTime: 5,
				time: 0
			});

			this.add('2d');

		},

		step: function(dt) {
			this.p.time += dt;

			if(this.p.time >= this.p.shootTime){
				this.p.time = 0;

				var zombie = Q("ZombiePlayer").first();

				if(Math.abs(zombie.p.x - this.p.x) < 400) {
					console.log("Bang Bang!!");
					if(zombie.p.x < this.p.x) { // La bala va hacia la izquierda
						this.p.direction = "left";
						Q.stage(0).insert(new Q.Bullet({ x: this.p.x - 32 - 15, y: this.p.y, vx: -100 }));
					}
					else { // La bala va hacia la derecha
						this.p.direction = "right";
						Q.stage(0).insert(new Q.Bullet({ x: this.p.x + 32, y: this.p.y, vx: +100 }));
					}
				}
			}
		}
	});

	/**************************************************
	* Miembros para lanzar
	***************************************************/
	/*Q.Sprite.extend("Miembros", {
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
	});*/

	/**************************************************
	* Objetos
	***************************************************/
	Q.MovingSprite.extend("Bullet", {
		init: function(p) {
			this._super(p, {
				sheet: "bullet",
				vx: 100
			});
		}
	});

	Q.Sprite.extend("Box", {
		init: function(p) {
			this._super(p, {
				sheet: "box"
			});

			this.add('2d');

			this.on("bump.left", function(col) {
				if(col.obj.isA("ZombiePlayer")) {
					col.obj.trigger("box.hit", true);
				}
			});

			this.on("bump.right", function(col) {
				if(col.obj.isA("ZombiePlayer")) {
					col.obj.trigger("box.hit", false);
				}
			});
		}

	});
}
 
