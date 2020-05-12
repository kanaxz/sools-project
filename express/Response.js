var Process = require("sools/processing/Process")
var Request = require('./Request')
class Route extends Process {
	constructor(params){
		super();
		this.source = params.source;
	}

	execute(scope, next){
		var request = scope.get(Request);
		var datas = this.source(scope);
		request.res.json(datas);
		return super.execute(scope, next);
	}
}

module.exports = Route;