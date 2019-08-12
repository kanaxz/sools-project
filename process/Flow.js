var Process = require("./Process");
const Dynamic = require("./Dynamic");
const arrayUtils = require("sools/Array/utils");
class Flow extends Process {
    constructor() {
        super();
        this.process = [];
    }

    _process(methodName, scope, next) {
        return arrayUtils.chain(this.process, (process, next)=>{
            return process[methodName](scope, next);
        },()=>{
            return Promise.resolve(0)
        }).then(next);
    }

    setup(scope, next) {
        return this._process("setup", scope, next);
    }

    execute(scope, next) {
        return this._process("execute", scope, next);
    }

    stop(scope, next) {
        return this._process("stop", scope, next);
    }

    then(process) {
        if(!(process instanceof Process))
            process  = new Dynamic(null, process);
        this.process.push(process);
        return (this);
    }
}

module.exports = Flow