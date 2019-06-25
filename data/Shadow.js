class Shadow{
	constructor(type, values){
		this.type = type;
		this.values = values;
		for(var propertyName in values){
			this[propertyName] = values[propertyName];
		}
	}

	toJSON(){
		return this.type.toJSON(this.values);
	}
}

module.exports =Shadow