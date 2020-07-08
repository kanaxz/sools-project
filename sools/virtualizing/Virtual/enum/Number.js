const Virtualizing = require("../../index");
const Base = require("./Base");
const HandlerOptions = require("../../Handler/Options")
module.exports = Virtualizing.defineType({
	name:'number',
	extends:Base,
	handler:class Number extends Base.handler{
		static cast(arg){
			return typeof(arg) == "number"
		}
	},
	methods:(Number)=>{
		return ['add','subtract','multiply','divide','modulo'].reduce((methods,method)=>{
			methods[method] = {
				return:function(source){
					return new Number(new HandlerOptions({
						source
					}));
				},
				args:[Number,Number]
			}
			return methods
		},{})
	}
})