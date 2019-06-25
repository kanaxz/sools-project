const sools = require("sools")
const NotImplemented = require("sools/errors/NotImplemented");
module.exports = sools.mixin((base, store) => {

    class Storables extends base {

        constructor(...args) {
            super(...args);
            this.referenceCount = 0;
        }

        hold() {
            this.referenceCount++;
            if (this.referenceCount == 1) {
                store.holdStorables(this);
            }
        }

        release() {
            this.referenceCount--;
            if (this.referenceCount == 0) {
                store.holdStorables(this);
            }
        }
    }

    return Storables;
})