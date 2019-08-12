var Flow = require("./Flow");
const Dynamic = require("./Dynamic");
const arrayUtils = require("sools/Array/utils");
class Segment extends Flow {
    _process(methodName, scope, next) {
        return arrayUtils.chain(this.process, (process, next)=>{
            return process[methodName](scope, next);
        },()=>{
            return next()
        });
    }
}

module.exports = Flow