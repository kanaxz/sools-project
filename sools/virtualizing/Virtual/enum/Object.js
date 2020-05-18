const Virtualizing = require("../../index")
const String = require("./String");
const Handler = require("../../Handler");
const Scope = require("../../Scope")
const HandlerOptions = require("../../Handler/Options")
const Values = require("../../Source/enum/Values");
const Source = require("../../Source")
const Value = require("../../Source/enum/Value");

module.exports = Virtualizing.defineType({
	handler:class extends Handler {
		static buildArg(scope,args,arg, description){
			return new this.virtual(new HandlerOptions({
				scope,
				source:arg
			}))
		}
	},
	class:(base)=>{
		return class VObject extends base {
			constructor(options){
				var options
				var save;
				if(!(options.source instanceof Source) && typeof(options.source) == "object"){
					save = options.source
					options.source = new Values();
				}
				super(options);
				if(save){
					var result = {};
					
					for(var p in save){
						var property = this.constructor.properties[p];
						if(!property){
							debugger
							throw new Error("Property not found")
						}
						var value = save[p];
						if(!(value instanceof property.type)){
							value = property.type.handler.parse(this._handler.scope,value);
						}
						result[p] = value._handler
					}
					var properties = Object.keys(save).reverse()
					for(var p of properties){
						this._handler.scope.processArg(result[p])
					}
					this._handler.source = new Values(result);
				}
			}
		}
	}
})