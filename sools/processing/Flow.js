var Process = require("./Process");
const Dynamic = require("./Dynamic");
const arrayUtils = require("../Array/utils");
class Flow extends Process {
    constructor() {
        super();
        this.processArray = [];
    }

    async _process(methodName, scope) {
        return await arrayUtils.chain(this.processArray, (process, next)=>{
            return process[methodName](scope, next);
        },()=>{
            return Promise.resolve(0)
        })
    }

    async setup(scope, next) {
        await this._process("setup", scope, next);
        return next();
    }

    async execute(scope, next) {
        await this._process("execute", scope, next);
        return next();
    }

    async stop(scope, next) {
        await this._process("stop", scope, next);
        return next();
    }

    then(process) {
        if(!(process instanceof Process)){
            if(typeof(process) == "object"){
                process = new Dynamic(process);  
            }
            else if(typeof(process) == "function"){
                process = new Dynamic({
                    execute:process
                });    
            }
            
        }
        this.processArray.push(process);
        return (this);
    }
}

module.exports = Flow