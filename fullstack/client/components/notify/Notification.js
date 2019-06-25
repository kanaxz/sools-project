const sools = require("sools");
const Propertiable = require("sools-define/Propertiable");
const Properties = require("sools-define/Properties");

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