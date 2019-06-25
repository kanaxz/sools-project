class RequestError extends Error {
	constructor(xhr) {
		super("Request error :" + xhr.responseText);
		this.xhr = xhr;
	}
}

function ajax(params) {
	return new Promise((resolve, reject) => {
		if (!params)
			throw new Error('Parameters required')
		params.type = params.type || "GET";

		var xhr;
		if(params.xhr){
			if(params.xhr instanceof XMLHttpRequest)
				xhr = params.xhr;
			else
				xhr = params.xhr();
		}
		else
			xhr = new XMLHttpRequest();
		

		xhr.onerror = function() {
			reject(new RequestError(xhr));
		};
		xhr.onload = function() {
			if (xhr.status == 200)
				resolve(xhr);
			else
				reject(new RequestError(xhr));
		};

		xhr.open(params.type, params.url);
		//xhr.withCredentials = true;
		if (params.contentType !== false) {
			xhr.setRequestHeader("Content-Type", params.contentType || "application/json");
		}

		var datas = params.datas;
		if (params.hasOwnProperty("processDatas") ? params.processDatas : true && params.datas)
			datas = JSON.stringify(params.datas);
		xhr.send(datas);

	});
}
ajax.RequestError = RequestError;
module.exports = ajax;