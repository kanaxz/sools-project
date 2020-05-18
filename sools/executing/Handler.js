module.exports = class Handler {
	constructor(){

	}

	processFunctionCall(scope,processFunctionCall,next){
		return next();
	}

	setup(source){
		this.source = source;
	}

	init(){
		
	}

	stop(){
		
	}
}