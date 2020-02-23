const Env = require("../virtualizing/Env")
const VScope = require("../virtualizing/Scope")
const Virtualizing = require("../virtualizing");
const Flow =require("../processing/Flow")
const Model = require("./Model")
const HandlerOptions = require("../virtualizing/Handler/Options")
const Scope = require("../processing/Scope")
const Context = require("./Context");
const ModelHandler = require("./executing/Model")
const Virtuals = require("./virtualizing/Virtual/enum/")

module.exports = class Datas extends Flow {
    constructor(options) {
        super();
        this.models = options.models;
        this.source = options.source;
        this.executor = options.executor;
        this.env = new Env({
            workers:options.virtualization,
            initFn:($)=>{
                var datas = new this.vDatas(new HandlerOptions({
                    source:'datas',
                    scope:$._private
                }));
                var context = new this.context.virtual(new HandlerOptions({
                    source:'context',
                    scope:$._private
                }))
            }
        })
        var datasProperties = {};
        for(var modelName in this.models){
            var model = this.models[modelName];
             datasProperties[model.pluralName] = {
                type:Virtuals.collection,
                model:model
            }
        }
        this.vDatas = Virtualizing.defineType({
            name:'datas',
            extends:Virtuals.datas,
            properties:datasProperties
        })
    }

    async setup(scope, next) {
        this.context = Context;
        scope.context = this.context;
        scope.datas = this;
        return super.setup(scope, next);
    }

    async parse(string){

    }

    async execute(arg1,arg2){
        if(arg1 instanceof Context.type){
            var vscope = this.env.process(arg2)
            console.log(JSON.stringify(vscope,null," "));
            var scope = new Scope();
            scope.context = arg1
            scope.scope = vscope;
            return await this.execute(scope,()=>{});    
        }
        else
            return super.execute(arg1,arg2)
    } 
}

