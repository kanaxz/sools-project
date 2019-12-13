var sools = require("../../../sools");

var Properties = require("../../../propertying/Properties");
var Type = require("../Type");
const Query = require("../");

module.exports = sools.define(Query, (base) => {
    class AddQuey extends base {
        constructor(values) {
            super();
            this.values = values;
        }

        setResult(result) {
            if (this.values instanceof Array) {
                this.result = result.map((r) => {
                    return this.modelType.build(r);
                })
            } else
                this.result = this.modelType.build(result);
        }
    }
    return AddQuey;
}, [
    new Properties('values'),
    new Type('add')
])