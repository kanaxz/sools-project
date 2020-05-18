  
const Scope = require("./Scope");
const Virtual =  require("./Virtual")
const Functions = require("./functions");
const Virtuals = require("./Virtual/")
const Builder = require("./Builder")

class Env{
	constructor(options){
		this.workers = options.workers || [];
		this.initFn = options.initFn;
		this.types = options.types,
		this.functions = {...Functions,...(options.functions || {})}
	}

	process(fn){
		var rootScope = new Scope(this);
		rootScope.process(this.initFn);
		var scope = rootScope.child();
		scope.process(fn,...rootScope.vars.map((v)=>v.virtual));
		
		return scope;
	}	

	build(scope, json){
		for(var statement of json.statements){
			Builder.functionCall(scope, statement);
		}
	}
}

module.exports = Env;