var ajax = require("sools-browser/ajax");
var datas = require("datas");
const sools = require("sools");
const Propertiable = require("sools-define/Propertiable");
const Properties = require("sools-define/Properties");
const AuthService = sools.define([Propertiable()], (base) => {
    class AuthService extends base {
        constructor(baseUrl) {
            super();
            this.baseUrl = baseUrl;
        }

        getMe() {
            return this.request("/me", {
                type: 'get'
            }).then((response) => {
                var me = response.user;
                if (me)
                    this.me = datas.users.attach(me);
                return (me);
            });
        }

        start() {
            return this.getMe();
        }

        request(url, options) {
            options = options || {};
            return ajax({
                url: this.baseUrl + url,
                type: options.type || "POST",
                datas: options.datas
            }).then((xhr) => {
                console.log(xhr);
                return JSON.parse(xhr.responseText);
            })
        }

        signup(user) {
            if (this.me)
                throw new Error("already logged in");
            return this.request("/signup", {
                datas: user
            }).then((me) => {
                this.me = datas.users.attach(me);
                return (this.me);
            });
        }
        signin(user) {
            if (this.me)
                throw new Error("already logged in");
            return this.request("/signin").then((me) => {
                this.me = datas.users.attach(me);
                return (this.me);
            });
        }
        logout(user) {
            if (!this.me)
                throw new Error("Not connected");
            return this.request("/logout").then(() => {
                this.me = null;
            })
        }
    }

    return AuthService;
}, [
    new Properties('me')
])

module.exports = new AuthService('/apis/auth');