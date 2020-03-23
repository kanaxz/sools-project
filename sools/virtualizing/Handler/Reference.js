var id = 0;
module.exports = class Reference {
	constructor(options){
		this.id = id++
		this.refs = {};
		if(!options)
			return
		for(var p in options)
			this[p] = options[p]
	}
}