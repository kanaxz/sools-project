var Process = require("./Process");
class Function extends Process {
	constructor(fn){
		this.fn = fn;
	}

	execute(scope){
		this.fn(scope);
		super.execute(scope);
	}
}

module.exports = Function;