function crearAnimaciones(Q) {

	Q.animations('zombie', {
	    run_left: { frames: [2,3,4,5,6,7], next: 'stand_left', rate: 1/3},
	    run_right: { frames: [2,3,4,5,6,7], next: 'stand_right', rate: 1/3},
	    stand_left: { frames: [1]},
	    stand_right: { frames: [1]},
	});

}

