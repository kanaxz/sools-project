var Process = require("sools/processing/Process")

class Route extends Process {
	constructor(source){
		super();
		this.source = source;
	}

	async execute(scope, next){
		console.log("res");
		
		try{
			await super.execute(scope, next);
			console.log("here1")	
			var datas = this.source(scope);
			scope.res.json(datas || null);
		}
		catch(e){
			console.log("here2",e)	
			scope.res.status(500).send(e.message);
		}
		
	}
}

module.exports = Route;