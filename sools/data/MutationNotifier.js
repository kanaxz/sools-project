const Handler = require("../../executing/Handler");
const Dynamic = require("../../processing/Dynamic")

module.export = class MutationNotifier extends Handler {
	constructor(){
		super();
		this.process = new Dynamic((scope,next)=>{
			
		})
	}

	async processFunctionCall(scope, functionCall, next){
 
	}
}