const Source = require("../index")
module.exports =  class Values extends Source{
	constructor(values){
		super();
		for(var p in  values)
			this[p] = values[p]
	}

	toJSON(){
		
		var result = {};
		for(var p in this){
			var value = this[p]
			var json = value.toJSON ?  value.toJSON() : value
			result[p] = json
		}
		return result;
	}
}