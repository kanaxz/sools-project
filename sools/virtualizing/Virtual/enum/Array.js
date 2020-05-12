const Virtualizing = require("../../index")
const Number = require("./Number");
const Handler = require("../../Handler");
const utils = require("../../utils")
const Function = require("./Function");
const HandlerOptions = require("../../Handler/Options")
const Reference = require("../../Handler/Reference")
const ArraySource = require("../../Source/enum/Array") 
const Virtual = require("../../Virtual")

const Array = Virtualizing.defineType({
	name:'array',
	template:Virtual,
	handler: class Array extends Handler {

		constructor(options){
			super(options)
			if(!this.ref.refs.template)
				this.ref.refs.template = new Reference()

		}

		static buildArg(scope,args,arg, description){
			return this.parse(scope,arg)
			//return new this.virtual(arg);
		}

		static parse(scope,array){
			array = array.map((value)=>{
				if(!(value instanceof this.template)){
					value = this.template.handler.parse(scope,value);
				}
				return value._handler || value;
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
		return class Array extends base{

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
	methods:((Array)=>{
		var fnArg = {
			type:Function,
			required:true,
			args:(scope, args,argNames)=>{
				debugger
				return [new args[0].template(new HandlerOptions({
					scope,
					source:argNames[0],
					ref:args[0].ref.refs.template
				}))]
			}
		}
		return {
			atIndex:{
				return:(functionCall)=>{
					return new functionCall.statment.args[0].template(new HandlerOptions({
						source:functionCall
					}))
				},
				args:[
					Array,
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
					Array,
					fnArg
				]
			},
			find:{
				return:(functionCall)=>{
					return new functionCall.args[0].template(new HandlerOptions({
						source:functionCall,
						ref:functionCall.args[0].ref.refs.template
					}))
				},
				args:[
					Array,
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
					Array,
					fnArg
				]
			},
			map:{
				return:(functionCall)=>{
					debugger
					var rtrn = functionCall.args[1].source.scope.statements.find((statment)=>statment.functionCall.function.source.name  == 'return').functionCall.args[0];
					var array = functionCall.args[0];
					return array.clone({
						source:functionCall,
						type:rtrn
					})
				},
				args:[
					Array,
					fnArg
				]
			}
		}
	}),
})

module.exports = Array;