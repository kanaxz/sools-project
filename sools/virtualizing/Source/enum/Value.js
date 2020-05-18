const Source = require("../index")

module.exports =  class Value extends Source{
	constructor(value){
		super();
		if(value && value._handler){
			debugger
			throw new Error();
		}
		this.value = value;
	}

	toJSON(){
		return this.value;
	}
}