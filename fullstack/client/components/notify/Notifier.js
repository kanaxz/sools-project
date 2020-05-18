const sools = require("sools");
const Definition = require("sools-ui/Definition");
const Control = require("sools-ui/Control");
const notifyService = require("./service");
const Array = require("sools/Array")
const Notification = require("./Notification");
require("./Notifier.scss")

module.exports = sools.define(Control, (base) => {
  class Notifier extends base {
    constructor() {
      super();
      this.notifications = new Array();
      notifyService.connect(this);
    }

    display(options) {
      var notif = new Notification(options);
      this.notifications.push(notif);
      setTimeout(function() {
        this.removeNotification(notif)
      }.bind(this), options.duration || 5000);
      return (notif);
    }

    templateFunction(notification) {
      return notification.template ? notification.template : this.defaultTemplate;
    }

    removeNotification(notification) {
      notification.removing = true;
      setTimeout(function() {
        this.notifications.remove(notification)
      }.bind(this), 500);

    }
  }

  return Notifier;
}, [
  new Definition({
    name: "app-notifier",
    template: require("./Notifier.html")
  })
])