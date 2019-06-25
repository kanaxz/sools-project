class Request {
	constructor(xhr){
		this.xhr = xhr || new XMLHttpRequest();
	}
}

module.exports = Request;