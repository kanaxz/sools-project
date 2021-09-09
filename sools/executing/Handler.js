module.exports = class Handler {
	constructor(){

	}

	processFunctionCall(scope,processFunctionCall,next){
		return next();
	}

	start(source){
		this.source = source;
	}

	init(){
		
	}

	stop(){
		
	}
}