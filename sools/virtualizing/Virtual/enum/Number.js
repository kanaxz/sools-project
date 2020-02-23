const Virtualizing = require("../../index");
const Base = require("./Base");

module.exports = Virtualizing.defineType({
	name:'number',
	extends:Base,
	handler:class Number extends Base.handler{
		static cast(arg){
			return typeof(arg) == "number"
		}
	},
	methods:(Number)=>{
		return ['add','substract','multiply','divide','modulo'].reduce((methods,method)=>{
			methods[method] = {
				call:function(arg2){
					return {
						arg1:this,
						arg2
					}
				},
				return:function(source){
					return new Number({source});
				},
				args:[Number,Number]
			}
			return methods
		},{})
	}
})