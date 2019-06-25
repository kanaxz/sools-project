const Source = require("./Source");
const Process = require("sools-process/Process");

class MysqlProcess extends Process{
	constructor(options){
		super();
		this.source = new Source(options);
	}

	setup(context, next){
		return next();
	}
}