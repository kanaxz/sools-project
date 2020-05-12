var id = 0;
module.exports = class Source {
	constructor(){
		//this.id = "source_" + id++;
	}

	toJSON(){
		return {}
		return DEBUG ? {id:this.id} : {}
	}
}