const Source =  require("../index");
module.exports = class FunctionCall extends Source {
	constructor(statment){
		super();
		this.statment = statment;
	}

	get scope(){
		return this.statment.scope;
	}

	toJSON(){
		return this.statment.toJSON();
	}
}