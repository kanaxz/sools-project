const worker = require("./worker");
const renderer = require("sools-ui/render/renderer");

renderer.registerWorker("contextMenu", worker);
