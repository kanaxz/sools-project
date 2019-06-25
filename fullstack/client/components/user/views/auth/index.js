require("../../controls/signin")
require("../../controls/signup")
require("./auth.scss");
const sools = require("sools");
const View = require("sools-ui/view/View");
const Definition = require("sools-ui/view/Definition");

const EmptyLayout = require("layouts/Empty")
const notifyService = require("components/notify/service")
const navigator = require("navigator");

module.exports = sools.define(View, (base) => {
    class AuthView extends base {
        land(e) {
            return navigator.home()
                .then(() => {
                    notifyService.display({
                        message: "Welcome back " + e.detail.user.email + "!",
                        type: "success"
                    })
                })
        }
    }
    return AuthView;
}, [
    new Definition({
        layout: EmptyLayout,
        name: "view-auth",
        template: require("./auth.html")
    })
])