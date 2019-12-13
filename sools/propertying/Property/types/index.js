var propertyTypes = {
    array: require("./array/Property"),
    object: require("./object/Property"),
    string: require("./string/Property"),
    number: require("./number/Property"),
    any: require("./any/Property"),
    /*
    bool:require("./bool/Property"),
    number:require("./number/Property"),
	
    date:require("./date/Property"),
    /**/
}

var proxy = {
    register: function(name, type) {
        if (this[name])
            throw new Error(`Property type name '${name}' not available`)
        this[name] = new Proxy(type, {
            apply: (target, thisArg, args) => {
                return {
                    propertyTypeProxy: true,
                    type: target,
                    parameters: args
                }
            }
        })
        return  this[name]
    }
}

for (var typeName in propertyTypes) {
    proxy.register(typeName, propertyTypes[typeName]);
}

module.exports = proxy;