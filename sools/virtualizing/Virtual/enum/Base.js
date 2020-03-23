const Virtualizing = require("../../index");
const HandlerOptions = require("../../Handler/Options")

module.exports = Virtualizing.defineType({
	name:'base',
	methods:(Base)=>{
		var definition = {
			return:function(source){
				return new Base.Boolean(new HandlerOptions({source}));
			},
			args:(Base)=>[Base,Base]
		}
		return ['eq','gt'].reduce((methods,method)=>{
			methods[method] = definition
			return methods
		},{})
	}
})
