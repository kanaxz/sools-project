const Expression = require("./Expression");
module.exports = class SwitchExpression extends Expression {
	constructor(){
		super();
		this.$switch = {
			branches:[]
		}
	}

	branche(branche){
		this.$switch.branches.push(branche)
	}

	default($default){
		this.$switch.default = $default;
	}
}