const Var = require("./Var");

module.exports = class FunctionArg extends Var {
	constructor(name, fn){
		super(name);
		this.function = fn;
	}
}