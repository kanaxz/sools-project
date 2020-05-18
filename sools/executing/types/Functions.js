const Handler = require("../Handler");
const Functions = require("../../virtualizing/functions")
const Sources = require("../../virtualizing/Source/enum")
const Virtual = require("../Virtual")
const Virtuals = require("../../virtualizing/Virtual/enum")
const flag = Symbol("pass");
var FunctionProcess = {
	get:async(scope,functionCall)=>{
		var obj = await scope.getValue(functionCall.args[0]);
		var property = await scope.getValue(functionCall.args[1]);
		return obj[property]
	},
	delete:async(scope,functionCall)=>{
		var owner = await scope.getValue(functionCall.args[0])
		var property = await scope.getValue(functionCall.args[1]);
		delete owner[property];
		return null;
	},
	forin:async(scope,functionCall)=>{
		var obj = await scope.getValue(functionCall.args[0]);
		for(var p in obj){
			var child = scope.child();
			child.setValue(functionCall.args[1].source.scope.args[0],p);
			await child.process(functionCall.args[1].source.scope);
		}
		return null
	},
	or:async(scope,functionCall)=>{
		for(var arg of functionCall.args[0].source.values){
			var result = await scope.getValue(arg)
			if(result)
				return result
		}
		return false;
	},
	if:async (scope,functionCall)=>{
		var result = await scope.getValue(functionCall.args[0])
		if(result){
			var child = scope.child();
			await child.process(functionCall.args[1].source.scope);
			functionCall[flag] = true 
		}
		return null
	},
	elseif:async (scope,functionCall)=>{
		var vscope = functionCall.scope;
		if(vscope.statements[vscope.statements.indexOf(functionCall) - 1][flag])
			return null
		if(await scope.getValue(functionCall.args[0])){
			var child = scope.child();
			await child.process(functionCall.args[1].source.scope);
			functionCall[flag] = true 
		}
		return null
	},
	else:async (scope,functionCall)=>{
		var vscope = functionCall.scope;
		if(vscope.statements[vscope.statements.indexOf(functionCall) - 1][flag])
			return null
		var child = scope.child();
		await child.process(functionCall.args[0].source.scope);
		return null
	},
	set:async (scope, functionCall)=>{
		var target = await scope.getValue(functionCall.args[0]);
		var property = await scope.getValue(functionCall.args[1]);
		target[property] = await scope.getValue(functionCall.args[2])
		return null
	},
	log:async(scope,functionCall)=>{
		var array = await scope.getValue(functionCall.args[0])
		console.log(...(array.map(o=>JSON.stringify(o,null," "))))
		return array
	},
	throw:async(scope,functionCall)=>{
		var error = await scope.getValue(functionCall.args[0]);
		throw new Error(error.message)
		return null
	},
	not:async(scope,functionCall)=>{
		var value = await scope.getValue(functionCall.args[0]);
		return !value
	},
	declare:async (scope, functionCall)=>{
		var id = await scope.getValue(functionCall.args[0]);		
		var variable = await scope.getValue(functionCall.args[1],Virtual);
		scope.setValue(functionCall.scope.getVar(id),variable);
		return null
	},
	return:async (scope, functionCall)=>{
		var result = await scope.getValue(functionCall.args[0])
		return result
	}
}

module.exports = class FunctionsHandler extends Handler {
	
	async processFunctionCall(scope,functionCall,next){
		if(functionCall.function instanceof Sources.dynamicFunction){
			var dynamicFunction = functionCall.function;
			var child = scope.child()
			var index = 0
			for(var arg of functionCall.args){
				var value = await scope.getValue(arg);	
				child.setValue(dynamicFunction.scope.args[index++],value)
			}
			var result = await child.process(dynamicFunction.scope);
			return result;
		}
		else if(FunctionProcess[functionCall.function.name]){
			return await FunctionProcess[functionCall.function.name](scope,functionCall)
		}
		else
			return next();
	}
}