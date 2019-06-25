var Values = require("sools/Values");
var Propertiable = require("../Propertiable");
var Properties = require("../Properties");
var sools = require("sools");
const Event = require("sools/Event");
const rawMixin = require("sools/Array/rawMixin");
module.exports = sools.proxy([Propertiable()], (base, options) => {
    options = options || {};
    class Array extends rawMixin(base) {
        static define(args) {
            args.push(new Properties({
                content: Properties.types.array({
                    type: options.type,
                    transform: function(value) {
                        if (value)
                            return this.transform(value);
                    }
                })
            }))
            super.define(args);
        }

        constructor(content) {
            super();
            this.content = content || [];
            /*
            this.onIndexDeleted = new Event();
            this.onIndexSet = new Event();
            /**/
        }
        /*
        indexDeleted(...args) {

            super.indexDeleted(...args);
            this.onIndexDeleted.trigger(...args);
        }

        indexSet(...args) {
            super.indexSet(...args);
            this.onIndexSet.trigger(...args);
        }
        /**/

    }

    return Array;

})