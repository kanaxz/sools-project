const References = require("./Reference/enum");
class Env {

	process(fn){
		
	}

	function(fn, args){
		return new References.function(fn,args);
	}
}

module.exports =  Env;