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

    execute(context, next) {
        var xhr = context.get(XMLHttpRequest);
        if (!xhr){
            xhr = new XMLHttpRequest();
            context.push(xhr)
        }
        var datas = this.source(context);
        return ajax({
            xhr: xhr,
            datas: datas,
            url: this.url,
            type:this.type
        }).then((xhr) => {
            return super.execute(context, next);
        })

    }
}

module.exports = RequestLauncher;