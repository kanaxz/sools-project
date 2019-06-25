const sools = require("sools");
const It = require("../It");
const Properties = require("sools-define/Properties")

module.exports = sools.define(It, (base) => {
    class ArrayIt extends base {

    }

    return ArrayIt;
}, [
    new Properties('index')
])