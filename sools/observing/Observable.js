var sools = require("sools")
var Event = require("sools/Event");
module.exports = sools.mixin((base) => {

    class Observable extends base {
        constructor(...args) {
            super(...args);
            this.onPropertySet = new Event();
        }
    }

    return Observable;
})