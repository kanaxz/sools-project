var Control = require("sools-ui/Control");
var datas = require("datas");
var notifyService = require("components/notify/service");
require("./signin.scss")
const sools = require("sools");
const Definition = require("sools-ui/Definition");

module.exports = sools.define(Control, (base) => {

    class UserSignin extends base {
        constructor() {
            super();
            this.email = "";
            this.password = "";
        }

        submit() {
            var self = this;
            datas.users.login({
                    email: this.emailInput.value,
                    password: this.passwordInput.value
                })
                .then((user) => {
                    var event = new CustomEvent('success', {
                        bubbles: false,
                        cancelable: false,
                        detail: {
                            user: user
                        }
                    });
                    this.dispatchEvent(event);
                }).catch(err => {
                    notifyService.display({
                        message: err.message,
                        type: "error"
                    });
                })

        }

    }

    return UserSignin;

}, [
    new Definition({
        name: "user-signin",
        template: require("./signin.html")
    })
])