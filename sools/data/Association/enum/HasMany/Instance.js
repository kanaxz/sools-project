const sools = require("../../../../sools");
const Array = require("../../../../propertying/Array");
const Model = require("../../index");
module.exports = sools.define(Array.of(Model), (base) => {
    class HasMany extends base {
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

    return HasMany;
})