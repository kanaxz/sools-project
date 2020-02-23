var sools = require("../sools");

class Scope  {
	
}

var proxy = new Proxy(Scope,{
	construct(target,args){
		return new Proxy(new Scope(),{
			get(scope,property){
				if(scope[property])
					return scope[property]
				else if(scope.parent)
					return scope.parent[property];
			}
		})
	}
})


module.exports = proxy;
