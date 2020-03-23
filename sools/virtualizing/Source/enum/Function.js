const FunctionCall = require("./FunctionCall")
const Statement =  require("../../Statement")
const BaseFunction = require("./BaseFunction")
const HandlerOptions = require("../../Handler/Options")

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

	innerCall(scope, args){
		args = args.map((arg)=>arg && arg.virtual || arg);
		scope = scope.target
		scope.env.workers.forEach((worker)=>worker.onCallingFunction(scope,this, args))
		var result = []
		this.args.forEach((argDescription,index)=>{	
			var arg = args[index];
			if(arg == null){
				if(argDescription.required){
					throw new Error();
				}
				else
					return;
			}
			else{
				if(!(arg instanceof argDescription.type)){
					debugger
					arg = argDescription.type.handler.buildArg(scope, result, arg, argDescription);
				}
				result.push(scope.processArg(arg))
			}
		})
		var functionCall = new FunctionCall({
			scope,
			function:new Function.virtual(new HandlerOptions({
				scope,
				source:this,
			}))._handler,
			args:result
		})

		scope.statements.push(new Statement(functionCall))
		scope.env.workers.forEach((worker)=>worker.onFunctionCalled(scope,functionCall))
		if(this.return){
			var result = this.return(functionCall);
			return result;
		}
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

	buildWrapper(){
		return (...args)=>{
			var scope = findScope(args);
			if(!scope)
				throw new Error("Scope not found");
			return this.call(scope,args);
		}
	}
}