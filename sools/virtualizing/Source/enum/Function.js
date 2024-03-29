
const BaseFunction = require("./BaseFunction")
const Value = require("./Value")
 
function findScope(args){
	for(var arg of args){
		if(arg._handler  && arg._handler.scope)
			return arg._handler.scope;
	}
	return null;
}

module.exports = class Function extends BaseFunction {

	static processArgs(args){
		return args.map((arg)=>{
			if(typeof(arg) != "object")
				return {type:arg}
			return arg;
		})
	}


	constructor(values){
		super();
		for(var p in values){
			this[p] = values[p];
		}


		if(this.args){
			this.args = Function.processArgs(this.args);
		}
	}

	toJSON(){
		return this.name;
	}



	innerCall(scope,args){
		return super.call(scope,args);
	}

	call(scope, args){
		if(this.jsCall){
			return this.jsCall(args, (...args)=>{
				return this.innerCall(scope, args)
			})
		}
		else
			return this.innerCall(scope, args);
	}


}