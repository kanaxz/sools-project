var sools = require("sools")
const Queryable = require("../Queryable");
var Condition = require("../../Condition");
var conditions = require("../../conditions");
const Filter = require("./Filter");
const Identifiable = require("sools-define/Identifiable");
module.exports = sools.mixin([Queryable()], (base) => {

    class Filterable extends base {

        where(condition) {

            if (!(condition instanceof Condition)) {   
            	if(condition.constructor.dependencies && condition.constructor.dependencies.has(Identifiable))
            		condition = condition.identity();
                condition = new conditions.and(condition);
            }
            return this.operation(new Filter(condition));
        }
    }

    return Filterable;
})