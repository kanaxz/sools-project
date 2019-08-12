const sools = require("sools");
const Instances = require("sools-define/Instances");
const BuildOption = require("../BuildOption");
module.exports = sools.define([Instances(), BuildOption()], (base) => {
    class Store extends base {

        constructor(modelType) {
            super(modelType);
            this.storablesArray = [];
        }

        hold(arg) {
            if(arg instanceof Model)
                this.push(model);
            else{
                this.storablesArray.push(arg);
                arg.forEach((storable)=>{
                    storable.hold();
                })
            }
        }

        release(arg) {
            if(arg instanceof Model)
                this.remove(arg);
            else{
                var index = this.storablesArray.indexOf(arg);
                this.storablesArray.splice(index, 1);
                arg.forEach((storable)=>{
                    storable.release();
                })   
            }
        }

    }
    return Store;
})