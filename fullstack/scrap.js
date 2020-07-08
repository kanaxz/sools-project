const fs = require("fs");
const request = require("request");
const constantes = require("./shared/constantes")

var ressources =  [
    "Wood",
  	"Aloe",
    "Ash",
    "Beeswax",
    "Blood Turnip",
    "Bone Splinter",
    "Cactus Flesh",
    "Cattail",
    "Charcoal",
    "Shell",
    "Clay",
    "Corn",
    "Cotton",
    "Fiber",
    "Hide",
    "CactusFruit",
    "Insects",
    "Iron Ore",
    "Mushroom Flesh",
    "InfectedBurl",
    "Obsidian",
    "Palm Leaves",
    "Pearl",
    "Redwood Wood",
    "Rupu Gel",
    "Rupu Vine",
    "Sand",
    "Stone",
    "SulfurLump",
    "Thornberry",
    "Worm Silk"
  ]

  var maps = [
  /*
  'SleepingGiants',
  /**/
  'CanyonB']

function buildDir(path) {
  path =  path
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
}

async function updloadImage(url, path,fn) {
  await new Promise((resolve, reject) => {
    request(url)
      .on('response', (res) => {
        debugger
        if (res.statusCode != 200)
          return reject(new Error(`Status code ${res.statusCode} ${url}`))
        if (fn)
          fn()
        res.pipe(fs.createWriteStream(path))
        res.on('end', function() {
          resolve();
        });
      })
  })
}

async function work() {
	try{
  //scrapRessources()
  await scrapMaps()
  }
  catch(e){
  	debugger
  	console.log(e)
  	throw e
  }
}


async function scrapRessources() {
  var path = "./assets/images/ressources"
  var index = 0
  
  for (let ressourceType of constantes.ressourceTypes) {
  	var ressource = ressources[index++].replace(/ /g,"")
  	console.log(ressource,ressourceType)
  	try{
  		await updloadImage(
    	`https://www.shiftingsands.gg/img/Leaflet/Icons/T_${ressource}_D.png`,
    	path + `/${ressourceType}.png`)    	
  	}
  	catch(e){
  		console.log("2")
  		await updloadImage(
    	`https://www.shiftingsands.gg/img/Leaflet/Icons/${ressourceType}.png`,
    	path + `/${ressourceType}.png`)    
  	}
  }
}

async function scrapMaps() {
  var path = "./assets/images/maps"
  for (let map of maps) {
    buildDir(path + `/${map}`);
    for (let x = 0; x < 6; x++) {
      var max = Math.pow(2, x)
      console.log(max)
      for (let y = 0; y < max; y++) {
        for (let z = 0; z < max; z++) {
          await updloadImage(`https://www.shiftingsands.gg/img/Leaflet/Maps/${map}/${x}/${y}/${z}.png`, `${path}/${map}/${x}/${y}/${z}.png`,() => {
            buildDir(path + `/${map}/${x}`)
            buildDir(path + `/${map}/${x}/${y}`)
          })
        }
      }
    }
  }

}

work()