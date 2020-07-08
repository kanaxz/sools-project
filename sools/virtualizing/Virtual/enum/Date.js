const Virtualizing = require("../../index");
const Base = require("./Base");
const HandlerOptions = require("../../Handler/Options")
module.exports = Virtualizing.defineType({
	name:'date',
	extends:Base,
	handler:class Date extends Base.handler{
		
	},
	methods:(Date)=>{
		return ['add','subtract'].reduce((methods,method)=>{
			methods[method] = {
				return:function(source){
					return new Number(new HandlerOptions({
						source
					}));
				},
				args:[Date,Date]
			}
			return methods
		},{})
	}
})
