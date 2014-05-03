window.addEventListener("load", function() {

	// Configura Quintus y el juego
	setupGame();
});

function setupGame() {
	var Q = Quintus( { development: true } ).include("Sprites, Scenes, Input, UI, Touch, TMX, Anim, 2D, Audio")
					.setup( { maximize: true, height: 480 } )
					.controls()
					.touch()
					.enableSound();

	//Q.debug = true;


	// Crea todos los componenetes del juego.
	// Definida en components.js
	crearComponentes(Q);

	// Crea las animaciones de las entidades.
	// Definida en animations.js
	crearAnimaciones(Q);

	// Crea todos los elementos del juego.
	// Definida en entities.js
	crearEntidades(Q);

	// Crea todas las escenas del juego.
	// Definida en scenes.js
	crearEscenas(Q);

	// Carga la escena inicial del
	Q.loadTMX( "bg.png, bg2.png, bg3.png", function(stage) {
		//Q.compileSheets("");

		Q.stageScene("UI", 1, { label: "Iniciar el juego", button: "Empezar", bg: true, music: false});
	});
};

