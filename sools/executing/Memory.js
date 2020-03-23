const Process = require("../processing/Process");
const Scope = require("./Scope")
const Virtual = require("../virtualizing/Virtual")
const Handler = require("../virtualizing/Handler")
const handlers = [
	require("./types/Array"),
	require("./types/DynamicObject"),
	require("./types/Functions"),
	require("./types/Sources")
]

module.exports = class Memory extends Process {
	constructor(options){
		super();
		this.handlers = [...options.handlers,...handlers.map((handler)=>new handler())]
	}

	async setup(scope, next){
		this.datas = scope.datas;
		for(var handler of this.handlers)
			await handler.setup(this);
		return super.setup(scope, next);
	}

	async processFunctionCall(scope, functionCall){
		for(var handler of this.handlers){
			var result = await handler.processFunctionCall(scope, functionCall);
			if(typeof(result) != "undefined")
				return result
		}
		
		throw new Error(`no handler found for functionCall ${functionCall.function.source.name}`);
	}

	async processArg(scope, arg){
		if(arg instanceof Handler){
			
			for(var handler of this.handlers){
				var result = await handler.processArg(scope, arg);
				if(typeof(result) != "undefined")
					return result
			}
			debugger
			throw new Error(`no handler found for virtual ${arg.typeName}`);
		}
		else
			return arg;
	}

	async execute(scope, next){
		var vscope = scope.scope;
		var workingScope = new Scope(this);
		workingScope.setValue(vscope.getVar('context'),scope.context);
		var result = await workingScope.process(vscope);
		scope.result = result;
		console.log("result",JSON.stringify(result,null,"  "));
		return super.execute(scope, next);
	}

	async stop(scope, next){
		for(var handler of this.handlers)
			await  handler.stop();
		return super.stop(scope, next);
	}
}