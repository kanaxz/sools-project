const Virtualizing = require("../../index")
const String = require("./String");
const Handler = require("../../Handler");
const Scope = require("../../Scope")
const HandlerOptions = require("../../Handler/Options")
const Values = require("../../Source/enum/Values");

module.exports = Virtualizing.defineType({
	class:(base)=>{
		return class Object extends base {
			constructor(...args){
				var options
				var values = {};
				var isPushed = false;
				var hasValues = false;
				args.forEach((arg, index)=>{
					if(arg instanceof HandlerOptions)
						options = arg;
					else{
						hasValues = true
						if(typeof(arg) == "object" && args.length == 1){
							values = arg;
						}
						else{
							isPushed = true;
							values[index - (options ? - 1 : 0)] = arg;
						}
					}
				})
				options = options || new HandlerOptions();
				if(hasValues){
					options.source = new Values(isPushed ? null :values);
				}
				super(options);
				if(isPushed){
					var index = 0;
					for(var propertyName in this.constructor.properties){
						options.source[propertyName] = values[index++]
					}
				}
			}
		}
	}
})