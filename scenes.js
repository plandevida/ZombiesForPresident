function crearEscenas(Q) {
	Q.scene("MainMenu", function(stage) { 
	          
	    stage.insert(new Q.Repeater({ asset: "zfp.png", w:1600, h:1000 }));

	    var containerJugar = stage.insert(new Q.UI.Container({
	            x: 240, y: 510
	    }));

	    var btJugar = containerJugar.insert(new Q.UI.Button({ x: 0, y: 40, fill: "#FF0000", label: "Play" })); 

	    var container1 = stage.insert(new Q.UI.Container({
	            x: 460 , y: 510
	    }));
	 
	    var btControles = container1.insert(new Q.UI.Button({ x: 0, y: 40, fill: "#FF0000", label: "Controls" })); 

	    var containerCreditos = stage.insert(new Q.UI.Container({
	            x: 580 , y: 510
	    }));
	 
	    var btCreditos = containerCreditos.insert(new Q.UI.Button({ x: 0, y: 40, fill: "#FF0000", label: "Creditos" }));        

	    btJugar.on("click",function() {
	        Q.clearStages();
	        Q.stageScene('level1');
	        //Q.stageScene('level2');
	        //Q.stageScene('final');
	    });

	    btControles.on("click",function() {
	        Q.clearStages();
	        Q.stageScene('ContOrCred', { label: "esCont" });
	    });

	    btCreditos.on("click",function() {
	        Q.clearStages();
	        Q.stageScene('ContOrCred', { label: "esCred" });
	    });
	});

	Q.scene("ContOrCred",function(stage) { 

	    if(stage.options.label == "esCont") {    
	    	stage.insert(new Q.Repeater({ asset: "cont.png",  w:1600, h:1000 }));
	    }
	    else if(stage.options.label == "esCred") {  
	    	stage.insert(new Q.Repeater({ asset: "creditos.png",  w:1600, h:1000 }));
	    }

	    var container = stage.insert(new Q.UI.Container({
	            x: 380, y: 450
	    }));
	 
	    var button = container.insert(new Q.UI.Button({ x: 0, y: 40, fill: "#FF0000", label: "<= Back" })); 

	     button.on("click",function() {
	        Q.clearStages();
	        Q.stageScene('MainMenu');
	    });
	});

	Q.scene('UI',function(stage) {

		if ( stage.options.winOrLose == "win" ) {
			Q.audio.stop();
	    	Q.audio.play("zob.mp3");
		}
		else if ( stage.options.winOrLose == "lose" ) {
			Q.audio.stop();
	    	Q.audio.play("risa.mp3");
		}

		if ( stage.options.bg === true ) {
			stage.insert(new Q.Repeater( { asset: "zfp.png" } ));
		}

		var container = stage.insert(new Q.UI.Container({
			x: Q.width/2, y: Q.height/2, fill: "rgba(0,0,0,0.5)"
		}));

		var button = container.insert(new Q.UI.Button({ x: 0, y: 0, fill: "#CCCCCC", label: stage.options.button, keyActionName: "confirm" }));
		var label = container.insert(new Q.UI.Text({x:0, y: -10 - button.p.h, label: stage.options.label, color:"white" }));

		button.on("click",function() {
			Q.clearStages();
			Q.stageScene('MainMenu');
			//Q.stageScene('HUD', 1);
			/*if ( musicMainPlaying == false ) {
				Q.audio.stop();
				Q.audio.play('music_main.ogg', { loop: true });
			}*/
		});

		container.fit(20);

		var musicMainPlaying = false;
		//Q.audio.stop('music_main.ogg');
		if ( stage.options.music == true ) {
			musicMainPlaying = true;
			Q.audio.play('main.ogg', {loop: true});
		}
	});

	Q.scene("HUD",function(stage) {

		Q.UI.Text.extend("Municion",{ 
	      init: function(p) {
	        this._super({
	          label: "Municion: 0",
	          color: "white",
	          x: Q.width/2,
	          y: 50
	        });

	        Q.state.on("change.municion",this,"municion");
	      },

	      municion: function(municion) {
	        this.p.label = "Municion: " + municion;
	      }
		});

		Q.UI.Text.extend("Vidas",{ 
	      init: function(p) {
	        this._super({
	          label: "Vidas: 3",
	          color: "white",
	          x: Q.width/2,
	          y: 50
	        });

	        Q.state.on("change.vidas",this,"vidas");
	      },

	      vidas: function(vidas) {
	        this.p.label = "Vidas: " + vidas;
	      }
		});

	    var container = stage.insert(new Q.UI.Container({
	        x: -100, y: 0, fill: "rgba(0,0,0,0.5)"
	    }));

	    var containerVidas = stage.insert(new Q.UI.Container({
	        x: 100, y: 0, fill: "rgba(0,0,0,0.5)"
	    }));

	    container.insert(new Q.Municion());
	    containerVidas.insert(new Q.Vidas());

	    container.fit(20);
	    containerVidas.fit(20);
	   
	});

	Q.scene("level1",function(stage) {          

	    Q.audio.stop();
	    Q.audio.play("main.mp3", { loop:true });

	    Q.stageTMX('level1.tmx', stage);

	    Q.state.reset({ municion: 0, vidas:3 });

		var player = stage.insert(new Q.ZombiePlayer());

	    stage.add("viewport").follow( player, { x: true, y: false}, { minX: 0, minY: 0, maxX: 224*34, maxY: 480 } );
	    stage.centerOn(500, 350); 
	    stage.viewport.offsetX = 0;
	    stage.viewport.offsetY = 0;

	    stage.on("destroy", function() {
			player.destroy();
		});

	    Q.stageScene("HUD", 2);
	});

	Q.scene("level2",function(stage) {          

	    Q.audio.stop();
	    Q.audio.play("main.mp3", { loop:true });

	    Q.stageTMX('level2.tmx', stage);

		var player = stage.insert(new Q.ZombiePlayer({ x:128, y: 0 }));

	    stage.add("viewport").follow( player, { x: true, y: false}, { minX: 0, minY: 0, maxX: 224*34, maxY: 480 } );
	    stage.centerOn(500, 350); 
	    stage.viewport.offsetX = 0;
	    stage.viewport.offsetY = 0;

	    stage.on("destroy", function() {
			player.destroy();
		});

	    Q.stageScene("HUD", 2);
	});

	Q.scene("final",function(stage) {          

	    Q.audio.stop();
	    Q.audio.play("boss.mp3", { loop:true });
	    
	    Q.stageTMX('final.tmx', stage);

	    Q.state.set("municion", 4);
	    Q.state.set("vidas", 3);

		var player = stage.insert(new Q.ZombiePlayer({ x:240, y:450 }));
		var boss = stage.insert(new Q.Boss({ x: 1000, y: 450 }));
	
		stage.add("viewport");

	    stage.on("destroy", function() {
			player.destroy();
			boss.destroy();
		});
	});
}
