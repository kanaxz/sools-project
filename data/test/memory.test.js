var expect = require("chai").expect;
const sools = require("sools");
const ModelInterfaces = require("../ModelInterfaces");
const models = require("./models");
const Context = require("sools-process/Context");
const MemorySource = require("../memory/Source");
const Stores = require("../storing/Stores");
describe("querying", function() {
    it("conditions", function() {
        var source = new MemorySource({
            users: [{
                id: 1,
                name: 'cédric'
            }, {
                id: 2,
                name: 'paul'
            }],
            groups: [{
                id: 1,
                name: 'devs'
            }, {
                id: 2,
                name: 'admin'
            }, {
                id: 2,
                name: 'readers'
            }],
            memberships: [{
                id: 1,
                user: {
                    id: 1
                },
                group: {
                    id: 1
                }
            }, {
                id: 3,
                user: {
                    id: 2
                },
                group: {
                    id: 3
                }
            }, {
                id: 2,
                user: {
                    id: 1
                },
                group: {
                    id: 2
                }
            }]
        })
        var datas = new ModelInterfaces(models)
            .then(new Stores())
            .then(source)
        return;
        return datas.setup(new Context())
            .then(() => {
                return datas.users.get().where({
                    name: 'cédric'
                }).first()
            })
            .then((cedric) => {
                return cedric.memberships.get()
                    .then((groups) => {
                        groups.hold();
                        return groups[0].delete()
                            .then(() => {
                                debugger
                                expect(groups.length).to.equal(1);
                                return
                                return cedric.groups.remove().where(groups[0])
                            })
                            .then(() => {
                                return
                                expect(groups.length).to.equal(0);
                            })
                    })
            })
    });
});
/**/