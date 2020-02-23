const Virtual =  require("./Virtual")
const Handler = require("./Handler")
const Function = require("./Function");



var Virtualizing = {
	defineType:(typeDescription)=>{
		
		var base = typeDescription.extends && typeDescription.extends.target || Virtual;
		var holder =  {}
		var type = (typeDescription.class && typeDescription.class(base)) || (class extends base {})

		var proxy = type;
		/*
		var proxy = new Proxy(type,{
			 construct(target, args) {
			 	var instance = new type(...args);
			 	return new Proxy(instance,{
			 		deleteProperty:(o,property)=>{
			 			DELETE(instance[property])
			 		}
			 	})
			 }
		})
		/**/
		proxy.registerMethods(typeDescription.methods);
		proxy.registerProperties(typeDescription.properties);
		
		proxy.handler = typeDescription.handler || (typeDescription.extends && class extends typeDescription.extends.handler {}) || class extends Handler {};
		proxy.typeName = typeDescription.name
		proxy.target = type;
		proxy.handler.virtual = proxy;
		return  proxy
	},
	defineFunction:(name,fnDescription)=>{
		return new Function({
			name,
			...fnDescription
		})
	}
}

module.exports = Virtualizing;
