const sools = require("sools");
const Componentable = require("sools-define/Componentable");
const Process = require("sools-process/Process");
const Factory = require("sools/Factory");
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
