var sools = require("sools")
const Queryable = require("../Queryable");
const Array = require("sools-define/Array");
var Condition = require("../../../Condition");
const Conditions = Array.of(Condition);
const Identifiable = require("sools-define/Identifiable");
module.exports = sools.mixin([Queryable()], (base) => {

    class Filterable extends base {

        where(condition) {

            if (!(condition instanceof Condition)) {   
            	if(condition.constructor.dependencies && condition.constructor.dependencies.has(Identifiable))
            		condition = condition.identity();
                condition = new conditions.and(condition);
            }
            return this.operation(new Filterable.model(condition));
        }
    }

    return Filterable;
})