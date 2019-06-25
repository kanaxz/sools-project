var Process = require('./Process')
var Context = require('./Context')

class Dispatcher extends Process {
	constructor(arraySourceType, process){
		super();
		this.arraySourceType = arraySourceType;
		this.process = process;
	}
	
	setup(context){

	}

	select(object){
		
	}	

	async execute(context){
		var arraySource = context.components.get(this.arraySourceType); 
		return await Promise.all(arraySource.map((object)=>{
			var childContext = context.child();
			childContext.components.push(object);
			var process = this.select(object); 
			return process.execute(childContext);
		}))
	}
}

module.exports = Dispatcher