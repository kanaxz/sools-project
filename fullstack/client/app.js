const Scope = require("sools/processing/Scope");
const datas = require("./datas");
//const dataService = require("./components/data/service")
const navigator = require("./navigator");
const notifyService = require("./components/notify/service")
require("./momentConfig");
require("./components/form/selector")
require("sools-ui");
require("sools-ui/view");
require("./app.scss")
require("./generated.scss")
require("./components/notify");
require("./components/common")
require("./components/map")
require("./components/contextMenu")
require("./lang");
/**/
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
      event.promise.catch((err) => {
        notifyService.display({
          message: err,
          type: 'error'
        })
      })
    });
  },
  start: async function() {
    var root = document.getElementById("root");
    await datas.setup(new Scope())
    //await dataService.init();
   
    await root.start(this);
    //this.catchAllErrors();
    await this.navigator.start(this.presenter);
  }
}

window.global = window;
/**/
module.exports = app;