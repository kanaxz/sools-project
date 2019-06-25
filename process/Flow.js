var Process = require("./Process");
const Dynamic = require("./Dynamic");
const arrayUtils = require("sools/Array/utils");
class Flow extends Process {
    constructor() {
        super();
        this.process = [];
    }

    _process(methodName, context, next) {
        return arrayUtils.chain(this.process, (process, next)=>{
            return process[methodName](context, next);
        },()=>{
            return Promise.resolve(0)
        }).then(next);
    }

    setup(context, next) {
        return this._process("setup", context, next);
    }

    execute(context, next) {
        return this._process("execute", context, next);
    }

    stop(context, next) {
        return this._process("stop", context, next);
    }

    then(process) {
        if(!(process instanceof Process))
            process  = new Dynamic(null, process);
        this.process.push(process);
        return (this);
    }
}

module.exports = Flow