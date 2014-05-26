function crearEntidades(Q) {


	Q.SPRITE_BOX = 128;
	Q.SPRITE_DIRT = 256;

	/**************************************************
	* Zombie Principal
	***************************************************/
	Q.Sprite.extend("ZombiePlayer",{
	    init: function(p) {
	      this._super(p, { 
	      	sheet: "zombieR",
	      	sprite: "zombie",
	      	points: [[-64,96],[-15,96],[-15,-32],[-64,-32]],
	      	jumpSpeed: 0,
	      	x: 40,
	      	y: 300,
	      	defaultMaskCollision: Q.SPRITE_DEFAULT | Q.SPRITE_DIRT | Q.SPRITE_BOX | Q.SPRITE_ENEMY | Q.SPRITE_ACTIVE,
	      	collisionMask: Q.SPRITE_DEFAULT | Q.SPRITE_DIRT | Q.SPRITE_BOX | Q.SPRITE_ENEMY | Q.SPRITE_ACTIVE
	      });

	      this.add('2d, platformerControls, tween, animation'); 

	      Q.input.on("fire", this, "launchHand");
	      this.on("box.hit", "boxCollision");
	      this.on("borrarControlesBajoTierra");
	      Q.state.on("change.vidas",this,"compruebaVida");

	      this.on("bump.right, bump.left, bump.top",function(collision) {
	            if(collision.obj.isA("Enemy")) {

            		 Q.state.dec("vidas",1);
            		 this.p.x = 40;
            		 this.p.y = 500;
	            }
	      });
	    },

	    compruebaVida: function() {

	    	if(Q.state.get("vidas") == 0) {
	    		this.del('platformerControls'); 
                this.del('2d');
                this.destroy();
               	Q.stageScene("UI", 2, { label: "You lose!", button: "Play again", bg: false, music: false});
	    	}
	    },

		launchHand: function() {

			if(Q.state.get("municion") > 0)
			{
				//Q.audio.play("shot.mp3");

				Q.state.dec("municion",1);

				if(this.p.direction == "right") {
					var obj = new Q.Miembros({ x:this.p.x+66, y:this.p.y});
					this.stage.insert(obj);
					obj.add("tween");
					obj.animate({ x:this.p.x+800, y:this.p.y-50, angle:360 }, 1.5);
				}
		        else if(this.p.direction == "left") {
					var obj = new Q.Miembros({ x:this.p.x-66, y:this.p.y});
					this.stage.insert(obj);
					obj.add("tween");
					obj.animate({ x:this.p.x-800, y:this.p.y-50, angle:360 }, 1.5);
		        }

				setTimeout(function() { obj.destroy(); }, 1300);
		    }
		},

		boxCollision: function(boxPosition) {
			
			if(Q.inputs['up'] && !this.p.climbing) {
				this.p.climbing = true;
				this.play("climb_" + this.p.direction);

				var that = this;
				setTimeout(function() { that.p.x = boxPosition[0] + 32; 
					                    that.p.y = boxPosition[1] - 128; 
					                    that.play("stand_" + that.p.direction); 
					                    that.p.climbing = false; }, 1250);

			}
			
		},

		borrarControlesBajoTierra: function() {

			this.del("controlesBajoTierra");

			this.animate( { x: this.p.x, y: this.p.y-(this.p.h-25), angle: 0}, 1/2, Q.Linear, {callback: function() {
				this.p.type = Q.SPRITE_DEFAULT;
				this.p.collisionMask = this.p.defaultMaskCollision;
				this.p.ignoreControls = false;
				this.p.bajoTierra = false;
				this.add("2d");
			}});
		},

	    step: function(dt) {
	        if(this.p.x <= 64) this.p.x = 64;
	        //if(this.p.y >= Q.height) { this.p.x = 32; this.p.y = 500; }

	        if ( Q.inputs['down'] && !this.p.bajoTierra ) {

	        	var bloque = Q.stage().locate(this.p.x, this.p.y + this.p.h - this.p.h/4);

	        	//Q.stage().insert(new Q.Box({ collisionMask: Q.SPRITE_NONE, type: Q.SPRITE_NONE, x: this.p.x, y: this.p.y + this.p.h - this.p.h/4 }));

	        	if ( bloque && bloque.p.type == Q.SPRITE_DIRT ) {

	        		this.p.bajoTierra = true;

	        		this.p.type = Q.SPRITE_NONE;
					this.p.collisionMask = Q.SPRITE_NONE;

	        		this.p.ignoreControls = true;
	        		this.del('2d');

	        		this.animate( { x: this.p.x, y: this.p.y+this.p.h-25, angle: 90 }, 1/2, Q.Linear, { callback: function() {
	        			this.add('controlesBajoTierra');
	        		} } );
	        	}
	        	else {
	        		console.log("no se encontró la caja");
	        	}
	        }

	        if(!this.p.climbing){
		        if(this.p.vx > 0) {
		        	this.play("stand_right");
		        }
		        else if(this.p.vx < 0) {
		        	this.play("stand_left");
		        }
		        else {
		        	this.play("stand_" + this.p.direction);
		        }
	    	}
	    }
	                   
	});

	/**************************************************
	* Enemigos
	***************************************************/

	Q.Sprite.extend("Enemy",{
		init: function(p) {
			this._super(p, {
				sheet: "enemy1",
				vx: 50,
				collisionMask: Q.SPRITE_DEFAULT | Q.SPRITE_ACTIVE | Q.SPRITE_DIRT | Q.SPRITE_PLAYER
			});

			this.add('2d, aiBounce');
			this.add('comportamientoEnemigo');
		}
	});

	/**************************************************
	* Miembros para lanzar
	***************************************************/
	Q.Sprite.extend("Miembros", {
	      init: function(p) {
	          this._super(p, {
	          	sheet: "miembros"
	          });
	          
	          this.add('2d, animation');
	          
	          this.on("bump.top, bump.left, bump.right",function(collision) {
	            if(collision.obj.isA("ZombiePlayer")) {

				  this.destroy();

	              Q.state.inc("municion",1);
	            }
	            else if(collision.obj.isA("Enemy")) {

	            	this.destroy();

	            	collision.obj.del('comportamientoEnemigo');
	            	collision.obj.del('2d');
	            	collision.obj.del('aiBounce');

	            	collision.obj.destroy();

	            	/*collision.obj.add("tween");
					collision.obj.animate({ x:collision.obj.p.x, y:collision.obj.p.y+20, angle:90 }, 0.5);

					setTimeout(function() { collision.obj.destroy(); }, 500);*/
	            }
	            else if(collision.obj.isA("Box")) {
	            	this.destroy();
	            }

	          });
	      }
	});

	/**************************************************
	* Objetos
	***************************************************/
	Q.MovingSprite.extend("Bullet", {
		init: function(p) {
			this._super(p, {
				sheet: "bullet",
				vx: 100,
				type: Q.SPRITE_NONE,
				collisionMask: Q.SPRITE_NONE
			});
		}
	});

	/**************************************************
	* Elementos de escenario con lógica
	***************************************************/
	Q.Sprite.extend("Box", {
		init: function(p) {
			this._super(p, {
				sheet: "box",
				gravity: 0,
				type: Q.SPRITE_BOX,
				collisionMask: Q.SPRITE_DEFAULT | Q.SPRITE_BOX | Q.SPRITE_ACTIVE
			});

			this.add('2d');

			this.on("bump.left", function(col) {
				if(col.obj.isA("ZombiePlayer")) {
					col.obj.trigger("box.hit", [this.p.x, this.p.y]);
				}
			});

			this.on("bump.right", function(col) {
				if(col.obj.isA("ZombiePlayer")) {
					col.obj.trigger("box.hit", [this.p.x, this.p.y]);
				}
			});
		}
	});

	Q.Sprite.extend("Dirt", {
		init: function(p) {
			this._super(p, {
				gravity: 0,
				sheet: "dirt1",
				type: Q.SPRITE_DIRT
			});
		}
	});
}
 
