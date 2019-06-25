var Flow = require('sools-process/Flow');
var Context = require('sools-process/Context');
var Trigger = require("sools-process/Trigger")
var Request = require('./Request')
class Route extends Trigger {
	constructor(router, url){
		super();
		this.router = router;
		this.url = url;
	}

	setup(context){
		this.bindCallback = (...args)=>{
			this.callback(...args)
		}
		this.router.post(this.url, this.bindCallback)
		return super.setup(context);
	}
	
	callback(req, res){
		var request = new Request(req, res);
		var context = new Context();
		context.push(request);
		this.execute(context)
	}
}

module.exports = Route;