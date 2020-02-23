const Virtualizing = require("../../index")
const Number = require("./Number");
const Handler = require("../../Handler");
const Scope = require("../../Scope")
const utils = require("../../utils")

module.exports = Virtualizing.defineType({
	name:'array',
	handler: class Array extends Handler {
		constructor(options){						
			super(options);
			this.type = options.type;
			if(!this.type){
				debugger
			}
			else if(this.type._handler)
				this.type = this.type._handler
		}

		clone(options){
			options = options || {}
			if(!options.type)
				options.type = this.type;
			return super.clone(options);
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
						debugger
						done++;
						if(done == 0)
							scope.parent._child = null;
						return {value:object,done:done == 1}
					}
				}
			}
		}
	},
	properties:{
		length:{
			type:Number,
			set:false
		}
	},
	methods:((Array)=>{
		var fnArg = {
			type:'function',
			args:(scope, args,argNames)=>([
				args[0].type.clone({scope,source:argNames[0]})
			])
		}
		return {
			atIndex:{
				return:(functionCall)=>{
					return  functionCall.statment.args[0].type.clone({
						source:functionCall
					})
				},
				args:[
					Array,
					Number
				]
			},
			filter:{
				return:(functionCall)=>{
					var array = functionCall.statment.args[0];
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
					return  functionCall.statment.args[0].type.clone({
						source:functionCall
					})
				},
				args:[
					Array,
					fnArg
				]
			},
			forEach:{
				args:[
					Array,
					fnArg
				]
			},
			map:{
				return:(functionCall)=>{
					var rtrn = functionCall.statment.args[1].statments.find((statment)=>statment.type  == 'return').args[0];
					var array = functionCall.statment.args[0];
					return array.clone({
						source:functionCall,
						type:rtrn
					})
				},
				args:[
					Array,
					fnArg
				]
			},
			test:{
				return:(source)=>{
					return statment.args[0].clone({source})
				},
				args:[Array]
			}
		}
	}),
})