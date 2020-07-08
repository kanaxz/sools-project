/*
	just a preset
*/
var renderer = require("./render/renderer");
var setWorker = require("./set/worker");
var attachWorker = require("./attach/worker");
var bindWorker = require("./bind/worker");
var eventWorker = require("./event/worker");
var inWorker = require("./in/worker");
var classWorker = require("./class/worker");
var initWorker = require("./init/worker")
var propertyChangedWorker = require("./propertyChange/worker")

renderer.registerWorker("init", initWorker);
renderer.registerWorker("set", setWorker);
renderer.registerWorker("attach", attachWorker);
renderer.registerWorker("bind", bindWorker);
renderer.registerWorker("event", eventWorker);
renderer.registerWorker("class", classWorker);
renderer.registerWorker("in", inWorker);
renderer.registerWorker("propertyChanged", propertyChangedWorker);