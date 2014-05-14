function crearEntidades(Q) {


	Q.SPRITE_BOX = 128;

	/**************************************************
	* Zombie Principal
	***************************************************/
	Q.Sprite.extend("ZombiePlayer",{
	    init: function(p) {
	      this._super(p, { 
	      	sheet: "zombieR",
	      	x: 40,
	      	y: 500,
	      	collisionMask: Q.SPRITE_DEFAULT | Q.SPRITE_BOX | Q.SPRITE_ENEMY | Q.SPRITE_ACTIVE
	      });

	      this.add('2d, platformerControls, tween'); 

	      //Q.input.on("fire", this, "launchHand");
	      this.on("box.hit", "boxCollision");
	      this.on("borrarControlesBajoTierra");
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
			
			if(Q.inputs['up'] && !this.p.climbing) {
				this.p.climbing = true;
				var that = this;
				var newY = this.p.y - 66;
				var newX;

				if(forwards) newX = this.p.x + 64;
				else         newX = this.p.x - 64;
				
		
				this.p.ignoreControls = true;
				this.animate({ y: newY }, 1, Q.Easing.Linear);
				this.animate({ x: newX , y: newY }, 0.5, Q.Easing.Linear, { delay: 1, callback: function() {
					that.p.climbing = false;
					this.p.ignoreControls = false;
				}});
			}
			
		},

		borrarControlesBajoTierra: function() {

			this.del("controlesBajoTierra");

			this.animate( { x: this.p.x, y: this.p.y-(64+32), angle: 0}, 1/2, Q.Linear, {callback: function() {
				this.p.type = Q.SPRITE_DEFAULT;
				this.p.collisionMask = Q.SPRITE_DEFAULT | Q.SPRITE_BOX | Q.SPRITE_ENEMY | Q.SPRITE_ACTIVE;
				this.p.ignoreControls = false;
				this.add("2d");
			}});
		},

	    step: function(dt) {
	        if(this.p.x <= 32) this.p.x = 32;
	        if(this.p.y >= Q.height) { this.p.x = 32; this.p.y = 500; }

	        if ( Q.inputs['down'] && !this.p.bajoTierra ) {

	        	if ( Q.stage().locate(this.p.x, this.p.y + 32) ) {

	        		this.p.bajoTierra = true;

	        		this.p.type = Q.SPRITE_NONE;
					this.p.collisionMask = Q.SPRITE_NONE;

	        		this.p.ignoreControls = true;
	        		this.del('2d');

	        		this.animate( { x: this.p.x, y: this.p.y+64+32, angle: 90 }, 1/2, Q.Linear, { callback: function() {
	        			this.add('controlesBajoTierra');
	        		} } );
	        	}
	        	else {
	        		console.log("no se encontró la caja");
	        	}
	        }
	    }
	                   
	});

	Q.Sprite.extend("Enemy",{
		init: function(p) {
			this._super(p, {
				sheet: "enemy1"
			});

			this.add('2d');
			this.add('comportamientoEnemigo');
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
				type: Q.SPRITE_BOX,
				collisionMask: Q.SPRITE_DEFAULT | Q.SPRITE_BOX | Q.SPRITE_ACTIVE
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
 
