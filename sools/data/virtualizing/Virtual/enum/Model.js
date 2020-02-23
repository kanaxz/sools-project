const Virtualizing = require("../../../../virtualizing")
const Array = require("../../../../virtualizing/Virtual/enum/Array")
const HandlerOptions = require("../../../../virtualizing/Handler/Options")
const Boolean = require("../../../../virtualizing/Virtual/enum/Boolean")
const Object =require("../../../../virtualizing/Virtual/enum/Object")

module.exports = Virtualizing.defineType({
	name:'model',
	extends:Object,
	methods:(Model)=>({
		load:{
			return:(functionCall)=>{
				var model = functionCall.statment.args[0];
				model.ref.loaded = true;
				return model.clone({
					source:functionCall
				})
			},
			args:(Model)=>[
				Model,
				{
					type:'function',
					args:(scope, args, argNames)=>{
						return [
							new Array(new HandlerOptions({
								scope,
								source:argNames[0],
								type:args[0].clone()
							}))
						]
					}
				}
			]
		},
		eq:{
			return:(functionCall)=>{
				return new Boolean(new HandlerOptions({source:functionCall}))
			},
			args:(Model)=>[
				Model,
				Model
			]
		}
	})
})