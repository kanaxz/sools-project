const Virtualizing = require("../index")
const Virtual = require("../Virtual");
const Error = require('../Virtual/enum/Error')
const Function = require("./index")

var functions = {
	throw:Virtualizing.defineFunction('throw',{
		args:[Error]
	}),
	not:Virtualizing.defineFunction('not',{
		args:[Virtual]
	}),
	if:Virtualizing.defineFunction('if',{
		args:[Virtual,'function']
	}),
	elseif:Virtualizing.defineFunction('elseif',{
		args:[Virtual,'function']
	}),
	else:Virtualizing.defineFunction('else',{
		args:['function']
	}),
	delete:Virtualizing.defineFunction('delete',{
		args:[Virtual]
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