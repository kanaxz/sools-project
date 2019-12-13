const Properties = require("sools-define/Properties");
const associations = require("sools-data/associations")
var builders = [{
	type:Properties.types.string,
	control:require("./string")
},{
	type:associations.hasManyThrough,
	control:require("./hasManyThrough")
}]


module.exports = {
	build:(model,property)=>{
		var builder = builders.find((builder)=>{
			return property instanceof builder.type  
		})
		return new builder.control(model, property);
	}
}