const Virtualizing = require("../../../../virtualizing")
const Array = require("../../../../virtualizing/Virtual/enum/Array")
const Function = require("../../../../virtualizing/Virtual/enum/Function")
const HandlerOptions = require("../../../../virtualizing/Handler/Options")
const utils = require("../utils")
const Model = require("./Model")
const Reference = require("../../../../virtualizing/Handler/Reference")

const HasMany = Virtualizing.defineType({
	name:'hasMany',
	extends:Array,
	template:Model,
	handler:class HasManyHandler extends Array.handler{
		constructor(options){
			super(options);
			if(options.property)
				this.property = options.property
		}
		static callAsProperty(scope, property,ref){
			return {
				ref,
				property:property
			};
		}
	},
	methods:(HasMany)=>({
		unload:{
			jsCall:(args, call)=>{
				return utils.unload(args, call, true)
			},
			return:(functionCall)=>{
				var hasMany = functionCall.args[0];
				hasMany.ref.isLoaded = false;
				hasMany.ref.template.isLoaded = false;
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
				hasMany.ref.template.isLoaded = true;
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
							new (Array.of(args[0].template))(new HandlerOptions({
								scope,
								source:argNames[0],
								ref:args[0].ref
							}))
						]
					}
				}
			]
		}
	})
})


utils.hasMany = HasMany;
module.exports = HasMany
