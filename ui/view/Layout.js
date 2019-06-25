var Control = require("../Control");
class Layout extends Control {

    initialized() {
        if (!this.container)
            throw new Error("Layout '" + this.constructor.name + "' must implement a container");
        return super.initialized();

    }

    setView(view) {
        if (this.currentView) {
            this.container.removeChild(this.currentView);
            renderer.destroy(this.currentView);
        }
        this.currentView = view;
        this.container.appendChild(this.currentView);
        return this.currentView.attach(this);
    }
}

/*
	@public virtual
*/


module.exports = Layout;