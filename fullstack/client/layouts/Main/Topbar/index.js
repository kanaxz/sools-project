const sools = require("sools");
const Properties = require("sools/Propertiable/Properties");
const Definition = require("sools-ui/Definition")
const Control = require("sools-ui/Control");
var UI = require("../UI")
var navigator = require("navigator");
require("./Topbar.scss")
var authService = require("components/user/authService");
var notifyService = require("components/notify/service");

module.exports = sools.define(Control, (base) => {
    class TopBar extends base {
        constructor() {
            super();
            this.showFlyout = false;
        }

        logout() {
            userService.logout()
                .then(nop => {
                    navigator.navigate("home");
                }).catch(err => {
                    notifyService.display({
                        message: err.message,
                        type: "error"
                    });
                })
        }
    }

    return TopBar;
},[
	new Properties('showFlyout'),
	new Definition({
        constantes: {
            UI,
            authService
        },
        name: "main-top-bar",
        template: require("./Topbar.html")
    })
])