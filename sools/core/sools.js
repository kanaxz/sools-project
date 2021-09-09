const Dependencies = require("./Dependencies")

const findDependencyIndex = (dependency, dependencies, result) => {
  return dependencies.findIndex((d) => {
    return d.mixin == dependency.mixin;
  })
}

const processDependency = (result, dependency) => {
  let existingIndex = -1
  if (result.base.dependencies) {
    existingIndex = findDependencyIndex(dependency, result.base.dependencies, result)
  }
  if (existingIndex !== -1) {
    return
  }
  existingIndex = findDependencyIndex(dependency, result.dependencies)
  if (existingIndex !== -1) {
    return
  }
  if (dependency.mixin.dependencies) {
    processDependencies(result, dependency.mixin.dependencies)
  }
  result.dependencies.push(dependency)

}

const processDependencies = (result, dependenciesTree) => {
  for (const dependency of dependenciesTree) {
    processDependency(result, dependency)
  }
}

const buildBase = (base, dependenciesTree) => {
  const result = {
    dependencies: [],
    base
  }
  processDependencies(result, dependenciesTree)
  let currentClass = base
  for (const dependency of result.dependencies) {
    currentClass = dependency.mixin.fn(currentClass, ...dependency.args)
  }
  if (base.dependencies) {
    result.dependencies = [...base.dependencies, ...result.dependencies]
  }
  result.base = currentClass
  result.base.dependencies = result.dependencies
  return result.base
}

module.exports = {
  proxy(...args) {
    const fn = this.mixin(...args)
    const type = this.extends([fn()]);
    type.mixin = fn;

    return new Proxy(type, {
      apply: (target, thisArg, args) => {
        //fallback for babel ?
        if (thisArg) {
          return target.apply(thisArg, args);
        }
        return fn.apply(null, args);
      }
    })
  },
  mixin(...args) {

    const mixin = {
      fn: args[args.length - 1],
      dependencies: args.length === 2 && args[0] || []
    }

    const fn = (...args) => {
      return {
        mixin,
        args
      }
    }
    fn.mixin = mixin
    return fn
  },
  extends(...args) {
    const base = args.length === 2 && args[0] || class { }
    const dependencies = args[args.length - 1]
    return buildBase(base, dependencies)
  }
}