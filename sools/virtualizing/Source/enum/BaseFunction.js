const Source = require("../index")

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
		var processedArgs = []
		this.getArgs(args).forEach((argDescription,index)=>{	
			var t = this;
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
					arg = argDescription.type.handler.buildArg(scope, processedArgs, arg, argDescription);
				}
				processedArgs.push(scope.processArg(arg))
			}
		})
		processedArgs = processedArgs.map((arg)=>arg._handler || arg)
		var functionCall = new FunctionCall({
			scope,
			function:this,
			args:processedArgs
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


	calleable(){
		return (...args)=>{
			var scope = findScope(args);
			if(!scope)
				throw new Error("Scope not found");
			return this.call(scope.target,args);
		}
	}
}