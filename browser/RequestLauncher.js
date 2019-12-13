const Process = require("sools-process/Process");
const Request = require("./Request");
const ajax = require("./ajax");
class RequestLauncher extends Process {
    constructor(params) {
        super();
        this.source = params.source;
        this.url = params.url;
        this.type = params.type
    }

    execute(scope, next) {
        var xhr = scope.get(XMLHttpRequest);
        if (!xhr){
            xhr = new XMLHttpRequest();
            scope.push(xhr)
        }
        var datas = this.source(scope);
        return ajax({
            xhr: xhr,
            datas: datas,
            url: this.url,
            type:this.type
        }).then((xhr) => {
            return super.execute(scope, next);
        })

    }
}

module.exports = RequestLauncher;