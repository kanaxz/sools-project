const Sources = require("./Source/enum")
const HandlerOptions = require("./Handler/Options")
const Handler = require("./Handler")
var Builder = {
	functionCall(scope, json){
		var fn;
		var split = json.function.split(".");
		if(split.length == 2){
			var type = scope.env.types[split[0]]
			if(!type)
				debugger
			fn = type.methods[split[1]];
		}
		else{
			fn = scope.env.functions[json.function]
		}
		if(json.function == "declare"){
			console.log("here")
			var source = this.virtual(scope,json.args[0])
			var variable = source._handler.clone({
				scope,
				source:new Sources.var(json.args[1].replace("$",""))
			})
			//scope.vars.push(variable._handler)
			fn.innerCall(scope,[source,variable])
			return
			scope.statements.push(new Sources.functionCall({
				scope,
				function:scope.env.functions.assign,
				args:[source,variable]
			}))
			
		}
		var args = json.args.map((arg)=>this.virtual(scope, arg,fn));	
		return fn.innerCall(scope,args);

	},
	virtual(scope, arg){
		if(arg instanceof Handler){
			debugger
			throw new Error()
		}
		if(typeof(arg) == "object" && arg.function){
			return this.functionCall(scope, arg);
		}
		else if(typeof(arg) == "string" && arg.startsWith("$")){
			var split = arg.split(".");
			var variable = scope.getVar(split[0].replace("$",""))
			if(!variable){
				debugger
				throw new Error("Var not found :" + split[0])
			}
			var result = variable.virtual;
			split.shift();
			for(var segment of split){
				result = result[segment]
			}
			return result;
		}
		else if(typeof(arg) == "object" && arg.source && arg.path){

		}
		
		return arg;
	}
}

module.exports = Builder;