window.addEventListener("load", function() {

	// Configura Quintus y el juego
	setupGame();
});

function setupGame() {
	var Q = Quintus({ audioSupported: [ 'ogg', 'mp3'], development: true })
                .include("Sprites, Scenes, Input, Anim, Touch, UI, TMX, 2D, Audio")
                .setup({ maximize:true })
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

	// Carga la escena inicial del juego
	Q.loadTMX("cont.png, zfp.png, levelOK.tmx, zomb.png, zombie.json, main.ogg, main.mp3, miembros.png, shot.mp3, shot.ogg", function() { 
  
		  /*Q.stageScene("UI", 1, { label: "Iniciar el juego", button: "Empezar", bg: true, music: false});*/

		  Q.compileSheets("zomb.png", "zombie.json");

		  Q.sheet("miembros", "miembros.png", { tilew: 20, tileh: 21});
		  
		  Q.stageScene("Intro");
	});
};

