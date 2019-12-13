class UI {
	constructor(values){
		for(var propertyName in values){
			this[propertyName] = values[propertyName];
		}
	}
}

module.exports = UI;