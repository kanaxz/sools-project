const BaseFunction = require("./BaseFunction")
const Meta = require("../../../meta")
const FunctionArg = require("./FunctionArg");

module.exports = class DynamicFunction extends BaseFunction {

	constructor(scope, args, fn){
		super();
		var argNames = Meta.getParamNames(fn);
		var sources = argNames.map((argName)=>{
				return new FunctionArg(argName,this)
		})
		this.scope = scope.child();
		var fnArgs;
		if(typeof(args) == "function") 
			fnArgs = args(this.scope,sources);
		else{
			fnArgs = args.map((arg,index)=>arg.clone({
				scope:this.scope,
				source:sources[index]
			}))
		}
		this.scope.process(fn,...fnArgs);
	}

	toJSON(){
		return this.scope.toJSON();
	}
}