const Process = require("sools/processing/Process");
const Request = require("./Request");
const ajax = require("./ajax");
class RequestLauncher extends Process {
    constructor(params) {
        super();
        this.source = params.source;
        this.url = params.url;
        this.type = params.type
    }

    async execute(scope, next) {
      var xhr = scope.xhr;
      if (!xhr){
          xhr = new XMLHttpRequest();
          scope.xhr = xhr
      }
      var datas = this.source(scope);
      scope.result = await ajax({
          xhr: xhr,
          datas: datas,
          url: this.url,
          type:this.type
      })
    }
}

module.exports = RequestLauncher;