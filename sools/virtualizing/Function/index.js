const Meta = require("../../meta")
const Sources = require("../Source/enum")
const Statment =  require("../Statment")

function findScope(args){
	for(var arg of args){
		if(arg._handler  && arg._handler.scope)
			return arg._handler.scope;
	}
	return null;
}

module.exports = class Function {

	static processArgs(args){
		return args.map((arg)=>{
			if(typeof(arg) != "object")
				return {type:arg}
			return arg;
		})
	}


	constructor(values){
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

	getArgs(){
		return this.args;
	}

	call(scope, args){
		scope = scope.target
		scope.env.workers.forEach((worker)=>worker.onCallingFunction(scope,this, args))
		var result = []
		var statment = new Statment({
			function:this,
		})
		this.getArgs(args).forEach((argDescription,index)=>{	
			var arg = args[index];
			if(!arg){
				if(argDescription.required){
					throw new Error();
				}
				else
					return;
			}
			else if(argDescription.type == "function"){	
				var child = scope.child();
				var argNames = Meta.getParamNames(arg);
				var fnArgs = argDescription.args && argDescription.args(child,result,argNames.map((argName)=>new Sources.functionArg(argName,statment))) || []
				child.process(arg,...fnArgs);
				result.push(child)
			}
			else{
				
				if(!(arg instanceof argDescription.type)){
					arg = new argDescription.type(arg);
				}
				result.push(scope.processArg(arg))
			}
		})
		args = result;
		statment.setArgs(args);
		
		
		scope.statments.push(statment)
		var functionCall = new Sources.functionCall(statment)
		if(this.return)
			return this.return(functionCall);
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