require("./Presenter");
const renderer = require("../render/renderer");
const worker=  require("./worker");
renderer.registerWorker("view",new worker());