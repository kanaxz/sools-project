const Function = require("./Function")
module.exports = class Method extends Function {

	toJSON(){
		return `${this.type.typeName}.${this.name}`
	}

	call(handler,args){
		args.unshift(handler.virtual)
		return super.call(handler.scope,args);
	}
}