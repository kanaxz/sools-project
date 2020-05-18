const Virtualizing = require("../../index");
const Base = require("./Base");
const Number = require("./Number");
const Value = require("../../Source/enum/Value")
const HandlerOptions = require("../../Handler/Options")

module.exports = Virtualizing.defineType({
	name:'string',
	extends:Base,
	handler:	class String extends Base.handler{
		static cast(arg){
			return typeof(arg) == "string"
		}

		static parse(scope, value){
			return new this.virtual(new HandlerOptions({
				source:new Value(value),
				scope
			}))
		}
	},
	properties:{
		length:Number
	}
})