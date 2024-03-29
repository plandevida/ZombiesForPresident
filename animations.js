function crearAnimaciones(Q) {

	Q.animations('zombie', {
		stand: { frames: [0], rate: 1/15 },
		walk:  { frames: [1,0], rate: 1/2 },
		climb: { frames: [10,11,12,13,14,15,16], rate: 1/4, loop: false, trigger: "climb.done" },
		dig:   { frames: [20,21,22,23], rate: 1/5, loop: false, trigger: "dig.done" },
		stand_u: { frames: [25], rate: 1/5 },
		walk_u:  { frames: [24,25], rate: 1/2 },
		up: { frames: [20], rate: 1/5 },
		dead: { frames: [2,3,4], rate: 1/2, loop: false, trigger: "zombie.die" },
		win: { frames: [5,6], rate: 1/2 }
	    
	});

	Q.animations('enemy1', {
		stand: { frames: [0], rate: 1/5 },
		walk:  { frames: [1,2,3,4,5,6], rate: 1/2 },
		shot:  { frames: [7], rate: 1/2 },
		dead:  { frames: [10,11,12], rate: 1/2, loop: false, trigger: "enemy1.die" }
	});

	Q.animations('flying_enemy', {
		walk: { frames: [1,0], rate: 1/2 }
	});

	Q.animations('boss', {
		win: { frames: [4,5], rate: 1/2 },
		dead: { frames: [1,2,3], rate: 1/2, loop: false, trigger: "boss.die" }
	});

	Q.animations('port', {
		abrir: { frames: [0,1,2,3], rate: 1/2 }
	});

	Q.animations('bullet', {
		explosion: { frames: [1,2,3,4,5,6,7,8,9,10,11,12], rate: 1/20, loop: false, trigger: "bullet.die" }
	});

	Q.animations('bullet2', {
		explosion: { frames: [1,2,3,4,5,6,7,8,9,10,11,12], rate: 1/20, loop: false, trigger: "bullet.die" }
	});
}

