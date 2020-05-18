const sools = require("sools");
const datas = require("./datas");
const Route = require("sools-express/Route");
const Response = require("sools-express/Response");
const express = require("./express");


var route = new Route(express, "/datas")
		.then((scope,next)=>{
			//console.log(JSON.stringify(scope.req.body,null," "))
			scope.context = new datas.context.type();
			scope.scope = datas.build(scope.req.body);
			return next();
		})
		.then(new Response((scope) => {
        return scope.result
    }))
    .then(datas)
    
module.exports = route;