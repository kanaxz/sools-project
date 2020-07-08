const PropertyTypes = require("../../../Propertiable/Property/enum")
var associations = {
	hasOne:require("./HasOne"),
	hasMany:require("./HasMany"),
	/*
	bool:require("./bool/Property"),
	number:require("./number/Property"),
	
	date:require("./date/Property"),
	/**/
}

var proxy = {
	dispatch:{
		cascade:1
	}
}

for(var typeName in associations){
	proxy[typeName] = PropertyTypes.register(typeName,associations[typeName])
}

module.exports = proxy;