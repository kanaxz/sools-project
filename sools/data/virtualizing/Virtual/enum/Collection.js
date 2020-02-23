const Virtualizing = require("../../../../virtualizing")
const Array = require("../../../../virtualizing/Virtual/enum/Array")
module.exports = Virtualizing.defineType({
	name:'collection',
	extends:Array,
	handler:class Collection extends Array.handler {
		cloneConstructor(){
			return Array;
		}

		static callAsProperty(scope, property){
			return {
				type:new property.model.virtual()
			};
		}


	},
	methods:{
		indexOf:false,
		forEach:false,
		remove:{

		},
		update:{

		}
	}
})