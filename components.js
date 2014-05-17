function crearComponentes(Q) {
	Q.component("controlesBajoTierra", {
		added: function() {
			this.entity.p.ignoreControls = true;
			Q.input.on('up', this, 'emerger');
			this.entity.on("prestep", this, "pre");
		},

		emerger: function() {
			console.log("saliendo del suelo");
			this.entity.trigger("borrarControlesBajoTierra");
		},

		pre: function(dt) {
			if ( Q.inputs['left'] ) {
				this.entity.p.x -= this.entity.p.speed*dt;
			}
			else if ( Q.inputs['right'] ) {
				this.entity.p.x += this.entity.p.speed*dt;
			}
		}
	});

	Q.component("comportamientoEnemigo", {
		added: function() {
			this.entity.on("step", this.entity, "stepEnemy");

			this.entity.p.shootTime = 5;
			this.entity.p.time = 0;
		},

		extend: {
			stepEnemy: function(dt) {
				this.p.time += dt;

				if(this.p.time >= this.p.shootTime){
					this.p.time = 0;

					var zombie = Q("ZombiePlayer").first();

					if(zombie != null)
					{
						// Si el zombie está más cerca de 400 px y no está por encima o por debajo del enemigo entonces dispara.
						if( (Math.abs(zombie.p.x - this.p.x) < 400) && ((Math.abs(zombie.p.y - this.p.y) < this.p.h-2) && zombie.p.y < this.p.y) ) {
							console.log("Bang Bang!!");
							if(zombie.p.x < this.p.x) { // La bala va hacia la izquierda
								this.p.direction = "left";
								Q.stage(0).insert(new Q.Bullet({ x: this.p.x - 32 - 15, y: this.p.y-(this.p.h/4), vx: -100 }));
							}
							else { // La bala va hacia la derecha
								this.p.direction = "right";
								Q.stage(0).insert(new Q.Bullet({ x: this.p.x + 32, y: this.p.y, vx: +100 }));
							}
						}
					}
				}

				if(this.p.vx > 0) {
	        		this.p.flip = "x";
		        }
		        else if(this.p.vx < 0) {
		        	this.p.flip = "";
		        }
			}
		}
	});
}
