const sools = require("sools");
const Definition = require("sools-ui/Definition");
const Properties = require("sools-define/Properties");
const Field = require("../Field")
require("./index.scss");

module.exports = sools.define(Field, (base) => {
    class HasManyField extends base {

    }
    return HasManyField
}, [
    new Definition({
        name: "has-many-field",
        template: require("./index.html")
    })
])