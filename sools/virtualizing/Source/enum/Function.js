
const BaseFunction = require("./BaseFunction")
const HandlerOptions = require("../../Handler/Options")
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

	buildArgs(scope,args){

		var result = []
		var argDescriptions = this.getArgs(args);
		if(!argDescriptions)
			return result
		argDescriptions.forEach((argDescription,index)=>{	
			var t = this;
			var arg = args[index];
			if(arg == null){
				if(argDescription.required){
					throw new Error();
				}
				else
					return null
			}
			if(!(arg instanceof argDescription.type)){
					arg = argDescription.type.handler.buildArg(scope, result, arg, argDescription);
			}
			result.push(arg._handler)
			
		})
		return result;
	}

	getArgs(){
		return this.args;
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