class Event {
    constructor() {
        this.listeners = new Array();
    }

    trigger(...args) {
        this.listeners.forEach((listener) => {
            listener(...args);
        })
    }

    listen(fn) {
        this.listeners.push(fn);
    }

    remove(fn) {
        var index = this.listeners.indexOf(fn);
        if (index != -1)
            this.listeners.splice(index, 1);
        else
            throw new Error("Function not found");
    }
}

module.exports = Event;