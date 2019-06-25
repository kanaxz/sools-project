const Context = require("sools-process/Context");
const datas = require("./datas");
const navigator = require("./navigator");
const notifyService = require("./components/notify/service")


require("sools-ui");
require("sools-ui/view");
require("./app.scss")
require("./components/datas");
require("./components/notify");
require("./components/common")
require("./components/user")
require("./components/contextMenu")
require("./lang");
const sools = require("sools");
const Array = require("sools-define/Array");
wait = (duration) => {
    return function() {
        return new Promise((resolve) => {
            setTimeout(resolve, duration || 1500)
        })
    }
}

var app = {
    navigator: navigator,
    catchAllErrors: function() {
        window.addEventListener('unhandledrejection', function(event) {
            event.detail.promise.catch((err) => {
                notifyService.display({
                    message: err,
                    type: 'error'
                })
                console.error(err);
            })
        });
    },
    start: function() {
        var root = document.getElementById("root");
        var setup = new Context();
        return datas.setup(setup)
            .then((users) => {
                return root.start(this);
            })
            .then(() => {
                this.catchAllErrors();
                return this.navigator.start(this.presenter);
            })
    }
}

module.exports = app;