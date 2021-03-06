const Function = require("./Function")
module.exports = class Method extends Function {
	constructor(options){
		var save

		if(options.args && !(options.args instanceof Array)){
			save = options.args;
			delete options.args
		}
		super(options)
		this.save = save;
	}


	getArgs(args){
		if(this.save)
			return Function.processArgs(this.save(args[0].constructor,args))
		else
			return super.getArgs(args);
	}


	toJSON(){
		return `${this.type.typeName}.${this.name}`
	}
} 