const Virtualizing = require("../../index")
const Number = require("./Number");
const Handler = require("../../Handler");
const Source = require("../../Source")
const Property = require("../../Source/enum/Property")
const Reference = require("../../Handler/Reference")
const Virtual = require("../index")

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
					var value = hold[p]
					if(!(value instanceof Virtual))
						value = scope.parse([value]);
					this.virtual[p] = value
					this.ref.refs[p] = this.virtual[p]._handler.ref
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
			debugger
			options = options || {};
			var clone = super.clone(options);
			for(var p in this.virtual){
				clone[p] = this.virtual[p]._handler.clone({
					scope:options.scope,
					source: new Property({
						source:clone._handler,
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