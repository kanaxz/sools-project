const sools = require("sools");
const Propertiable = require("sools-define/Propertiable");
const Properties = require("sools-define/Properties");

var maxPhoneSize = 780;
var cacheId = "UICache";

const UIViewModel = sools.define([Propertiable()], (base) => {

    class UIViewModel extends base {
        constructor() {
            super();
            var cache = this.loadCache();
            this.applyDatas(cache);
        }

        saveCache() {
            localStorage.setItem(this.idCache, JSON.stringify(this.getDatas()));
        }

        loadCache() {
            var cache = localStorage.getItem(this.idCache);
            try {
                var datas = JSON.parse(cache);
                if (datas != null) {
                    return datas;
                } else
                    return this.getDefault();

            } catch (e) {
                return this.getDefault();
            }
        }

        toggleMenu() {
            this.menuOpen = !this.menuOpen;
        }

        applyDatas(datas) {
            this.menuOpen = datas.menuOpen;
        }

        getDatas() {
            return {
                menuOpen: this.menuOpen
            }
        }

        getDefault() {
            return {
                menuOpen: window.innerWidth < maxPhoneSize
            }
        }

        propertyChanged(propertyName) {
            this.saveCache();
            super.propertyChanged(propertyName);
        }
    }
    return UIViewModel;
}, [
    new Properties('menuOpen')
])

module.exports = new UIViewModel();