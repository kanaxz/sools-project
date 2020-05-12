const Source = require("../index")
module.exports =  class Value extends Source{
	constructor(value){
		super();
		this.value = value;
	}

	toJSON(){
		return this.value;
	}
}