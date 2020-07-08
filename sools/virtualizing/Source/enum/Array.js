const Source = require("../index")
module.exports =  class Array extends Source{
	constructor(values){
		super();
		this.values = values;
	}

	toJSON(){
		return this.values.map((value)=>{
			return value && value.toJSON && value.toJSON() || value
		})
	}
}