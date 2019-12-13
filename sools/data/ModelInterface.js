const sools = require("../sools");
const Componentable = require("../composing/Componentable");
const Process = require("../processing/Process");
const Factory = require("../Factory");
module.exports = sools.define([Componentable()],(base) => {
    class ModelInterface extends base {
        constructor(modelInterfaces, modelType) {
            super();
            this.modelInterfaces = modelInterfaces;
            this.modelType = modelType;
            this.modelsFactory = new Factory();
        }
    }

    return ModelInterface;
}) 
