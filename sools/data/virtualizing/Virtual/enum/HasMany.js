const Virtualizing = require("../../../../virtualizing")
const Array = require("../../../../virtualizing/Virtual/enum/Array")
const HandlerOptions = require("../../../../virtualizing/Handler/Options")
module.exports = Virtualizing.defineType({
	name:'hasMany',
	extends:Array,
	handler:class HasManyHandler extends Array.handler{
		static callAsProperty(scope, property){
			return {
				type:new property.model()
			};
		}
	},
	methods:(HasMany)=>({
		load:{
			return:(functionCall)=>{
				var hasMany = functionCall.statment.args[0];
				hasMany.ref.loaded = true;
				//hasMany.type.ref.loaded = true;
				return hasMany.clone({
					source:functionCall
				})
			},
			args:[
				HasMany,
				{
					type:'function',
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

