const Virtualizing = require("../../index");
const Base = require("./Base");
const DynamicFunction = require("../../Source/enum/DynamicFunction")
const Function = require("../../Source/enum/Function")
const HandlerOptions = require("../../Handler/Options")


const VirtualFunction =  Virtualizing.defineType({
	name:'function',
	extends:Base,
	class:(base)=>{
		return class Function extends base {
			constructor(...args){
				var options
				if(args[0] instanceof HandlerOptions){
					options = args[0];
					if(options.source instanceof Array)
						options.source = new DynamicFunction(options.scope,options.source[0],options.source[1])
				}
				else{
					var scope = args[0];
					options = new HandlerOptions({
						scope:scope,
						source:new DynamicFunction(scope,args[1],args[2])
					})
				}
				super(options);
			}
		}
	},
	handler:class Function extends Base.handler{
		static cast(args, fn){
			return typeof(fn) == "function"
		}

		static parse(scope, args,fn){
			return new this.virtual(scope,args,fn)
		}

		static buildArg(scope,args, fn, argDescription){
			
			return new this.virtual(new HandlerOptions({
				scope,
				source:new DynamicFunction(scope, (child, sources)=>{
					return argDescription.args 
						&& argDescription.args(child,args,sources) 
						|| []
				},fn)
			}));
		}
	}
})

Function.virtual = VirtualFunction;
module.exports = VirtualFunction;