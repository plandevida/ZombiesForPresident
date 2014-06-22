function crearEntidades(Q) {


	Q.SPRITE_BOX = 128;
	Q.SPRITE_DIRT = 256;
	Q.SPRITE_BULLET = 512;

	/**************************************************
	* Zombie Principal
	***************************************************/
	Q.Sprite.extend("ZombiePlayer",{
	    init: function(p) {
	      this._super(p, { 
	      	sheet: "zombieR",
	      	sprite: "zombie",
	      	defaultPoints: [[-20,-60],[-20,64],[20,64],[20,-60]],
	      	diggingPoints: [[-20,-40],[-20,64],[20,64],[20,-40]],
	      	undergroundRightPoints:  [[-20,88],[-20,128],[96,128],[96,88]],
	      	undergroundLeftPoints:   [[-96,88],[-96,128],[20,128],[20,64]],
	      	jumpSpeed: 0,
	      	x: 40,
	      	y: 300,
	      	defaultCollisionMask:     Q.SPRITE_DEFAULT | Q.SPRITE_DIRT | Q.SPRITE_BOX | Q.SPRITE_ENEMY | Q.SPRITE_ACTIVE | Q.SPRITE_BULLET,
	      	undergroundCollisionMask: Q.SPRITE_DEFAULT | Q.SPRITE_BOX | Q.SPRITE_ENEMY | Q.SPRITE_ACTIVE | Q.SPRITE_BULLET
	      });

	      this.p.points = this.p.defaultPoints;
	      this.p.collisionMask = this.p.defaultCollisionMask;

	      this.add('2d, platformerControls, tween, animation'); 

	      Q.input.on("fire", this, "launchHand");
	      Q.input.on("down", this, "down");
	      Q.input.on("up", this, "up");

	      this.on("bump.left, bump.right, bump.bottom", "hit");
	      this.on("dig.done","underground");
	    },

	    down: function() {
	    	console.log("has pulsado abajo");

	    	if(this.p.direction == "right") var bloque = Q.stage().locate(this.p.x, this.p.y + 70);
	    	else                            var bloque = Q.stage().locate(this.p.x + 40, this.p.y + 70);

	    	if (bloque && bloque.p.type == Q.SPRITE_DIRT) {
 
				this.p.bajoTierra = true;

				this.p.points = this.p.diggingPoints;
				this.play("dig");
        	}
	    },

	    up: function() {
	    	console.log("has pulsado arriba");
	    	if(this.p.bajoTierra) {

	    		var bloque = Q.stage().locate(this.p.x, this.p.y - 10);
	    		if(!bloque || (bloque && bloque.p.type != Q.SPRITE_ENEMY)) {

	    			this.play("stand");
	    			this.p.points = this.p.defaultPoints;
	    			this.p.collisionMask = this.p.defaultCollisionMask;
	    			this.p.bajoTierra = false;
	    		}
	    	}
	    	else if (!this.p.climbing) {

	    		if(this.p.direction == "right") var bloque = Q.stage().locate(this.p.x + 64, this.p.y + 10);
	    		else                            var bloque = Q.stage().locate(this.p.x - 64, this.p.y + 10);

	    		if ( bloque && bloque.p.type == Q.SPRITE_BOX ) {
	    			this.climb([bloque.p.x, bloque.p.y]);
	    		}
	    	}
	    },

		launchHand: function() {

			if(Q.state.get("municion") > 0)
			{
				//Q.audio.play("shot.mp3");

				Q.state.dec("municion",1);

				if(this.p.direction == "right") {
					var obj = new Q.Miembros({ x:this.p.x+66, y:this.p.y});
					obj.p.disparado = true;
					this.stage.insert(obj);
					obj.add("tween");
					obj.animate({ x:this.p.x+800, y:this.p.y-50, angle:360 }, 1.5);
				}
		        else if(this.p.direction == "left") {
					var obj = new Q.Miembros({ x:this.p.x-66, y:this.p.y});
					obj.p.disparado = true;
					this.stage.insert(obj);
					obj.add("tween");
					obj.animate({ x:this.p.x-800, y:this.p.y-50, angle:360 }, 1.5);
		        }

				setTimeout(function() { obj.destroy(); }, 1300);
		    }
		},

		climb: function(boxPosition) {
			
			if(Q.inputs['up'] && !this.p.climbing) {

				this.p.climbing = true;
				this.play("climb");

				var that = this;
	
				setTimeout(function() { that.p.x = boxPosition[0]; 
					                    that.p.y = boxPosition[1] - 95; 
					                    that.play("stand"); 
					                    that.p.climbing = false; },
					       1000);
			}
			
		},

		hit: function(collision) {
			if(collision.obj.isA("Enemy") || collision.obj.isA("Bullet") || collision.obj.isA("Enemy2")) {

	    		Q.state.dec("vidas",1);
	    		this.destroy();
	    		var newZombiePlayer = new Q.ZombiePlayer({ x:40, y:450 });
	    		Q.stage(0).insert(newZombiePlayer);
	    		Q.stage(0).follow( newZombiePlayer, { x: true, y: false}, { minX: 0, minY: 0, maxX: 224*34, maxY: 480 } );
	        }

	        if(collision.obj.isA("Puerta")) {
				collision.obj.play("abrir");
				setTimeout(function() { Q.stageScene("level2"); }, 1000);
			}
		},

		borrarControlesBajoTierra: function() {

			console.log("saliendo del suelo");
			this.del("controlesBajoTierra");

			this.animate( { x: this.p.x, y: this.p.y-(this.p.h)+64, angle: 0}, 1/2, Q.Linear, {callback: function() {
				this.p.type = Q.SPRITE_DEFAULT;
				this.p.collisionMask = this.p.defaultCollisionMask;
				this.p.ignoreControls = false;
				this.p.bajoTierra = false;
				//this.add("2d");
			}});
		},

		underground: function() {
			if(this.p.direction == "right") this.p.points = this.p.undergroundRightPoints;
			else                            this.p.points = this.p.undergroundLeftPoints;
			this.p.collisionMask = this.p.undergroundCollisionMask;
			//this.play(...)
		},

	    step: function(dt) {
	    	if(Q.state.get("vidas") == 0) {
	    		if(this.has('platformerControls') && this.has('2d')) {
	    			this.del('platformerControls'); 
                	this.del('2d');
                }
                this.destroy();
               	Q.stageScene("UI", 1, { label: "You lose!", button: "Play again", bg: false, music: false});
	    	}

	        if(this.p.x <= 25) this.p.x = 25;

	        if(!this.p.bajoTierra && !this.p.climbing) {
	        
	    		if(this.p.vx > 0) {
	    			this.p.flip = "";
	    			this.play("walk");
	    		}
	    	    else if(this.p.vx < 0) {
	    	    	this.p.flip = "x";
	    	    	this.play("walk");
	    	    }
	    	    else {
	    	    	this.play("stand");
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
				sprite: "enemy1",
				vx: 50,
				points: [[-20,-60],[-20,64],[20,64],[20,-60]],
				collisionMask: Q.SPRITE_DEFAULT | Q.SPRITE_ACTIVE | Q.SPRITE_DIRT | Q.SPRITE_PLAYER
			});

			this.add('2d, aiBounce, animation');
			//this.add('comportamientoEnemigo');

			this.on("bump.bottom",function(collision) {
	            if(collision.obj.isA("ZombiePlayer") ) {

	            	this.del('comportamientoEnemigo');
	            	this.del('2d');
	            	this.del('aiBounce');

	            	this.destroy();            		 
	            }
	      	});
		},

		step: function(dt) {
			if(this.p.vx > 0) {
    			this.p.flip = "";
    			this.play("walk");
    		}
    	    else if(this.p.vx < 0) {
    	    	this.p.flip = "x";
    	    	this.play("walk");
    	    }
    	    else {
    	    	this.play("stand");
    	    }
		}
	});

	Q.Sprite.extend("Enemy2",{
		init: function(p) {
			this._super(p, {
				sheet: "enemy2",
				sprite: "enemy2",
				points: [[-20,-60],[-20,64],[20,64],[20,-60]],
				vx: 50,
				collisionMask: Q.SPRITE_DEFAULT | Q.SPRITE_ACTIVE | Q.SPRITE_DIRT | Q.SPRITE_PLAYER
			});

			this.add('2d, aiBounce, animation');

			this.contador = 0;
			this.limite = 3;
		},

		step: function(dt) {

			if(this.contador >= this.limite) {
				this.contador = 0;
				newBullet = new Q.Bullet({ x: this.p.x, y: this.p.y-(this.p.h-60), vy: -200, angle: 90 });
				Q.stage(0).insert(newBullet);
			}

			this.contador += dt;

			if(this.p.vx > 0) {
    			this.p.flip = "";
    			this.play("walk");
    		}
    	    else if(this.p.vx < 0) {
    	    	this.p.flip = "x";
    	    	this.play("walk");
    	    }
    	    else {
    	    	this.play("stand");
    	    }

		} 
	});

	/**************************************************
	* Miembros para lanzar
	***************************************************/
	Q.Sprite.extend("Miembros", {
	      init: function(p) {
	          this._super(p, {
	          	sheet: "miembros",
				type: Q.SPRITE_BULLET,
	          	collisionMask: Q.SPRITE_DEFAULT | Q.SPRITE_BOX,
	          	disparado: false
	          });
	          
	          this.add('2d, animation');
	          
	          this.on("hit", function(collision) {
	          
	          if ( this.p.disparado ) {

	          	if(collision.obj.isA("Enemy")) {

	            	collision.obj.del('comportamientoEnemigo');
	            	collision.obj.del('2d');
	            	collision.obj.del('aiBounce');

	            	collision.obj.destroy();
	            }
	            else if(collision.obj.isA("Enemy2")) {

	            	collision.obj.del('2d');
	            	collision.obj.del('aiBounce');

	            	collision.obj.destroy();
	            }

	          	this.destroy();

	          } else {
	          	if ( collision.obj.isA("ZombiePlayer")) {

	            	this.destroy();
	            	Q.state.inc("municion",1);
	          }
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
				sprite: "bullet",
				type: Q.SPRITE_BULLET,
				collisionMask: Q.SPRITE_DEFAULT | Q.SPRITE_BOX,
				points: [[-7,-4],[-7,4],[7,4],[7,-4]]
			});

			this.add('animation');
			this.on('hit');
			this.on('bullet.die','die');
		},

		hit: function(col) {

			this.p.vy = 0;
			this.p.vx = 0;

			if(!col.obj.isA("Box")) {
				this.play('explosion');
			}
			else {
				this.destroy();
			}
		},

		die: function() {
			this.destroy();
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
				collisionMask: Q.SPRITE_DEFAULT | Q.SPRITE_BOX | Q.SPRITE_ACTIVE | Q.SPRITE_BULLET
			});

			this.add('2d');
			/*
			this.on("bump.left,bum.right", function(col) {
				if(col.obj.isA("ZombiePlayer")) {
					col.obj.trigger("box.hit", [this.p.x, this.p.y]);
				}
			});*/

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

	/**************************************************
	* Puerta para pasar al siguiente nivel
	***************************************************/

	Q.Sprite.extend("Puerta", {
		init: function(p) {
			this._super(p, {
				sheet: "puerta",
				sprite: "port"
			});

			this.add('animation');
		}
	});

	/**************************************************
	* Plataformas moviles
	***************************************************/

	Q.Sprite.extend("Plataforma", {
		init: function(p) {
			this._super(p, {
				sheet: "plataforma",
				gravity: 0,
				vx: 60
			});

			this.add('2d, aiBounce');
		}
	});

}

 
