const sools = require("sools");
const Instances = require("sools-define/Instances");
const BuildOption = require("../BuildOption");
module.exports = sools.define([Instances(), BuildOption()], (base) => {
    class Store extends base {

        constructor(modelType) {
            super(modelType);
            this.storablesArray = [];
        }

        hold(model) {
            this.push(model);
        }

        release(model) {
            this.remove(model);
        }

        holdStorables(storables){
            this.storablesArray.push(storables);
            storables.forEach((storable)=>{
                storable.hold();
            })
        }

        releaseStorables(storables){
            var index = this.storablesArray.indexOf(storables);
            this.storablesArray.splice(index, 1);
            storables.forEach((storable)=>{
                storable.release();
            })   
        }
    }
    return Store;
})