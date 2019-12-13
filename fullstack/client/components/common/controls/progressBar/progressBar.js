define(['whitecrow'], function(whitecrow) {
	class progressBar extends whitecrow.control {
		constructor(){
			super();
		}


	}

	return progressBar
		.properties({
			value:{
				type: whitecrow.modeling.types.int
			}
		})
		.define({
			name: "progress-bar",
			templateUrl: "components/common/controls/progressBar/progressBar.html"
		})

})