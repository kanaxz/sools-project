const Virtual = require("../Virtual");
const Error = require('../Virtual/enum/Error')
const Function = require("../Source/enum/Function")
const HandlerOptions = require("../Handler/Options")
const Boolean = require("../Virtual/enum/Boolean")
const VirtualFunction =require("../Virtual/enum/Function")
var functions = {
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
	if:new Function({
		name:'if',
		args:[Virtual,VirtualFunction]
	}),
	elseif:new Function({
		name:'elseif',
		args:[Virtual,VirtualFunction]
	}),
	else:new Function({
		name:'else',
		args:[VirtualFunction]
	}),
	delete:new Function({
		name:'delete',
		args:[Virtual]
	}),
	assignment:require("./Assignment"),
	return:new Function({
		name:'return',
		args:[Virtual]
	}),
	instanceof:new Function({
		name:'instanceof',
		args:[Virtual,Virtual]
	}),
	findByUpperCase:(name)=>{
		for(var fn in functions)
			if(fn.toUpperCase() == name)
				return functions[fn];
	}
}

for(var fnName in  functions){
	if(!(functions[fnName] instanceof Function))
		continue
	global[fnName.toUpperCase()] = functions[fnName].buildWrapper()
}

module.exports = functions;