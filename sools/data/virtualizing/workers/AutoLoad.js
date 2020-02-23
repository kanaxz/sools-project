const Worker = require("../../../virtualizing/Worker")
const Virtuals = require("../Virtual/enum")

module.exports = class AutoLoad extends Worker{
	onPropertyGet(property,owner, virtual){

		if(virtual instanceof Virtuals.model){
			if(!(owner instanceof Virtuals.model)){
				return
			}
			if(!virtual._handler.ref.loaded){
				virtual.load()
			}
		}
		else if(virtual instanceof Virtuals.hasMany){
			if(!virtual._handler.ref.loaded)
				virtual.load();
		}
	}
}