const Var = require("./Var");

module.exports = class FunctionArg extends Var {
	constructor(name, functionCall){
		super(name);
		this.functionCall = functionCall;
	}
}