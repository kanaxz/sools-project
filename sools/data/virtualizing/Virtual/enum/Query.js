const Virtualizing = require("../../../../virtualizing")
const Array = require("../../../../virtualizing/Virtual/enum/Array")
const Handler = require("../../../../virtualizing/Handler")
const HandlerOptions = require("../../../../virtualizing/Handler/Options")
const Reference = require("../../../../virtualizing/Handler/Reference")
const Function = require("../../../../virtualizing/Virtual/enum/Function")
const Model = require("./Model")
const Sources = require("../../../../virtualizing/Source/enum")
module.exports = Virtualizing.defineType({
	name:'query',
	extends:Array,
	template:Model,
	methods:(Collection)=>{
		return {
			update:{
				args:(T,args)=>{
					return [T,{
						type:Function,
						required:true,
						args:(scope,args,argNames)=>{
							return [new args[0].template(new HandlerOptions({
								scope,
								source:argNames[0],
								ref:args[0].ref.refs.template
							})),new Function(new HandlerOptions({
								scope,
								source:new Sources.function({
									name:argNames[1].name
								})
							}))]
						}
					}]
				}
			},
			delete:{
				args:(T,args)=>{
					return [T,{
						type:Function,
						required:false,
						args:(scope,args,argNames)=>{
							return [new args[0].template(new HandlerOptions({
								scope,
								source:argNames[0],
								ref:args[0].ref.refs.template
							})),new Function(new HandlerOptions({
								scope,
								source:new Sources.function({
									name:argNames[1]
								})
							}))]
						}
					}]
				}
			},
		}
	}
})