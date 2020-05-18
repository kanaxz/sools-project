var utils = {
		load:(args, call, isHasMany)=>{
			var arg = args[0];	
			if(typeof(args[1]) == "object"){
				var options = args[1];
				if(args[2] === true && !arg._handler.ref.isLoaded){
					arg.load((models)=>{
						models.forEach((model)=>{
							for(var associationName in options){
								if(!model[associationName])
									debugger
								model[associationName].load(options[associationName],true);
							}	
						})
						return models
					})
				}
				else{
					function inner(arg){
						for(var associationName in options){
							if(!arg[associationName])
								debugger
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
			else if(typeof(args[1]) == "boolean"){
				if(!args[0]._handler.ref.isLoaded)
					return call(args[0])
			}
			else{
				return call(arg,typeof(args[1]) == "function" ? args[1] : null)
			}
		},
		unload:(args, call )=>{
				var arg = args[0];	
				if(typeof(args[1]) == "object"){
					var options = args[1];
					function inner(arg){
						for(var propertyName in arg.constructor.properties){
							var property = arg.constructor.properties[propertyName]
							if(property.type.prototype instanceof utils.model || property.type.prototype instanceof utils.hasMany){
								if(typeof(options[propertyName]) == "undefined"){
									if(arg._handler.ref.refs[propertyName] && arg._handler.ref.refs[propertyName].isLoaded)
										arg[propertyName].unload()
								}
								else{
									if(typeof(options[propertyName]) == "object")
										arg[propertyName].unload(options[propertyName],true)
									else {
										arg[propertyName].unload({})
									}
								}
							}
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
					if(arg instanceof utils.hasMany){
						
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
				else{
					function processChilds(ref){
						if(ref.isLoaded)
							ref.isLoaded = false;
						for(var p in ref){
							
							if(typeof(ref[p]) == "object"){
								processChilds(ref[p]);
							}
						}
					}
					processChilds(arg._handler.ref)
					return call(arg)
				}
		}
	
}

module.exports = utils;