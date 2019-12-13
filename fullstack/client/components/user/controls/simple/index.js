var Control = require("sools-ui/Control");

const sools = require("sools");
const Properties = require("sools-define/Properties");
const Definition = require("sools-ui/Definition");

require("./index.scss")
module.exports = sools.define(Control, (base) => {

    class SimpleUser extends base {
        constructor(user) {
            super();
            this.user = user;
        }
    }

    return SimpleUser;

}, [
    new Properties('user'),
    new Definition({
        name: "user-simple",
        template: require("./index.html")
    })
])