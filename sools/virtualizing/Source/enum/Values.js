const Source = require("../index")
module.exports =  class Values extends Source{
	constructor(values){
		super();
		for(var p in  values)
			this[p] = values[p]
	}

	toJSON(){
		
		var result = {};
		for(var p in this)
			result[p] = this[p].toJSON && this[p].toJSON() || this[p]
		return result;
	}
}