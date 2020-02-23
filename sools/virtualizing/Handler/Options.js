module.exports =  class HandlerOptions{
	constructor(values){
		for(var p in  values)
			this[p] = values[p]
	}
}