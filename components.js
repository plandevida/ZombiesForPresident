function crearComponentes(Q) {

	Q.UI.Text.extend("Municion",{ 
	      init: function(p) {
	        this._super({
	          label: "Municion: 0",
	          color: "white",
	          x: Q.width/2,
	          y: 50
	        });

	        Q.state.on("change.municion",this,"municion");
	      },

	      municion: function(municion) {
	        this.p.label = "Municion: " + municion;
	      }
	});

}
