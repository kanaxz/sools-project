var associations = {
	hasOne:require("./HasOne"),
	hasManyThrough:require("./hasMany/Association"),
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
	proxy[typeName] = new Proxy(associations[typeName],{
		apply:(target,thisArg, args)=>{
			return {
				propertyTypeProxy:true,
				type:target,
				parameters:args[0]
			}
		}
	})
}

module.exports = proxy;