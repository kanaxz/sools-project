const fs = require('fs')

const analyzeFolder = async (folder) => {
  const entities = fs.readdirSync(folder, { withFileTypes: true })
  let count = 0
  for (const entity of entities) {
    if (entity.isDirectory()) {
      if (['lib', 'node_modules', 'fullstack', 'ui'].indexOf(entity.name) !== -1) {
        continue
      }
      count += await analyzeFolder(`${folder}/${entity.name}`)
    } else if (entity.name.endsWith('.js')) {
      console.log(`${folder}/${entity.name}`)
      const text = fs.readFileSync(`${folder}/${entity.name}`, 'utf8')
      count += text.split('\n').length
    }
  }
  return count
}

const work = async () => {
  const result = await analyzeFolder('./sools')
  console.log(result)
}

work()