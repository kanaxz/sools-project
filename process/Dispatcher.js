var Process = require('./Process')
var Scope = require('./Scope')

class Dispatcher extends Process {
	constructor(arraySourceType, process){
		super();
		this.arraySourceType = arraySourceType;
		this.process = process;
	}
	
	setup(scope){

	}

	select(object){
		
	}	

	async execute(scope){
		var arraySource = scope.components.get(this.arraySourceType); 
		return await Promise.all(arraySource.map((object)=>{
			var childScope = scope.child();
			childScope.components.push(object);
			var process = this.select(object); 
			return process.execute(childScope);
		}))
	}
}

module.exports = Dispatcher