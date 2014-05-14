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
	Q.loadTMX("bg3.png, cont.png, zfp.png, level1.tmx, zombie_prov.png, zombie_prov.json, enemies.png, bullet.png, main.ogg, main.mp3, miembros.png, shot.mp3, shot.ogg", function() { 
  
		  /*Q.stageScene("UI", 1, { label: "Iniciar el juego", button: "Empezar", bg: true, music: false});*/


		  // TODO esto debería ir a un JSON en cuanto sea posible
		  Q.sheet("box",
		  	      "tiles.png",
		  	      {
		  	      	tilew: 64,
		  	      	tileh: 64,
		  	      	sx: 64,
		  	      	sy: 0
		  	      });

		  Q.sheet("enemy1",
		  	      "enemies.png",
		  	      {
		  	      	tilew: 64,
		  	      	tileh: 128,
		  	      	sx: 0,
		  	      	sy: 0
		  	      });
		  Q.sheet("bullet",
		  		   "bullet.png",
		  		   {
		  		   	tilew: 15,
		  		   	tileh: 10,
		  		   	sx: 0,
		  		   	sy: 0
		  		   });

		  Q.compileSheets("zombie_prov.png", "zombie_prov.json");

		  Q.sheet("miembros", "miembros.png", { tilew: 20, tileh: 21});
		  
		  Q.stageScene("MainMenu");
	});
};
