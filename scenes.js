function crearEscenas(Q) {

	Q.scene("level1-1", function(stage) {
		//Q.stageTMX("level1-1.tmx", stage);

		//var player = stage.insert(  ) );
		
		stage.add("viewport").follow( player, { x: true, y: false}, { minX: 0, minY: 0, maxX: 224*32, maxY: 480} );
		stage.viewport.offsetX = -Q.width/4;
		stage.centerOn(16, 360);

		stage.on("destroy", function() {
			player.destroy();
		});
	});

	Q.scene('UI',function(stage) {

		if ( stage.options.bg === true ) {
			stage.insert(new Q.Repeater( { asset: "bg3.png" } ));
		}

		var container = stage.insert(new Q.UI.Container({
			x: Q.width/2, y: Q.height/2, fill: "rgba(0,0,0,0.5)"
		}));

		var button = container.insert(new Q.UI.Button({ x: 0, y: 0, fill: "#CCCCCC", label: stage.options.button, keyActionName: "confirm" }));
		var label = container.insert(new Q.UI.Text({x:10, y: -10 - button.p.h, label: stage.options.label }));

		button.on("click",function() {
			Q.clearStages();
			Q.stageScene('level1-1');
			Q.stageScene('HUD', 1);
			if ( musicMainPlaying == false ) {
				Q.audio.stop();
				Q.audio.play('music_main.ogg', { loop: true });
			}
		});

		container.fit(20);

		var musicMainPlaying = false;
		//Q.audio.stop('music_main.ogg');
		if ( stage.options.music == true ) {
			musicMainPlaying = true;
			Q.audio.play('music_main.ogg', {loop: true});
		}
	});

	Q.scene("HUD", function(stage) {

		Q.state.set( { score: 0, lives: 3 } );

		Q.UI.Text.extend("Score", {
			init: function(p) {
				this._super(p, {
					label: 'score: 0',
					x: 70,
					y: 20
				});

				Q.state.on("change.score", this, "score");
			},

			score: function(score) {
				this.p.label = "score: " + score;
			}

		});

		stage.insert( new Q.Score() );
	});
}
