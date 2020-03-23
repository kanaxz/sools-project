const stringUtils = require("../../string/utils")

const Property = require("../Source/enum/Property")
const Method = require("../Source/enum/Method")
const HandlerOptions = require("../Handler/Options")


class Virtual{
	constructor(arg){
		var options
		if(!(arg instanceof HandlerOptions))
			options = new HandlerOptions({
				source:arg
			})
		else
			options = arg;
		options.virtual = this;
		Object.defineProperty(this,'_handler',{
			enumerable:false,
			writable:true,
			value:new this.constructor.handler(options)
		})
	}

	
	static registerMethods(methods){
		this.methods = {...this.methods}
		if(!methods)
			return
		if(typeof(methods) == "function")
			methods = methods(this)
		for(let methodName in methods){

			let method = methods[methodName]
			if(method === false){
				this.prototype[methodName] = function(){
					throw new Error();
				}
				this.methods[method.name] = null;
				continue
			}

			method = new Method({
				...method,
				args:typeof(method.args) == "function" ? method.args(this) : method.args
				name:methodName,
				type:this
			})
			
			this.prototype[method.name] = function(...args){
				return method.call(this._handler,args)
			}
			this.methods[method.name] = method;
		}
	}

	static registerProperties(properties){
		this.properties = {...this.properties}
		for(let propertyName in properties){
			let property = properties[propertyName];
			if(typeof(property) !="object"){
				property = {
					type:property
				}
			}
			property.name = propertyName;
			property.ownerType = this;
			Object.defineProperty(this.prototype,propertyName,{
				get:function(p){
					return this._handler.getProperty(property);
				}	
			})	
			this.properties[propertyName] = property;
		}
	}

	toJSON(){
		return this._handler.toJSON()
	}

	
};

module.exports = Virtual;