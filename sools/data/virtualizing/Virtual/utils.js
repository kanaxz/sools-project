module.exports = {
		load:(args, call, isHasMany)=>{
			var arg = args[0];	
			if(typeof(args[1]) == "object"){
				var options = args[1];
				if(args[2] === true && !arg._handler.ref.isLoaded){
					arg.load((models)=>{
						return models.forEach((model)=>{
							for(var associationName in options){
								model[associationName].load(options[associationName],true);
							}	
						})
					})
				}
				else{
					function inner(arg){
						for(var associationName in options){
							arg[associationName].load(options[associationName],true);
						}	
					}
					if(isHasMany){
						arg.forEach((model)=>{
							inner(model)
						})
					}	
					else{
						inner(arg);
					}
				}
				return arg;
			}
			else
				return call(arg,typeof(args[1]) == "function" ? args[1] : null)
		},
		include:(args, call, isHasMany )=>{
				var arg = args[0];	
				if(typeof(args[1]) == "object"){
					var options = args[1];
					function inner(arg){
						for(var associationName in options){
							var association = options[associationName];
							/**/
							if(typeof(association) == "object")
								arg[associationName].include();
							arg[associationName].include(association,true);
						}
					}
					function preLoad(arg){
						for(var associationName in options){
							if(typeof(options[associationName]) == "object"){
								arg[associationName].load(options[associationName],true);
							}
							else{
								if(!arg[associationName]._handler.ref.isLoaded)
									arg[associationName].load(options[associationName],true);
							}
							
						}
					}
					if(args[2] == null){
						preLoad(arg);
					}
					if(isHasMany){
						
						arg.forEach((model)=>{
							inner(model)
						})
						/**/	
					}
					else{
						inner(arg)
					} 
					return  arg;
				}
				else
					return call(arg)
		}
	
}