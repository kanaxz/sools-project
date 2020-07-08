const Process = require("../processing/Process");
const Scope = require("./Scope")
const Virtual = require("../virtualizing/Virtual")
const Handler = require("../virtualizing/Handler")
const ArrayUtils = require("../Array/utils")
const handlers = [
	require("./types/Array"),
	//require("./types/DynamicObject"),
	require("./types/Functions"),
	require("./types/Base"),
	require("./types/Virtual"),
	require("./types/Number"),
	//require("./types/Sources")
]

module.exports = class Memory extends Process {
	constructor(options){
		super();
		this.handlers = options.handlers;
	}

	static handlers(){
		return handlers.map((handler)=>new handler())
	}

	async setup(scope, next){
		this.datas = scope.datas;
		for(var handler of this.handlers)
			await handler.setup(this);
		return super.setup(scope, next);
	}

	async processFunctionCall(scope, functionCall){
		return await ArrayUtils.chain(this.handlers,async (handler,next)=>{
			return await handler.processFunctionCall(scope,functionCall,next)
		},()=>{
			throw new Error(`no handler found for functionCall ${functionCall.function.name}`);
		})
	}


	async execute(scope, next){
		var vscope = scope.scope;
		var workingScope = new Scope(this);
		for(var v in scope.vars){
			console.log(v)
			workingScope.setValue(vscope.getVar(v),scope.vars[v]);	
		}
		
		for(var handler of this.handlers){
			await handler.init(workingScope,vscope)
		}
		var result = await workingScope.process(vscope);
		scope.result = result;
		//console.log("result",JSON.stringify(result,null,"  "));
		return super.execute(scope, next);
	}

	async stop(scope, next){
		for(var handler of this.handlers)
			await  handler.stop();
		return super.stop(scope, next);
	}
}