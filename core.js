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
	Q.loadTMX("plat.png, plataforma.json, puerta.png, puerta.json, boss.png, boss.json, cont.png, creditos.png, zfp.png, final.tmx, level2.tmx, level1.tmx, zombie.png, zombie.json, tiles.png, box.json, box2.json, enemies.png, enemies2.png, enemy1.json, enemy2.json, flying_enemy.png, flying_enemy.json, bullet.png, bullet.json, bullet2.png, bullet2.json, miembros.png, miembros.json, dirt.json, specialStone.json, main.ogg, main.mp3, shot.mp3, shot.ogg, boss.mp3, boss.ogg, zob.mp3, zob.ogg, risa.mp3, risa.ogg", function() { 
  
		  Q.compileSheets("zombie.png", "zombie.json");
		  Q.compileSheets("tiles.png", "box.json");
		  Q.compileSheets("tiles.png", "box2.json");
		  Q.compileSheets("tiles.png", "dirt.json");
		  Q.compileSheets("tiles.png", "specialStone.json");
		  Q.compileSheets("enemies.png", "enemy1.json");
		  Q.compileSheets("enemies2.png", "enemy2.json");
		  Q.compileSheets("flying_enemy.png", "flying_enemy.json");
		  Q.compileSheets("boss.png", "boss.json");
	      Q.compileSheets("bullet.png", "bullet.json");
	      Q.compileSheets("bullet2.png", "bullet2.json");
	      Q.compileSheets("miembros.png", "miembros.json");
	      Q.compileSheets("puerta.png", "puerta.json");
	      Q.compileSheets("plat.png", "plataforma.json");
		  
		  Q.stageScene("MainMenu");
	});
};
