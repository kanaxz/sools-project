var expect = require("chai").expect;

var sools = require("../sools")
var Tree = require("../Tree");
var Values = require("../Values")

describe("Tree", function() {
    it("sub tree", function() {

        class Test extends Tree {
            
        }

        var tree = new Test(new Test(1, 2, 3, new Test(4, 5, 6)), 7, 8, 9);
        /*
        for(var obj of tree)
            console.log(obj)
        /**/
    });
});