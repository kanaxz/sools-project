const sools = require("sools")
const Store = require("./Store");
const Model = require("../Model");
const Uniqueable = require("sools-define/Uniqueable");
module.exports = sools.mixin([Uniqueable({
    cache: false,
    merge:true,
    build: {
        cache:true
    }
})], (base) => {

    class Storable extends base {

        constructor(...args) {
            super(...args);
            this.referenceCount = 0;
        }

        attach(modelInterface){
            super.attach(modelInterface);
            this.store = modelInterface.components.get(Store);
        }

        hold() {
            if (!this.isAttached)
                throw new Error("");
            this.referenceCount++;
            if (this.referenceCount == 1) {
                this.store.hold(this);
            }
        }

        release() {
            if (!this.isAttached)
                throw new Error("");
            this.referenceCount--;
            if (this.referenceCount == 0) {
                this.store.release(this);
            }
        }
    }

    return Storable;
})