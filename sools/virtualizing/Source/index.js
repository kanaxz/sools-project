var id = 0;
module.exports = class Source {
	constructor(){
		//this.id = "source_" + id++;
	}

	toJSON(){
		throw new Error();
		return {}
		return DEBUG ? {id:this.id} : {}
	}
}