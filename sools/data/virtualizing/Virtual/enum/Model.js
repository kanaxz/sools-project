const Virtualizing = require("../../../../virtualizing")
const Array = require("../../../../virtualizing/Virtual/enum/Array")
const HandlerOptions = require("../../../../virtualizing/Handler/Options")
const Boolean = require("../../../../virtualizing/Virtual/enum/Boolean")
const Object =require("../../../../virtualizing/Virtual/enum/Object")
const utils = require("../utils")
const Function = require("../../../../virtualizing/Virtual/enum/Function")

module.exports = Virtualizing.defineType({
	name:'model',
	extends:Object,
	handler:class ModelHandler extends Object.handler{
		constructor(options){
			super(options);
			if(options.property)
				this.property = options.property
		}
		static callAsProperty(scope, property){
			return {
				property:property
			};
		}
	},
	methods:(Model)=>({
		include:{
			jsCall:(args, call)=>{
				return utils.include(args, call, false)
			},
			return:(functionCall)=>{
				var model = functionCall.args[0];
				model.ref.isIncluded = true;
				return model.clone({
					source:functionCall
				})
			},
			args:[
				Model
			]
		},
		load:{
			jsCall:(args, call)=>{
				return utils.load(args, call, false)
			},
			return:(functionCall)=>{
				var model = functionCall.args[0];
				model.ref.isLoaded = true;
				return model.clone({
					source:functionCall
				})
			},
			args:(Model)=>[
				Model,
				{
					type:Function,
					args:(scope, args, argNames)=>{
						return [
							new Array(new HandlerOptions({
								scope,
								source:argNames[0],
								//type:args[0].clone()
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