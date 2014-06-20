function crearAnimaciones(Q) {

	Q.animations('zombie', {
		stand: { frames: [0], rate: 1/5 },
		walk:  { frames: [0,1], rate: 1/2 },
		climb: { frames: [10,11,12,13,14,15,16], rate: 1/3, loop: false }
	    
	});

	Q.animations('port', {
		abrir: { frames: [0,1,2,3], rate: 1/2 }
	});

	Q.animations('bullet', {
		explosion: { frames: [1,2,3,4,5,6,7,8,9,10,11,12], rate: 1/20, loop: false, trigger: "bullet.die" }
	});
}

