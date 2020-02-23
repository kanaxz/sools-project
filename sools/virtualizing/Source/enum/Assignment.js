const Var = require("./Var");

module.exports = class Assignment extends Var {
	constructor(name, assignment){
		super(name);
		this.assignment = assignment;
	}
}