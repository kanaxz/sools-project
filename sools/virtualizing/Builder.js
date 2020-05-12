const Sources = require("./Source/enum")
const HandlerOptions = require("./Handler/Options")

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
		if(json.function == "assign"){
			var source = this.virtual(scope,json.args[0])
			var variable = source._handler.clone({
				scope,
				source:json.args[1].replace("$","")
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
	virtual(scope, arg, fn){
		if(typeof(arg) == "object" && arg.function){
			return this.functionCall(scope, arg);
		}
		else if(typeof(arg) == "string" && arg.startsWith("$")){
			var split = arg.split(".");
			var variable = scope.getVar(split[0].replace("$",""))
			if(!variable)
				debugger
			var result = variable.virtual;
			split.shift();
			for(var segment of split){
				result = result[segment]
			}
			return result;
		}
		else if(typeof(arg) == "object" && arg.source && arg.path){

		}
		else if(arg.argNames && arg.statements){
			return arg;
		}
		else {
			var types = scope.env.types;
			for(var typeName in types){
				var type = types[typeName];
				if(type.handler.cast(arg)){
					return type.handler.parse(scope,arg);
				}
			}			
		}
		return arg;
	}
}

module.exports = Builder;