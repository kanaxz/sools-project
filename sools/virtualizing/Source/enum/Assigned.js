const Var = require("./Var");

module.exports = class Assigned extends Var {
	constructor(name, assign){
		super(name);
		this.assignment = assignment;
	}
}