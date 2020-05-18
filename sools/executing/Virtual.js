module.exports = class Virtual {
	getValue(){
		return this;
	}

	getProperty(){
		throw new Error();
	}
}