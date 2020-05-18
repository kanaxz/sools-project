const Virtualizing = require("../../../../virtualizing")
const Array = require("../../../../virtualizing/Virtual/enum/Array")
const Handler = require("../../../../virtualizing/Handler")
const HandlerOptions = require("../../../../virtualizing/Handler/Options")
const Reference = require("../../../../virtualizing/Handler/Reference")
const Query = require("./Query")
const Model = require("./Model")
const Function = require("../../../../virtualizing/Virtual/enum/Function")

module.exports = Virtualizing.defineType({
	name:'collection',
	template:Model,
	methods:(Collection)=>{
		return {
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
					var result = new (Query.of(functionCall.args[0].template))(new HandlerOptions({
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