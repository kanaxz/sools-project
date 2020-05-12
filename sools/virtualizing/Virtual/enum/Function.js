const Virtualizing = require("../../index");
const Base = require("./Base");
const DynamicFunction = require("../../Source/enum/DynamicFunction")
const Function = require("../../Source/enum/Function")
const FunctionCall = require("../../Source/enum/FunctionCall")
const HandlerOptions = require("../../Handler/Options")
const Handler = require("../../Handler")
const Return = require("../../functions/Return")
const Builder  = require("../../Builder")
const FunctionArg = require("../../Source/enum/FunctionArg")



const VirtualFunction =  Virtualizing.defineType({
	name:'function',
	extends:Base,
	class:(base)=>{
		class VFunction extends base {

			constructor(...args){
				var options
				if(args[0] instanceof HandlerOptions){
					options = args[0];
					if(options.source instanceof Array)
						options.source = new DynamicFunction({
							scope:options.scope,
							args:options.source[0],
							fn:options.source[1]
						})
				}
				else{
					var scope = args[0];
					options = new HandlerOptions({
						scope:scope,
						source:new DynamicFunction({
							scope,
							args:args[1],
							fn:args[2]
						})
					})
				}
				super(options);
			}

			calleable(){
				return this.source.calleable()
			}
		}

		return VFunction
	},
	handler:class Function extends Base.handler{
		static cast(args, fn){
			return typeof(fn) == "function"
		}

		static parse(scope, args,fn){
			return new this.virtual(scope,args,fn)
		}

		static buildArg(scope,args, arg, argDescription){
			var dynamicFunction;
			if(typeof(arg) == "function"){
				dynamicFunction = new DynamicFunction({
					scope, 
					fn:arg,
					args:(child, sources)=>{
					return argDescription.args 
						&& argDescription.args(child,args,sources) 
						|| []
					}
				})
			}
			else if(typeof(arg) == "object" && arg.argNames && arg.statements){
				var child = scope.child();
				dynamicFunction = new DynamicFunction(child);
				var args;
				if(typeof(argDescription.args) == "function"){
					args = argDescription.args(child,args,arg.argNames.map((argName)=>{
						return new FunctionArg(argName,dynamicFunction)
					}))
				}
				else
					args = argDescription.args || []
				for(var statement of arg.statements){
					Builder.functionCall(child,statement)
				}
				child.args = args.map((arg=>arg._handler || arg));
			}

			return new this.virtual(new HandlerOptions({
				scope,
				source:dynamicFunction
			}));	
			
		}
	}
})

Handler.function = VirtualFunction;
Function.virtual = VirtualFunction;
module.exports = VirtualFunction;