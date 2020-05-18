const Source = require("../index")
const FunctionCall = require("./FunctionCall")

function findScope(args){
	for(var arg of args){
		if(arg._handler  && arg._handler.scope)
			return arg._handler.scope;
	}
	return null;
}

module.exports = class Function extends Source {

	call(scope, args,fn){
		args = args.map((arg)=>arg && arg.virtual || arg);
		//scope = scope.target		
		args = this.buildArgs(scope,args);
		[...args].reverse().forEach((arg)=>{
			scope.processArg(arg);
		})
		args = args.map((arg)=>arg._handler || arg)

		var functionCall = new FunctionCall({
			scope,
			function:this,
			args
		})
		if(fn){
			fn(functionCall)
		}
		else{
			scope.statements.push(functionCall)	
		}	
		var result;
		if(this.return)
			result = this.return(functionCall);			
		scope.env.workers.forEach((worker)=>{
			var subResult = worker.onFunctionCalled(scope,functionCall, result)
			if(typeof(subResult) != "undefined")
				result = subResult;
		})
		return result;
	}


	calleable(initialScope){
		return (...args)=>{
			var scope = initialScope
			if(!scope)
				scope = findScope(args);
			if(!scope){
				debugger
				throw new Error("Scope not found");
			}
			
			return this.call(scope.target,args);
		}
	}
}