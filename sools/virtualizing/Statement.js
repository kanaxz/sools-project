var id = 0;
module.exports = class Statment{
	constructor(functionCall){
		this.functionCall = functionCall
	}

	toJSON(){
		return this.functionCall.toJSON();
	}

	static build(scope,statment){
		var args = [];
		if(statment.type  ==  "functionCall"){
			var split = statment.function.split(".");
			var method = scope.env.description.types[split[0]].methods[split[1]];
			var argTypes = method.args;
			argTypes.forEach((argType,index)=>{
				var arg = (()=>{
					var arg = statment.args[index];					

					if(argType.type == "function"){
						
						var child = scope.child();
						child.argNames = arg.argNames;
						var functionArgs = argType.args(child,args,child.argNames);
						
						for(var childStatment of arg.statments){
							child.statments.push(Statment.build(child,childStatment))
						}
						return child;
					}
					else{
						
						arg = Statment.virtual.rootBuild(scope,arg);
						var type = scope.env.description.types[argType.type]
						if(!(arg instanceof type.class) && !type.class.cast(arg))
							throw new Error();
						return arg;
					}
				})()
				args.push(arg);
			})
		}
		else{
			args = statment.args.map((arg)=>{
				return Statment.virtual.rootBuild(scope,arg);
			})
		}
		
		
		return new this({
			...statment,
			_scope:scope,
			args
		})
	}
}