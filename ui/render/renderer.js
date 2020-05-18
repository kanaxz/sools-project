var BaseScope = require("./BaseScope");
var html = require("../html");
const Variables = require("./Variables")

var renderer = {

    workers: [],
    getWorkersByNames: function(names) {
        var result = [];
        for (var i = 0; i < this.workers.length; i++) {
            var worker = this.workers[i];
            for (var y = 0; y < names.length; y++) {
                var name = names[y];
                if (worker.name == name)
                    result.push(worker);
            }
        }
        return result;
    },
    registerWorker: function(name, worker) {
        var existingWorker = this.getWorkersByNames([name]);
        if (existingWorker.length === 0) {
            var workerDefinition = {
                name: name,
                object: worker
            };
            this.workers.push(workerDefinition);
        } else
            throw new Error("Worker '" + name + "' already exits");
    },
    process: function(node, scope) {
        var variables = new Variables();
        variables.push(scope.variables)
        variables.set("node", node);
        var workers = this.workers;
        for (var i = 0; i < workers.length; i++) {
            var worker = workers[i];
            worker.object.process(scope.source, node, variables)
        }
    },
    render:async function(node, scope) {
        if (node instanceof Array) {
        	for(var n of node){
        		await this.render(n,scope);
        	}
        }
        if (html.isCustomElement(node)) {
            await customElements.whenDefined(node.tagName.toLowerCase());
        }

        this.process(node, scope)
        if (node.processed)
            await node.processed(scope);
        else if (node.childNodes != null) {
            await this.renderContent(node, scope);
        }
    },
    renderContent: function(node, scope) {
        if (node instanceof Array) {
            return Promise.all(node.map((n) => {
                return this.renderContent(n, scope)
            }));
        }
        return Promise.all([...node.childNodes].map((childNode) => {
            return this.render(childNode, scope);
        }))
    },
    destroy: function(node) {
        var workers = this.workers;
        for (var i = 0; i < workers.length; i++) {
            var worker = workers[i].object;
            if (worker.destroy)
                worker.destroy(node)
        }
        if (node.destructor) {
            node.destructor();
        } else if (node.childNodes) {
            for (var i = 0; i < node.childNodes.length; i++) {
                var childNode = node.childNodes[i];
                this.destroy(childNode);
            }
        }
    }

}

module.exports = renderer;