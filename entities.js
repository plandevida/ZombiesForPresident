function crearEntidades(Q) {


	Q.SPRITE_BOX = 128;
	Q.SPRITE_DIRT = 256;
	Q.SPRITE_BULLET = 512;

	var avisaDeFinal = false;

	/**************************************************
	* Zombie Principal
	***************************************************/
	Q.Sprite.extend("ZombiePlayer",{
	    init: function(p) {
	      this._super(p, { 
	      	sheet: "zombieR",
	      	sprite: "zombie",
	      	jumpSpeed: 0,
	      	x: 40,
	      	y: 300,
	      	defaultCollisionMask: Q.SPRITE_DEFAULT | Q.SPRITE_DIRT | Q.SPRITE_BOX | Q.SPRITE_ENEMY | Q.SPRITE_ACTIVE | Q.SPRITE_BULLET,
	      	defaultPoints: [[-20,-60],[-20,64],[20,64],[20,-60]]
	      });

	      this.p.points = this.p.defaultPoints;
	      this.p.collisionMask = this.p.defaultCollisionMask;

	      this.add('2d, platformerControls, tween, animation, zombieControls'); 

	      this.on("hit", "hit");

	      Q.input.on("fire", this, "launchHand");
	    },

	    launchHand: function() {
			if(Q.state.get("municion") > 0)
			{
				//Q.audio.play("shot.mp3");

				Q.state.dec("municion",1);

				if(this.p.direction == "right") {

					var obj = new Q.Miembros({ x: this.p.x + 70, y: this.p.y - 50, vx: 250, vy: -5 });
					obj.p.disparado = true;
					Q.stage(0).insert(obj);
					//obj.add("tween");
					//obj.animate({ x: this.p.x+800, y: this.p.y-50, angle:360 }, 1.5);
				}
		        else if(this.p.direction == "left") {

					var obj = new Q.Miembros({ x: this.p.x - 70, y: this.p.y - 50, vx: -250, vy: -5 });
					obj.p.disparado = true;
					Q.stage(0).insert(obj);
					//obj.add("tween");
					//obj.animate({ x: this.p.x-800, y: this.p.y-50, angle:360 }, 1.5);
		        }

		        setTimeout(function() { obj.destroy(); }, 2500);
		    }
		},

		hit: function(collision) {
			if(collision.obj.isA("Enemy") || collision.obj.isA("Bullet") || collision.obj.isA("Enemy2")) {

	    		Q.state.dec("vidas",1);
	    		this.destroy();

	    		if(avisaDeFinal) {
	    			var newZombiePlayer = new Q.ZombiePlayer({ x:240, y:450 });
	    			Q.stage(0).insert(newZombiePlayer);	
	    			Q.state.set("municion", 4);
	    		}
	    		else {
	    			var newZombiePlayer = new Q.ZombiePlayer({ x:40, y:500 });
	    			Q.stage(0).insert(newZombiePlayer);
	    			Q.stage(0).follow( newZombiePlayer, { x: true, y: false}, { minX: 0, minY: 0, maxX: 224*34, maxY: 480 } );
	        	}
	        }

	        if(collision.obj.isA("Puerta")) {
				collision.obj.play("abrir");
				setTimeout(function() { Q.stageScene("level2"); }, 1000);
			}

			if(collision.obj.isA("PuertaFinal")) {

				avisaDeFinal = true;
				collision.obj.play("abrir");
				setTimeout(function() { Q.stageScene("final"); }, 1000);
			}
		},

	    step: function(dt) {
	    	if(Q.state.get("vidas") == 0) {
	    		if(this.has('platformerControls') && this.has('2d')) {
	    			this.del('platformerControls'); 
                	this.del('2d');
                }
                this.destroy();
                avisaDeFinal = false;
               	Q.stageScene("UI", 1, { label: "You lose!", button: "Play again", bg: false, music: false});
	    	}

	        if(this.p.x <= 30) this.p.x = 30;

	        if(this.p.bajoTierra == 0 && !this.p.climbing) {
	        
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
	   		if (this.p.bajoTierra == 2) {
	   			if(this.p.vx > 0) {
	    			this.p.flip = "";
	    			this.play("walk_u");
	    		}
	    	    else if(this.p.vx < 0) {
	    	    	this.p.flip = "x";
	    	    	this.play("walk_u");
	    	    }
	    	    else {
	    	    	this.play("stand_u");
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
			this.add('comportamientoEnemigo');

			this.on("bump.bottom",function(collision) {
	            if(collision.obj.isA("ZombiePlayer") ) {

	            	this.del('comportamientoEnemigo');
	            	this.del('2d');
	            	this.del('aiBounce');

	            	this.destroy();            		 
	            }
	      	});
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

	Q.Sprite.extend("Flying_enemy", {
		init: function(p) {
			this._super(p, {
				sheet: "flying_enemy",
				sprite: "flying_enemy",
				vx: -30,
				shootingTime: 3,
				time: 0,
				changeDirectionTime: 5,
				time2: 0,
				gravity: 0,
				direction: "left"
			});

			this.add('2d, animation');
			this.play('walk');

		},

		step: function(dt) {

			this.p.time += dt;
			this.p.time2 += dt;

			if(this.p.time > this.p.shootingTime) {
				this.p.time = 0;
				newBullet = new Q.Bullet({ sheet: "bullet2", sprite: "bullet2", x: this.p.x, y: this.p.y + 40, vy: 120 });
				Q.stage(0).insert(newBullet);
			}

			if(this.p.time2 > this.p.changeDirectionTime) {
				this.p.time2 = 0; 
				this.p.vx = - this.p.vx;
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
	          	disparado: false,
	          	gravity: 0.05
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
				points: [[-7,-4],[-7,4],[7,4],[7,-4]],
				gravity: 0.01,
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
	* Puertas para pasar al siguiente nivel
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

	Q.Sprite.extend("PuertaFinal", {
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

	/**************************************************
	* Boss final
	***************************************************/

	Q.Sprite.extend("Boss",{
		init: function(p) {
			this._super(p, {
				sheet: "boss",
				vx: 200,
				collisionMask: Q.SPRITE_DEFAULT | Q.SPRITE_ACTIVE | Q.SPRITE_DIRT | Q.SPRITE_PLAYER
			});

			this.add('2d, aiBounce, animation');
			this.add("tween");
			this.on('hit');

			this.vidas = 3;
			this.contador = 0;
			this.limite = 2;
			this.contadorDisp = 0;
			this.entreDisp = 3;
		},

		step: function(dt) {

			if(this.contador >= this.limite) {
				this.contador = 0;				
				this.p.y -= 250;
			}

			if(this.contadorDisp >= this.entreDisp) {
				this.contadorDisp = 0;

				var zombie = Q("ZombiePlayer").first();

				if(zombie != null) {

					if(zombie.p.x < this.p.x) {
						newBullet = new Q.Bullet({ x: this.p.x - 32 - 15, y: this.p.y-(this.p.h/4), vx: -100 });
					}
					else {
						newBullet = new Q.Bullet({ x: this.p.x + 32, y: this.p.y-(this.p.h/4), vx: 100 });
					}

					Q.stage(0).insert(newBullet);
				}
			}

			this.contador += dt;
			this.contadorDisp += dt;

			if(this.p.vx > 0) {
	        		this.p.flip = "x";
		    }
		    else if(this.p.vx < 0) {
		        	this.p.flip = "";
		    }

		},

		hit: function(col) {

			if(col.obj.isA("Miembros")) {

				this.vidas--;

				if(this.vidas == 0) {

					this.destroy();

					var zombie = Q("ZombiePlayer").first();

					zombie.destroy();

					avisaDeFinal = false;

					Q.stageScene("UI", 1, { label: "-- YOU WIN --", button: "Play again", bg: false, music: false});
				}
			}
		} 
	});

}

 
