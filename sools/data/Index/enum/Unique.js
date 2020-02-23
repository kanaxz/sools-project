const Index = require("../index");
const sools = require("../../../sools");
const Identity = require("../../../propertying/identifying/Identity");

module.exports = sools.define(Index, [Identity()], (base) => {
    class Unique extends base {

    }
    return Unique;
})