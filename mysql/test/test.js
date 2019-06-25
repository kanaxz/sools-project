var expect = require("chai").expect;
const sools = require("sools");
const Mysql = require("../Process");
const ModelInterfaces = require("data-app/ModelInterfaces");
describe("mysql", function() {
    it("setup", function() {
        var datas = new ModelInterfaces()
            .then(new Mysql({
                host: 'localhost',
                user: 'root',
                database: 'sools-mysql'
            }))
        console.log("test", test)
    });
});
/**/