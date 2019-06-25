var Flow = require("./Flow");
const Dynamic = require("./Dynamic");
const arrayUtils = require("sools/Array/utils");
class Segment extends Flow {
    _process(methodName, context, next) {
        return arrayUtils.chain(this.process, (process, next)=>{
            return process[methodName](context, next);
        },()=>{
            return next()
        });
    }
}

module.exports = Flow