var Process = require("sools-process/Process")
var Request = require('./Request')
class Route extends Process {
	constructor(params){
		super();
		this.source = params.source;
	}

	execute(context, next){
		var request = context.get(Request);
		var datas = this.source(context);
		request.res.json(datas);
		return super.execute(context, next);
	}
}

module.exports = Route;