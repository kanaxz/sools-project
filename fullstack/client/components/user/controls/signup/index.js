var Control = require("sools-ui/Control");
var datas = require("datas");
var notifyService = require("components/notify/service");
const authService = require("../../authService")
require("./signup.scss")
const sools = require("sools");
const Definition = require("sools-ui/Definition");

module.exports = sools.define(Control, (base) => {

class UserSignup extends base {
	constructor() {
		super();
		this.email = "";
		this.password = "";
	}

	submit() {
		var self = this;
		console.log("signup")
		authService.signup({
			email: this.emailInput.value,
			password: this.passwordInput.value
		}).then(user => {
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

    return UserSignup;

}, [
    new Definition({
        name: "user-signup",
        template: require("./signup.html")
    })
])