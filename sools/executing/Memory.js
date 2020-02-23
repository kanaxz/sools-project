const Process = require("../processing/Process");
const Scope = require("./Scope")
const Virtual = require("../virtualizing/Virtual")
const Handler = require("../virtualizing/Handler")
const handlers = [
	require("./types/Array"),
	require("./types/DynamicObject")
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
			if(await handler.canProcessFunctionCall(scope, functionCall))
				return await handler.processFunctionCall(scope, functionCall);
		}
		
		throw new Error("no handler found");
	}

	async processArg(scope, arg){
		if(arg instanceof Handler){
			
			for(var handler of this.handlers){
				if(await handler.canProcessArg(scope, arg))
					return await handler.processArg(scope, arg);
			}
			debugger
			throw new Error("no handler found");
		}
		else
			return arg;
	}

	async execute(scope, next){
		var vscope = scope.scope;
		var workingScope = new Scope(this);
		workingScope.setSource(vscope.getVar('context'),scope.context);
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