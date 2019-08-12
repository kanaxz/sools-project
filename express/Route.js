var Flow = require('sools-process/Flow');
var Scope = require('sools-process/Scope');
var Trigger = require("sools-process/Trigger")
var Request = require('./Request')
class Route extends Trigger {
	constructor(router, url){
		super();
		this.router = router;
		this.url = url;
	}

	setup(scope){
		this.bindCallback = (...args)=>{
			this.callback(...args)
		}
		this.router.post(this.url, this.bindCallback)
		return super.setup(scope);
	}
	
	callback(req, res){
		var request = new Request(req, res);
		var scope = new Scope();
		scope.push(request);
		this.execute(scope)
	}
}

module.exports = Route;