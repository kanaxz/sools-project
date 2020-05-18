const Virtual = require("../Virtual");
const Error = require('../Virtual/enum/Error')
const Function = require("../Source/enum/Function")
const HandlerOptions = require("../Handler/Options")
const Boolean = require("../Virtual/enum/Boolean")
const VirtualFunction =require("../Virtual/enum/Function")
const Array = require("../Virtual/enum/Array")
const Number = require("../Virtual/enum/Number")
const String = require("../Virtual/enum/String")
const Object = require("../Virtual/enum/Object")
const Type = require("../Virtual/enum/Type");
const Property = require("../Source/enum/Property")

var functions = {
	or:new Function({
		name:'or',
		jsCall:(args,call)=>{
			return call(args);
		},
		return:(functionCall)=>{
			return new Virtual(new HandlerOptions({
				source:functionCall
			}))
		},
		args:[
			Array.of(Virtual)
		]
	}),
	cast:new Function({
		name:'cast',
		return:(functionCall)=>{
			return new functionCall.args[0].source(new HandlerOptions({
				source:functionCall
			}))
		},
		args:[
			Type,
			Virtual
		]
	}),
	get:new Function({
		name:'get',
		return:(functionCall)=>{
			return new Virtual(new HandlerOptions({
				source:functionCall
			}))
		},
		args:[
			Virtual,
			String
		]
	}),
	forIn:new Function({
		name:'forin',
		args:[Virtual,{
			type:VirtualFunction,
			required:true,
			args:(scope, args,argNames)=>{
				return [new String(new HandlerOptions({
					scope,
					source:argNames[0]
				}))]
			}
		}]
	}),
	throw:new Function({
		name:'throw',
		args:[Error]
	}),
	not:new Function({
		name:'not',
		args:[Virtual],
		return:(functionCall)=>{
			return new Boolean(new HandlerOptions({
				source:functionCall
			}))
		},
	}),
	log:new Function({
		name:'log',
		jsCall:(args,call)=>{
			call(args)
		},
		return:(functionCall)=>{
			return functionCall.args[0].clone({
				source:functionCall
			})
		},
		args:[Array.of(Virtual)]
	}),
	if:new Function({
		name:'if',
		args:[Virtual,{
			type:VirtualFunction,
			required:true
		}]
	}),
	elseif:new Function({
		name:'elseif',
		args:[Virtual,{
			type:VirtualFunction,
			required:true
		}]
	}),
	else:new Function({
		name:'else',
		args:[{
			type:VirtualFunction,
			required:true
		}]
	}),
	delete:new Function({
		jsCall:(args,call)=>{
			if(args.length == 1){
				if(!(args[0]._handler.source instanceof Property))
					throw new Error();
				args = [
					args[0]._handler.source.source,
					args[0]._handler.source.path
				]
			}
			return call(...args)
		},
		name:'delete',
		args:[Virtual,String]
	}),
	assign:require("./Set"),
	return:require("./Return"),
	declare:require("./Declare"),
	instanceof:new Function({
		name:'instanceof',
		args:[Virtual,Virtual]
	}),
	findByUpperCase(name){
		for(var fn in this)
			if(fn.toUpperCase() == name)
				return this[fn];
	}
}

for(var fnName in  functions){
	if(!(functions[fnName] instanceof Function))
		continue
	global[fnName.toUpperCase()] = functions[fnName].calleable()
}

module.exports = functions;