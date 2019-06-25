const models = require("../shared/models");
const UI = require("./UI");
models.user.define(
    [
        new UI({
        	defaultProperty:'email',
        	display:['email','groups'],
            controls: {
                simple: () =>
                    import ('components/user/controls/simple')
            }
        })
    ]
)

models.group.define(
    [
        new UI({
            defaultProperty:'name',
            display:['name','users'],
            controls: {
                simple: () =>
                    import ('components/group/controls/simple')
            }
        })
    ]
)


module.exports = models;