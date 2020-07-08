const Virtualizing = require("../../index")
const Number = require("./Number");
const Handler = require("../../Handler");
const utils = require("../../utils")
const Function = require("./Function");
const HandlerOptions = require("../../Handler/Options")
const Reference = require("../../Handler/Reference")
const ArraySource = require("../../Source/enum/Array") 
const Virtual = require("../../Virtual")

const VArray = Virtualizing.defineType({
	name:'array',
	template:Virtual,
	handler: class VArray extends Handler {

		constructor(options){
			super(options)
			if(!this.ref.template)
				this.ref.template = new Reference()
		}

		static buildArg(scope,args,arg, description){
			return this.parse(scope,arg)
			//return new this.virtual(arg);
		}

		static parse(scope,array){
			if(!(array instanceof Array)){
				debugger
				throw new Error()
			}
			array = array.map((value)=>{
				if(!(value instanceof this.template)){
					value = this.template.handler.parse(scope,value);
				}
				return value._handler || value;
			});
			[...array].reverse().forEach((value)=>{
				scope.processArg(value);
			})
			return new this.virtual(new HandlerOptions({
				scope,
				source:new ArraySource(array)
			}))
		}

		static cast(arg){
			return arg instanceof Array
		}
	},
	class:(base)=>{
		return class CArray extends base{
			constructor(options){
				if(!options){
					options = {
						source:new ArraySource()
					}
				}
				
				super(options);
			}
			[Symbol.iterator](){
				var object;
				var scope;
				var varId = utils.gererateVariableId();
				this.forEach(eval(`(${varId},$)=>{
					object = ${varId};
					scope = $._private;
				}`))
				scope.parent._child = scope;

				var done = -1;
				return {
					next:()=>{
						done++;
						if(done == 0)
							scope.parent._child = null;
						return {value:object,done:done == 1}
					}
				}
			}
		}
	},
	methods:((VArray)=>{
		var fnArg = {
			type:Function,
			required:true,
			args:(scope, args,argNames)=>{
				return [new args[0].template(new HandlerOptions({
					scope,
					source:argNames[0],
					ref:args[0].ref.template
				}))]
			}
		}
		return {
			push:{
				args:(T)=>[T,VArray.of(T.template)]
			},
			indexOf:{
				args:(T)=>{					
					return [T,T.template]
				},
				return:(functionCall)=>{
					return new Number(new HandlerOptions({
						source:functionCall
					}))
				}
			},
			length:{
				args:[VArray],
				return:(functionCall)=>{
					return new Number(new HandlerOptions({
						source:functionCall
					}))
				}
			},
			atIndex:{
				return:(functionCall)=>{
					return new functionCall.args[0].template(new HandlerOptions({
						source:functionCall
					}))
				},
				args:[
					VArray,
					Number
				]
			},
			filter:{
				return:(functionCall)=>{
					var array = functionCall.args[0];
					return array.clone({
						source:functionCall
					})
				},
				args:[
					VArray,
					fnArg
				]
			},
			find:{
				return:(functionCall)=>{
					return new functionCall.args[0].template(new HandlerOptions({
						source:functionCall,
						ref:functionCall.args[0].ref
					}))
				},
				args:[
					VArray,
					fnArg
				]
			},
			forEach:{
				return:(functionCall)=>{
					var array = functionCall.args[0];
					return array.clone({
						source:functionCall
					})
				},
				args:[
					VArray,
					fnArg
				]
			},
			map:{
				return:(functionCall)=>{
					var rtrn = functionCall.args[1].source.scope.statements.find((statment)=>statment.functionCall.function.source.name  == 'return').functionCall.args[0];
					var array = functionCall.args[0];
					return array.clone({
						source:functionCall,
						type:rtrn
					})
				},
				args:[
					VArray,
					fnArg
				]
			}
		}
	}),
})

module.exports = VArray;