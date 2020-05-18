const Worker = require("../../../virtualizing/Worker")
const Virtuals = require("../Virtual/enum")
const Sources = require("../../../virtualizing/Source/enum")
const flag = Symbol('autoLoadFlag');

function scopeRelated(child, parent){
	var current = child;
	while(current){
		if(current == parent)
			return true
		current = current.parent;
	}
	return false;
}

module.exports = class AutoLoad extends Worker{
	constructor(){
		super();
		this.holds = [];
	}

	onPropertyGet(property,owner, virtual){

		if(virtual instanceof Virtuals.model || virtual instanceof Virtuals.hasMany){
			if(!virtual._handler.ref.isLoaded){				
				var existing = this.holds.findIndex((handler)=>handler.ref == virtual._handler.ref)
				if(existing == -1)
				this.holds.push(virtual._handler);
			}
		}	
		else if(owner instanceof Virtuals.model){
			if(property.name == "id"){
				var index = this.holds.indexOf(owner._handler)
				if(index != -1)
					this.holds.splice(index,1)
			}
		}	
	}

	onFunctionCalled(scope, functionCall){
		for(var i =0;i<this.holds.length;i++){
			var hold = this.holds[i]
			if(scopeRelated(hold.scope, scope)){
				console.log(functionCall.function.name)
				this.holds.splice(i--,1)
				if(!(['load','eq','unload'].indexOf(functionCall.function.name) != -1 && functionCall.args.find((arg)=>arg.ref == hold.ref))){
					if(hold.scope == scope){
						hold.virtual.constructor.methods.load.innerCall(scope,[hold.virtual],(functionCall)=>{
							scope.statements.splice(scope.statements.length - 1,0,functionCall)
						})
					}
					else{
						hold.virtual.load();		
					}
					
			 	}
			}
		}
	}
}