const sools = require("sools");
const datas = require("./datas");
const Route = require("sools-express/Route");
const Request = require("sools-express/Request");
const Response = require("sools-express/Response");
const express = require("./express");
const Context = require("sools/data/Context").type;


var route = new Route(express, "/datas")
		.then({
			datas:null,
			setup(scope, next){
				this.datas = scope.datas
				this.datas.context.registerProperties({
					user:models.user
				})
				return next();
			},
			execute(scope, next){
				scope.context = new Context({
					user:scope.req.user
				})
				scope.scope = this.datas.build(scope.req.body);
				return next();
			}
		})
    .then(datas)
    .then(new Response((scope) => {
        return results
    }))
module.exports = route;