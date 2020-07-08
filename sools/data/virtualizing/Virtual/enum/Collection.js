const Virtualizing = require("../../../../virtualizing")
const Array = require("../../../../virtualizing/Virtual/enum/Array")
const Handler = require("../../../../virtualizing/Handler")
const HandlerOptions = require("../../../../virtualizing/Handler/Options")
const Reference = require("../../../../virtualizing/Handler/Reference")
const Model = require("./Model")
const Function = require("../../../../virtualizing/Virtual/enum/Function")

module.exports = Virtualizing.defineType({
	name:'collection',
	template:Model,
	methods:(Collection)=>{
		return {
			update:{
				args:(T,args)=>{
					return [T,{
						type:Function,
						required:true,
						args:(scope,args,argNames)=>{
							return [new (Array.of(args[0].template))(new HandlerOptions({
								scope,
								source:argNames[0]
							}))]
						}
					},{
						type:Function,
						required:true,
						args:(scope,args,argNames)=>{
							return [new (args[0].template)(new HandlerOptions({
								scope,
								source:argNames[0]
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
			push:{
				return:(functionCall)=>{
					return new (Array.of(functionCall.args[0].template))(new HandlerOptions({
						source:functionCall
					}))
				},
				args:(T)=>[T,Array.of(T.template)]
			},
			get:{
				return:(functionCall)=>{
					var result = new (Array.of(functionCall.args[0].template))(new HandlerOptions({
						source:functionCall,
						ref:new Reference({
							template:new Reference({
								isLoaded:true
							})
						})
					}))
					return result
				},
				args:[
					Collection
				]
			}
		}
	}
})