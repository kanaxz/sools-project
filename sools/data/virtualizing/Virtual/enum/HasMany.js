const Virtualizing = require("../../../../virtualizing")
const Array = require("../../../../virtualizing/Virtual/enum/Array")
const Function = require("../../../../virtualizing/Virtual/enum/Function")
const HandlerOptions = require("../../../../virtualizing/Handler/Options")
const utils = require("../utils")


module.exports = Virtualizing.defineType({
	name:'hasMany',
	extends:Array,
	handler:class HasManyHandler extends Array.handler{
		constructor(options){
			super(options);
			if(options.property)
				this.property = options.property
		}
		static callAsProperty(scope, property,ref){
			return {
				type:new property.model(new HandlerOptions({
					ref:ref && ref.refs.type
				})),
				property:property
			};
		}
	},
	methods:(HasMany)=>({
		include:{
			jsCall:(args, call)=>{
				return utils.include(args, call, true)
			},
			return:(functionCall)=>{
				var hasMany = functionCall.args[0];
				hasMany.ref.isIncluded = true;
				return hasMany.clone({
					source:functionCall
				})
			},
			args:[
				HasMany
			]
		},
		load:{
			jsCall:(args, call)=>{
				return utils.load(args, call,true)
			},
			return:(functionCall)=>{
				var hasMany = functionCall.args[0];
				hasMany.ref.isLoaded = true;
				//hasMany.type.ref.isLoaded = true;
				return hasMany.clone({
					source:functionCall
				})
			},
			args:[
				HasMany,
				{
					type:Function,
					args:(scope, args, argNames)=>{
						return [
							new Array(new HandlerOptions({
								scope,
								source:argNames[0],
								type:args[0].type.clone()
							}))
						]
					}
				}
			]
		}
	})
})

