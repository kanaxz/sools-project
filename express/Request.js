class Request {
	constructor(req, res){
		this.req = req;
		this.res = res;
		this.body = req.body;
	}

	respond(result){

	}
}

module.exports = Request;