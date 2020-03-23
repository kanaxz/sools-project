const Worker = require("../../../virtualizing/Worker")
const Virtuals = require("../Virtual/enum")
const Sources = require("../../../virtualizing/Source/enum")
const flag = "test";Symbol('autoLoadFlag');

function related(child,parent){

}

module.exports = class AutoLoad extends Worker{
	constructor(){
		super();
		this.hasManyHold = [];
	}
	onPropertyGet(property,owner, virtual){

		if(owner instanceof Virtuals.model){
			if(virtual instanceof Virtuals.hasMany){
				if(!virtual._handler.ref.isLoaded){
					debugger
					virtual._handler.scope[flag] = virtual
				}
			}
			/**/
			if(false && owner._handler.source instanceof Sources.functionArg){
				
			}
			 if(virtual._handler.source instanceof Sources.property 
				&& (virtual._handler.source.path == "id" 
					|| !(virtual._handler.source.source instanceof Virtuals.model))){

			}
			else if(!owner._handler.ref.isLoaded){
				owner.load();
			}
		}		
	}

	onFunctionCalled(scope, functionCall){
		debugger
		if(scope[flag]){
			if(functionCall.function.source != Virtuals.hasMany.methods.load || functionCall.args[0] != scope[flag]){
				scope[flag].load();
			}
		}
	}

	onCallingFunction(scope,fn, args){
		if(args[0] instanceof Virtuals.hasMany && fn.name != "load" && !args[0]._handler.ref.isLoaded){
			args[0].load();
		}
	}
}