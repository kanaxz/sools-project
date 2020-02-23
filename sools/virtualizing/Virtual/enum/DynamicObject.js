const Virtualizing = require("../../index")
const Number = require("./Number");
const Handler = require("../../Handler");
const Source = require("../../Source")
const Property = require("../../Source/enum/Property")

module.exports = Virtualizing.defineType({
	name:'dynamicObject',
	handler:class Object extends Handler{
		constructor(options){
			var source = options.source;
			var scope  = options.scope;
			var hold;
			var isResult =  false;
			if(!(source  instanceof Source) && typeof(source) == "object"){
				hold = source;
				source = null;
				isResult = true;
			}
			super({scope,source,virtual:options.virtual});
			if(hold){
				for(var p in hold){
					this.virtual[p] = scope.parse(hold[p]);
				}
			}
			this.isResult = isResult;
		}

		process(){
			for(var p in this.virtual){
				this.virtual[p]._handler.process();
			}
			return this;
		}

		clone(options){
			options = options || {};
			var clone = super.clone(options);
			for(var p in this.virtual){
				clone[p] = this.virtual[p]._handler.clone({
					scope:options.scope,
					source: new Property({
						source:clone,
						path:p
					})
				});
			}
			return clone;
		}

		toJSON(){
			if(!this.isResult)
				return super.toJSON()
			var result = {};
			for(var p in this.virtual){
				result[p] = this.virtual[p]._handler.toJSON()
			}
			return result;
		}

		static cast(arg){
			return typeof(arg) == "object"; 
		}

		static build(scope,object){
			var source = {};
			for(var p in object)
				source[p] = Virtual.rootBuild(scope,object[p]);
			return new this.Virtual({scope,source});
		}
	}
})