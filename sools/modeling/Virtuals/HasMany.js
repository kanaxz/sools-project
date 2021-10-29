const Array = require("../../../../virtualizing/Virtual/enum/Array")
const Model = require("./Model")
const RelationSelector = require('./RelationSelector')

const modelTemplate = Template.of(Model)

const HasMany = Array
  .define({
    name: 'HasMany',
    template: modelTemplate,
  })
  .handler((Handler) =>
    class extends Handler {
      constructor(options) {
        super(options);
        if (options.property)
          this.property = options.property
      }
    }
  )
  .methods({
    unload: [[RelationSelector.of(modelTemplate)]],
    load: [[RelationSelector.of(modelTemplate)]]
  })

module.exports = HasMany
