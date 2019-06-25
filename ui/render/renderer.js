var BaseScope = require("./BaseScope");
var html = require("../html");
const Variables = require("./Variables")

/**
	@namespace whitecrow.renderer
*/
var renderer = {
    /**
    	@memberof whitecrow.renderer
    	@member {Array<whitecrow.renderer.workerDefinition>} workers An array of all the registered workers
    */
    workers: [],
    /**
			@public
			@static
			@memberof whitecrow.renderer
			@param {Array<string>} names - The names of the workers to get
			@return {Array<whitecrow.renderer.workerDefinition>} An array of workerDefinition that match the names array
 		*/
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
    /**
    	Register a worker by name
    	The name can be use to tell which worker to use in the render process
    	@public
    	@static
    	@memberof whitecrow.renderer
    	@param {string} name - The name of the worker
    	@param {whitecrow.worker} worker - An instance of worker
    */
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
    /**		
    	@public
    	@static
    	@memberof whitecrow.renderer
    	@param {object} source
    	@param {web.typedefs.node} target
    	@param {whitecrow.renderer.renderOptions} renderOptions
    */
    render: function(node, scope) {
        if (node instanceof Array) {
            return Promise.all(node.map((n) => {
                return this.render(n, scope)
            }));
        }
        return Promise.resolve(0).then(function() {
            if (html.isCustomElement(node)) {
                return customElements.whenDefined(node.tagName.toLowerCase());
            }
            return null;

        }).then(nop => {
            this.process(node, scope)
            if (node.processed)
                return node.processed(scope);
            else if (node.childNodes != null) {
                return this.renderContent(node, scope);
            }
        })

    },
    /**	
    	Render on the first depth level of the children of the node
    	@public
    	@static
    	@memberof whitecrow.renderer
    	@param {web.typedefs.node} target
    */
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
    /**
    	Destroy a node.	It will call all the workers 'destroy' function	destroy one level deepth node's childs
    	@memberof whitecrow.renderer
    	@param {web.typedefs.node} node
    */
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