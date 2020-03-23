const Source =  require("../index");
module.exports = class Var extends Source {
	constructor(name){
		super();
		this.name = name;
	}

	toJSON(){
		return "$" + this.name;
	}
}