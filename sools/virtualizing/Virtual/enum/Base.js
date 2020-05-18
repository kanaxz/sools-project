const Virtualizing = require("../../index");
const HandlerOptions = require("../../Handler/Options")
const Handler = require("../../Handler")
const Value = require("../../Source/enum/Value")
module.exports = Virtualizing.defineType({
	name:'base',
	handler:class BaseHandler extends Handler{
		static buildArg(scope,args,arg, description){
			return this.parse(scope,arg);
		}

		static parse(scope, value){
			return new this.virtual(new HandlerOptions({
				scope,
				source:new Value(value)
			}))
		}
	},
	methods:(Base)=>{
		var definition = {
			return:function(source){
				return new Base.Boolean(new HandlerOptions({source}));
			},
			args:(T)=>[T,T]
		}
		return ['gt','lt'].reduce((methods,method)=>{
			methods[method] = definition
			return methods
		},{})
	}
})
