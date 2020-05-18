const Virtualizing = require("../../index");
const HandlerOptions = require("../../Handler/Options")
const Handler = require("../../Handler")
const Value = require("../../Source/enum/Value")
module.exports = Virtualizing.defineType({
	name:'type',
	handler:class extends Handler {
		static buildArg(scope,args,arg, description){
			return this.parse(scope,arg);
		}

		static parse(scope, value){
			return new this.virtual(new HandlerOptions({
				scope,
				source:value
			}))
		}
	}
})
