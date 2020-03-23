var path = "../../../virtualizing";
const Worker = require(path + "/Worker")
const HandlerOptions = require(path + "/Handler/Options")
const flag = Symbol('controlFlag');
const Reference = require(path+"/Handler/Reference")
const Virtuals = require("../Virtual/enum")
function checkFlag(scope){
	if(typeof(scope[flag]) == "boolean")
		return scope[flag]
	else if(scope.parent)
		return checkFlag(scope.parent);
	else 
		return false;
}

module.exports = class Controller extends Worker{
	constructor(controls){
		super();
		this.controls = controls;
	}

	onPropertyGet(property, datas, collection){
		if(datas instanceof Virtuals.datas){
			var control = this.controls[property.model.name]
			if(control && control.get){
				var scope = datas._handler.scope;
				if(checkFlag(scope))
					return
				scope[flag] = true;
				var context = scope.$.context;
				var saveRef = collection._handler.type.ref
				collection._handler.type.ref = new Reference();
				var result = control.get(context, collection,(models)=>models,scope.$);
				collection._handler = result._handler
				collection._handler.type.ref = saveRef;
				scope[flag] = false;
			}
		}
	}

	onFunctionCalled(scope, fn, args){
		
	}

	onCallingFunction(scope,fn,args){
		return
		if([Virtuals.model.methods.load,Virtuals.hasMany.methods.load].indexOf(fn) != -1){
			if(checkFlag(scope))
				return
			scope[flag] = true;
			var modelHandler;
			if(fn == Model.methods.load){
				modelHandler = args[0]._handler;
			}
			else{
				modelHandler = args[0]._handler.type;
			}
			
			if(!this.controls[modelHandler.typeName])
				return
			
			var control = this.controls[modelHandler.typeName].get
			if(!control)
				return
			var fn = args[1];
			args[1] = (models,$)=>{
				var subScope = $._private
				var originalType = models._handler.type;
				var controlType = models._handler.type.clone({
					ref:new Reference()
				})
				models = models._handler.clone({
					type:controlType
				})
				return control($.context, models,(models)=>{
					subScope[flag] = false;
					models = models._handler.clone({
						type:originalType
					})
					var result = (fn && fn(models,$) || models)._handler.clone({
						type:controlType
					})
					subScope[flag] = true;
					return result;
				},$)
			}
		}
		
	}
}