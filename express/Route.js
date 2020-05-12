var Scope = require('sools/processing/Scope');
var Trigger = require("sools/processing/Trigger")
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
		var scope = new Scope();
		scope.req = req;
		scope.res = res;
		this.execute(scope)
	}
}

module.exports = Route;