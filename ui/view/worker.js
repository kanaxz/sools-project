 var prefix = "view";
var paramsAttribute = prefix + ":param";
var redirectAttribute = prefix + ":redirect";
var activeAttribute = prefix + ":active";
var activeClass = "active";
var links = [];
var Link = require("./Link");

var Presenter = require("./Presenter");
class ViewWorker  {
    constructor() {
        this.currentViewName = null;
    }

    process(item, main, node, variables) {

        if (node.nodeType == Node.ELEMENT_NODE) {
            var linkOptions = {};
            var viewName = node.getAttribute(redirectAttribute);
            if (viewName != null) {
                linkOptions.viewName = viewName;
                node.removeAttribute(redirectAttribute);
            }

            var activeViewName = node.getAttribute(activeAttribute);
            if (activeViewName != null) {
                if (activeViewName != "") {
                    linkOptions.active = activeViewName;
                } else if (linkOptions.viewName) {
                    linkOptions.active = linkOptions.viewName;
                }

                node.removeAttribute(activeAttribute);
            }

            var params = node.getAttribute(paramsAttribute);
            if (params != null) {
                linkOptions.params = params;
                node.removeAttribute(paramsAttribute);
            }

            var link = new Link(this, item, node, variables, linkOptions);

            links.push(link);
            if (this.currentViewName)
                this.checkActiveClass(link);
        }

    }

    checkActiveClass(link) {
        if (link.active) {
            if (this.currentViewName == link.active) {
                link.node.classList.add(activeClass);
            } else {
                link.node.classList.remove(activeClass);
            }
        }
    }

    redirect(viewName, params) {
        // the redirecting event can be handle 
        // and stopped by calling preventDefault
        Presenter.current.redirect(viewName, params);
    }

    linkChanged(link) {
        this.fire("linkChanged", link);
        Presenter.current.linkChanged(link);
    }

    viewChanged(viewInstance) {
        this.checkLinks(viewInstance);
    }

    checkLinks(viewInstance) {
        this.currentViewName = viewInstance.constructor.viewName;
        for (var i = 0; i < links.length; i++) {
            var link = links[i];
            this.checkActiveClass(link);
        }
    }

    destroy(node) {
        for (var i = 0; i < links.length; i++) {
            var link = links[i];
            if (link.node == node) {
                links.splice(i--, 1);
                link.destroy();
            }
        }
    }
}


module.exports = ViewWorker;