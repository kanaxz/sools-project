const Source =  require("../index");
module.exports = class FunctionCall extends Source {
	constructor(values){
		super();
		for(var p in values){
			this[p] = values[p];
		}
		if(this.function._handler)
			this.function = this.function._handler
		if(this.args)
			this.setArgs(this.args);
	}

	setArgs(args){
		this.args = args.map((arg)=>(arg && arg._handler) || arg)
	}

	toJSON(){
		return {
			...super.toJSON(),
			function:this.function.toJSON(),
			args:this.args.map((arg)=>{
				return arg.toJSON && arg.toJSON() || arg
			})};
	}
}