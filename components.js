function crearComponentes(Q) {
	
	Q.component("zombieControls", {
		added: function() {

			this.entity.p.diggingPoints = [[-20,-40],[-20,64],[20,64],[20,-40]];
			this.entity.p.undergroundRightPoints =  [[-20,88],[-20,128],[96,128],[96,88]];
	      	this.entity.p.undergroundLeftPoints =   [[-96,88],[-96,128],[20,128],[20,88]];
	      	this.entity.p.bajoTierra = 0;
	      	this.entity.p.undergroundCollisionMask = Q.SPRITE_DEFAULT | Q.SPRITE_BOX | Q.SPRITE_ENEMY | Q.SPRITE_ACTIVE | Q.SPRITE_BULLET;

	      	Q.input.on("down", this, "down");
	        Q.input.on("up",   this, "up");

	        this.entity.on("dig.done", this, "underground");
		},

		down: function() {
	    	/* 
	    	   Para poder meternos bajo tierra tenemos que comprobar que estamos sobre un bloque de tierra, y ademas
	    	   que hay suficiente hueco para poder meternos, para lo que necesitamos saber si el bloque que esta justo 
	    	   debajo (var bloque) y el que esta a dos bloques de distancia de este (var bloque2) son ambos bloques de 
	    	   tierra. También tenemos que tener en cuenta la dirección para hacer los cálculos correctamente
	    	*/
	    	if(!this.entity.p.bajoTierra) {

		    	if(this.entity.p.direction == "right") {

		    		var bloque = Q.stage().locate(this.entity.p.x, this.entity.p.y + 70);
		    		var bloque2 = Q.stage().locate(this.entity.p.x + 124, this.entity.p.y + 70); 
		    	}
		    	else {

		    		var bloque = Q.stage().locate(this.entity.p.x + 40, this.entity.p.y + 70);
		    		var bloque2 = Q.stage().locate(this.entity.p.x - 64, this.entity.p.y + 70);
		    	}                          

		    	if ((bloque && bloque.p.type == Q.SPRITE_DIRT) && (bloque2 && bloque2.p.type == Q.SPRITE_DIRT))  {
	 
					this.entity.p.bajoTierra = 1;

					this.entity.p.points = this.entity.p.diggingPoints;
					this.entity.play("dig");
	        	}
	        }
	    },

	    up: function() {

	    	if(this.entity.p.bajoTierra) {

	    		var bloque = Q.stage().locate(this.entity.p.x, this.entity.p.y - 10);
	    		if(!bloque || (bloque && bloque.p.type != Q.SPRITE_ENEMY)) {

	    			this.entity.play("up");
	    			this.entity.p.points = this.entity.p.defaultPoints;
	    			this.entity.p.collisionMask = this.entity.p.defaultCollisionMask;
	    			this.entity.p.bajoTierra = 0;
	    		}
	    	}
	    	else if (!this.entity.p.climbing) {

	    		if(this.entity.p.direction == "right") 
	    			var bloque = Q.stage().locate(this.entity.p.x + 64, this.entity.p.y + 10);
	    		else                                   
	    			var bloque = Q.stage().locate(this.entity.p.x - 64, this.entity.p.y + 10);

	    		if ( bloque && bloque.p.type == Q.SPRITE_BOX ) {
	    			this.climb([bloque.p.x, bloque.p.y]);
	    		}
	    	}
	    },

		climb: function(boxPosition) {
			
			if(Q.inputs['up'] && !this.entity.p.climbing) {

				this.entity.p.climbing = true;
				this.entity.play("climb");

				var that = this;
	
				setTimeout(function() { that.entity.p.x = boxPosition[0]; 
					                    that.entity.p.y = boxPosition[1] - 95; 
					                    that.entity.play("stand"); 
					                    that.entity.p.climbing = false; },
					       1000);
			}
			
		},

		underground: function() {

			this.entity.p.bajoTierra = 2;

			if(this.entity.p.direction == "right") 
				this.entity.p.points = this.entity.p.undergroundRightPoints;
			else                            
				this.entity.p.points = this.entity.p.undergroundLeftPoints;

			this.entity.p.collisionMask = this.entity.p.undergroundCollisionMask;
		}
	});

	Q.component("comportamientoEnemigo", {
		added: function() {
			this.entity.on("step", this.entity, "stepEnemy");
			this.entity.p.direction = "right";
			this.entity.p.shootTime = 5;
			this.entity.p.time = 0;
			this.entity.p.vxvalue = this.entity.p.vx;
		},

		extend: {
			stepEnemy: function(dt) {
				this.p.time += dt;

				var zombie = Q("ZombiePlayer").first();

				if(zombie && (!zombie.p.bajoTierra && zombie .p.y > this.p.y - this.p.h)) {
					if (this.p.direction == "left" && (zombie.p.x < this.p.x && (this.p.x - zombie.p.x) < 200)) {

						this.p.vx = 0;
						this.del('aiBounce');
						this.play("shot");

						if(this.p.time >= this.p.shootTime) {
								this.p.time = 0;
								newBullet = new Q.Bullet({ x: this.p.x - 60, y: this.p.y + 5, vx: -100 });
								Q.stage(0).insert(newBullet);
								setTimeout(function() { newBullet.destroy(); }, 4000);
						}
						
						this.p.time += dt;
					}
					else if (this.p.direction == "right"  && (zombie.p.x > this.p.x && (zombie.p.x - this.p.x) < 200)) {

						this.p.vx = 0;
						this.del('aiBounce');
						this.play("shot");

						if(this.p.time >= this.p.shootTime) {
								this.p.time = 0;
								newBullet = new Q.Bullet({ x: this.p.x + 60, y: this.p.y + 5, vx: 100 });
								Q.stage(0).insert(newBullet);
								setTimeout(function() { newBullet.destroy(); }, 4000);
						}
						
						this.p.time += dt;
					}
					else {
						if(!this.has('aiBounce')) {
							this.add('aiBounce');
							this.p.vx = this.p.vxvalue;
						}
						if(this.p.vx > 0) {
							this.p.direction = "right";
			    			this.p.flip = "";
			    			this.play("walk");
			    		}
			    	    else if(this.p.vx < 0) {
			    	    	this.p.direction = "left";
			    	    	this.p.flip = "x";
			    	    	this.play("walk");
			    	    }
			    	    else {
			    	    	this.play("stand");
			    	    }
					}
				}
				else {
					if(!this.has('aiBounce')) {
						this.add('aiBounce');
						this.p.vx = this.p.vxvalue;
					}
					if(this.p.vx > 0) {
						this.p.direction = "right";
		    			this.p.flip = "";
		    			this.play("walk");
		    		}
		    	    else if(this.p.vx < 0) {
		    	    	this.p.direction = "left";
		    	    	this.p.flip = "x";
		    	    	this.play("walk");
		    	    }
		    	    else {
		    	    	this.play("stand");
		    	    }
				}

				/*if(this.p.time >= this.p.shootTime){
					this.p.time = 0;

					var zombie = Q("ZombiePlayer").first();

					if(zombie != null)
					{
						// Si el zombie está más cerca de 400 px y no está por encima o por debajo del enemigo entonces dispara.
						if( (Math.abs(zombie.p.x - this.p.x) < 400) && ((Math.abs(zombie.p.y - this.p.y) < this.p.h-2) && zombie.p.y < this.p.y) ) {
							console.log("Bang Bang!!");
							if(zombie.p.x < this.p.x) { // La bala va hacia la izquierda
								this.p.direction = "left";

								newBullet = new Q.Bullet({ x: this.p.x - 32 - 15, y: this.p.y+32, vx: -100 });
								Q.stage(0).insert(newBullet);
								setTimeout(function() { newBullet.destroy(); }, 4000);
							}
							else { // La bala va hacia la derecha
								this.p.direction = "right";

								newBullet = new Q.Bullet({ x: this.p.x + 32, y: this.p.y+32, vx: +100 });
								Q.stage(0).insert(newBullet);
								setTimeout(function() { newBullet.destroy(); }, 4000);
							}
						}
					}
				}*/
			}
		}
	});
}
