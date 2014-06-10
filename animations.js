function crearAnimaciones(Q) {

	Q.animations('zombie', {
		climb: { frames: [0,1,2,3,4,5,6,7,8], rate: 1/4, loop: false },
	    climb_right: { frames: [0,1,2,3,4,5,6,7,8], rate: 1/4, loop: false },
	    climb_left: { frames: [12,13,14,15,16,17,18,19,20], rate: 1/4, loop: false},
	    stand: { frames: [0], rate: 1/5 },
	    stand_right: { frames: [0], rate: 1/5 },
	    stand_left: { frames: [12], rate: 1/5 }
	});

	Q.animations('port', {
		abrir: { frames: [0,1,2,3], rate: 1/2 }
	});

}

