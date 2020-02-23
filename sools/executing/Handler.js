module.exports = class Handler {
	constructor(){

	}

	canProcessFunctionCall(){
		return false;
	}

	canProcessArg(){
		return  false;
	}

	setup(source){
		this.source = source;
	}

	stop(){
		
	}
}