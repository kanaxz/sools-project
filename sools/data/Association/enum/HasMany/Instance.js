const sools = require("../../../../sools");
const Array = require("../../../../Array");
const Model = require("../../index");
module.exports = class HasMany extends Array {
        constructor(property) {
            super();
            this.property = property;
            this.isLoaded = false;
        }
        
        get modelType() {
            return this.property.type;
        }

        async load(){
            //this.datas.execute()
        }

        attach(model) {
            this.model = model;
            this.datas = model.datas;
        }
    }
    /*
module.exports = sools.define(Array.of(Model), (base) => {
    

    return HasMany;
})
/**/