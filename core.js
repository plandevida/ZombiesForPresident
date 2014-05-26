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

	Q.debug = true;
	
	// Crea todos los componenetes del juego.
	crearComponentes(Q);

	// Crea las animaciones de las entidades.
	crearAnimaciones(Q);

	// Crea todos los elementos del juego.
	crearEntidades(Q);

	// Crea todas las escenas del juego.
	crearEscenas(Q);

	// Carga la escena inicial del juego
	Q.loadTMX("bg3.png, cont.png, zfp.png, level1.tmx, zombie.png, zombie.json, tiles.png, box.json, enemies.png, enemy1.json, bullet.png, bullet.json, miembros.png, miembros.json, dirt.json, main.ogg, main.mp3, shot.mp3, shot.ogg", function() { 
  
		  /*Q.stageScene("UI", 1, { label: "Iniciar el juego", button: "Empezar", bg: true, music: false});*/

		  Q.compileSheets("zombie.png", "zombie.json");
		  Q.compileSheets("tiles.png", "box.json");
		  Q.compileSheets("tiles.png", "dirt.json");
		  Q.compileSheets("enemies.png", "enemy1.json");
	      Q.compileSheets("bullet.png", "bullet.json");
	      Q.compileSheets("miembros.png", "miembros.json");
		  
		  Q.stageScene("MainMenu");
	});
};
