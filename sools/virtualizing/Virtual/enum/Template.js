const Virtual = require("../index")
const Handler = require("../../Handler")
const FunctionCall = require('../../Source/enum/FunctionCall')
const Property = require('../../Source/enum/Property')
const FunctionArg = require('../../Source/enum/FunctionArg')

const getVirtual = (template) => {
  if (template.prototype instanceof Template) {
    return getVirtual(template.templates[0])
  }
  return template
}

const getOwners = (source) => {
  if (source instanceof FunctionCall) {
    return [source.function, ...getOwners(source.function.source)]
  } else if (source instanceof Property) {
    return [source.owner]
  } else if (source instanceof FunctionArg) {
    return [source.dynamicFunction.owner, ...getOwners(source.dynamicFunction.owner.source)]
  } else {
    throw new Error('cannot find sources')
  }
}

const hasTemplate = (templates) => {
  for (const template of templates) {
    if (template.prototype instanceof Handler.Template) {
      return true
    }
  }
}

const linkMatching = (parent, child) => {
  return parent.links.find((parentLink) => {
    if (child.prototype instanceof Template) {
      return child.links.find((childLink) => {
        return parentLink === childLink || childLink instanceof parentLink
      })
    } else {
      const parentVirtual = getVirtual(parent)
      return child.prototype instanceof parentVirtual
    }
  })
}

const templatesMatching = (parent, child, owner) => {
  for (let i = 0; i < parent.length; i++) {
    const parentTemplate = parent[i]
    if (!parentTemplate.links) {
      throw new Error('test')
    }
    const matchingLink = parentTemplate.links.find((link) => {
      return owner.virtual.instanceof(link)
    })
    if (!child[i] || !matchingLink || !linkMatching(parent[i], child[i])) {
      return false
    }
  }
  return true
}

const getMatchingOwner = (templates, owners) => {
  for (const owner of owners) {
    if (!owner) {
      throw new Error()
    }
    if (templatesMatching(templates, owner.templates, owner)) {
      return owner
    }
  }
}

const Template = Virtual
  .define({
    name: 'template',
  })
  .virtual((Virtual) => {
    return class extends Virtual {

      static of(...templates) {
        if (templates.length > 1) {
          throw new Error('Template cannot handled multiple types')
        }
        return this.define({
          templates,
        })
      }
      
      static define(...args) {
        const child = super.define(...args)
        child.links = []
        return child
      }

      static find(source) {
        const sources = getSources(source)
        for (const subSource of sources) {
          for (const link of this.links) {
            if (subSource instanceof link) {
              return getTemplate(subSource)
            }
          }
        }
      }

      static link(virtualType) {
        this.links.push(virtualType)
      }

      static getVirtuals(templates, source) {
        if (!hasTemplate(templates)) {
          let processed = false
          const virtuals = templates.map((virtual) => {
            const subVirtuals = this.getVirtuals(virtual.templates, source)
            if (subVirtuals) {
              processed = true
              return virtual.of(...subVirtuals)
            }
            return virtual
          })
          return processed && virtuals
        }
        const owners = getOwners(source)
        const matchingOwner = getMatchingOwner(templates, owners)
        if (!matchingOwner) {
          throw new Error('no matching owner found')
        }
        return templates.map((template, index) => {
          const virtual = getVirtual(matchingOwner.templates[index])
          const virtuals = this.getVirtuals(virtual.templates, source)
          if (virtuals) {
            return virtual.of(...virtuals)
          }
          return virtual
        })
      }
    }
  })
  .handler((Handler) => {
    return class extends Handler {
      constructor() {
        throw new Error('Template cannot be instanciate')
      }
      static build(options) {
        const virtuals = this.virtual.getVirtuals([this.virtual], options.source)
        if (!virtuals) {
          throw new Error('weird')
        }
        return virtuals[0].handler.build(options)
      }
    }
  })

Handler.Template = Template
Virtual.Template = Template
module.exports = Template
