const sools = require("sools");
const Propertiable = require("sools/Propertiable");
const Properties = require("sools/Propertiable/Properties");

module.exports = sools.define([Propertiable()], (base) => {

    class Notification extends base {
        constructor(option) {
            super();
            this.removing = option.removing;
            this.template = option.template;
            this.message = option.message;
            this.type = option.type || 'info';
        }
    }

    return Notification;
},[
	new Properties('removing')
])