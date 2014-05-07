window.addEventListener("load", function() {

	// Configura Quintus y el juego
	setupGame();
});

function setupGame() {
	var Q = Quintus( { development: true } ).include("Sprites, Scenes, Input, UI, Touch, TMX, Anim, 2D, Audio")
					.setup( { maximize: true } )
					.controls()
					.touch()
					.enableSound();

	//Q.debug = true;


	// Crea todos los componenetes del juego.
	crearComponentes(Q);

	// Crea las animaciones de las entidades.
	crearAnimaciones(Q);

	// Crea todos los elementos del juego.
	crearEntidades(Q);

	// Crea todas las escenas del juego.
	crearEscenas(Q);

	// Carga la escena inicial del
	Q.loadTMX( "bg.png, bg2.png, bg3.png, zfp.png", function(stage) {
		//Q.compileSheets("");

		Q.stageScene("Main_Menu");
	});
};
