const Scope = require("./Scope");
const Virtual =  require("./Virtual")
require("./Function/enum");
class Env{
	constructor(options){
		this.workers = options.workers;
		this.initFn = options.initFn;
	}

	process(fn){
		var rootScope = new Scope(this);
		rootScope.process(this.initFn);
		var scope = rootScope.child();
		scope.process(fn,...rootScope.vars.map((v)=>v.virtual));
		return scope;
	}	

	build(object){
		var rootScope = new Scope(this);
		rootScope.process(this.initFn);
		return Scope.build(rootScope,object)
	}
}

module.exports = Env;