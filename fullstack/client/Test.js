const sools = require("sools");
const Properties = require("sools-define/Properties");
const Propertiable = require("sools-define/Propertiable");
const datas = require("datas");
module.exports = sools.define([Propertiable()], (base) => {
    class Test extends base {
        filter(value) {
            this.refresh();
        }

        refresh() {
            this.querying = true;
            return datas.users.get().then((models) => {
                this.querying = false;
                this.models = models;
            })
        }
    }
    return Test;
}, [
    new Properties('querying', 'models')
])