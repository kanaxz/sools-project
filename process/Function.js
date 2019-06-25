var Process = require("./Process");
class Function extends Process {
	constructor(fn){
		this.fn = fn;
	}

	execute(context){
		this.fn(context);
		super.execute(context);
	}
}

module.exports = Function;