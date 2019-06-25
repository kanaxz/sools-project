const Index = require("./Index");
const sools = require("sools");
const Identity = require("sools-define/Identity");

module.exports = sools.define(Index, [Identity()], (base) => {
    class Unique extends base {

    }
    return Unique;
})