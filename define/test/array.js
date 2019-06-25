const sools = require("sools");
const Array = require("../Array");
var TestArray = sools.define([Array], (base) => {
    class TestArray extends base {
        indexDeleted(...args) {
            super.indexDeleted(...args);
            console.log("DELETE", ...args, )
        }

        indexSet(...args) {
            super.indexSet(...args);
            console.log("SET", ...args)
        }
    }
    return TestArray;
})


var test = new TestArray();

test.push({
    a: 4
},{
    a: 1
}, {
    a: 3
}, {
    a: 2
});
//test.splice(0,1)
test.sort((o1,o2)=>{
    return o1.a - o2.a
})
/**/