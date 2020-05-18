const Virtual = require("../../../../virtualizing")
const Array = require("../../../../virtualizing/Virtual/enum/Array")
const HandlerOptions = require("../../../../virtualizing/Handler/Options")
const Boolean = require("../../../../virtualizing/Virtual/enum/Boolean")
const Object =require("../../../../virtualizing/Virtual/enum/Object")
const utils = require("../utils")
const Function = require("../../../../virtualizing/Virtual/enum/Function")

const Model = Virtual.define({
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
		unload:{
			jsCall:(args, call)=>{
				return utils.unload(args, call, false)
			},
			return:(functionCall)=>{
				var model = functionCall.args[0];
				model.ref.isLoaded = false;
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
			args:(T)=>[
				T,
				{
					type:Function,
					args:(scope, args, argNames)=>{
						return [
							new (Array.of(args[0].constructor.virtual))(new HandlerOptions({
								scope,
								source:argNames[0]
							}))
						]
					}
				}
			]
		}
	})
})


utils.model = Model;
module.exports = Model
