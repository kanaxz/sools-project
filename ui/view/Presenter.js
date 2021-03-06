const sools = require("sools");
var Control = require("../Control");
var View = require("./View");
var renderer = require("../render/renderer")
const Definition = require("../Definition");
require("./Presenter.scss")

module.exports = sools.define(Control, (base) => {
  class Presenter extends base {

    constructor() {
      super();
      this.currentLayout = null;
      this.currentView = null;

      // singleton
      if (this.constructor.current)
        throw new Error("There can only have one instance of presenter");
      this.constructor.current = this;
    }

    async redirect(viewName, params) {
      if (this.redirecting(viewName, params)) {
        var viewClass = View.resolve(viewName);
        var viewInstance = new viewClass(params);
        await this.display(viewInstance)
        await this.viewChanged(viewInstance);
      }
    }

    redirecting(viewName, params) {
      var event = new CustomEvent('redirecting', {
        'bubbles': false,
        'cancelable': true,
        detail: {
          viewName: viewName,
          params: params
        }
      });
      return this.dispatchEvent(event);
    }

    linkChanged(link) {
      var event = new CustomEvent('linkChanged', {
        'bubbles': false,
        'cancelable': true,
        'detail': {
          link: link
        }
      });
      this.dispatchEvent(event);
    }

    setLayout(layout) {
      if (this.currentLayout) {
        this.removeChild(this.currentLayout);
        renderer.destroy(this.currentLayout);
      }
      this.currentLayout = layout;
      this.appendChild(this.currentLayout);
      return this.currentLayout.attach(this);
    }

    async display(viewInstance, layoutClass) {
      var oldLayout;
      var oldView;
      layoutClass = layoutClass || viewInstance.constructor.definition.layout;
      if (!(this.currentLayout instanceof layoutClass)) {
        await this.setLayout(new layoutClass());
      }
      await this.currentLayout.setView(viewInstance);
    }
  }

  return Presenter;
}, [
  new Definition({
    name: 'ui-presenter'
  })
])