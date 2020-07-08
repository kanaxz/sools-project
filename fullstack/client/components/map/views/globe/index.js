const sools = require("sools");
const Properties = require("sools/Propertiable/Properties")
const View = require("sools-ui/view/View")
const Definition = require("sools-ui/view/Definition");
const MainLayout = require("layouts/Main")
const paper = require("paper");
const datas = require("datas");
const notify = require("components/notify");
const constantes = require("shared/constantes")
require("./index.scss");


var HEXAGONE_SIZE = 256 / 8;
var mapSize = {
  width: 50,
  height: 1000
};
var z;

class Tile {
  constructor(options) {
    this.hexas = [];
    this.coords = options.coords;
    this.infos = options.infos;
    this.canvas = L.DomUtil.create('canvas')
    this.container = document.createElement("div")
    this.container.classList.add('hexa-tile')
    this.container.appendChild(this.canvas);
    this.offset = this.infos.getOffset(this.coords);
    this.position = this.infos.getPosition(this.coords);
    this.ctx = this.canvas.getContext("2d");
    L.DomEvent.on(this.canvas, 'click', (event) => {
      console.log("click");
      var point = {
        x: event.offsetX,
        y: event.offsetY
      }
      var hexa = this.findHexagone(point)
      console.log(hexa && hexa.position)
    });
  }


  findHexagone(point) {
    var ctx = this.ctx;
    for (var hexa of this.hexas) {
      if (ctx.isPointInPath(hexa.path, point.x, point.y)) {
        return hexa;
      }
    }
  }

  draw() {
    var ctx = this.ctx;

    this.canvas.style.pointerEvents = 'initial';
    this.canvas.width = this.infos.size.x
    this.canvas.height = this.infos.size.y;
    if(this.coords.y == 0) {
      for (var x = -2; x < this.infos.count.x + 3; x++) {
        for (var y = -2; y < this.infos.count.y + 3; y++) {
          this.buildHexagone({
            position: {
              x,
              y
            }
          })

        }
      }
      /**/
    }

    var debug = {
    	x:100,
    	y:125
    }
    ctx.fillStyle = "white";
    ctx.font = "16px Arial";
    ctx.fillRect(debug.x, debug.y, 100, 50)

    ctx.fillStyle = "red";
    ctx.fillText(`${this.coords.x} ${this.coords.y}`, debug.x + 5, debug.y + 20);
    ctx.fillText(`${this.position.x} ${this.position.y}`, debug.x + 5, debug.y + 40);
    /**/
  }

  buildHexagone(options) {
    var ctx = this.ctx;
    var offset = {
      x: this.offset.x + options.position.x * this.infos.dimensions.width * (3 / 4) + this.infos.dimensions.width / 2,
      y: this.offset.y + this.infos.dimensions.height * (options.position.y + (options.position.x % 2 ? 0 : 0.5))
    }
    var path = new Path2D();


    var points = 6;
    var radius = this.infos.hexagoneSize / 2;
    for (var i = 0; i <= points; i++) {
      var angleDeg = 60 * i;
      var angleRad = Math.PI / 180 * angleDeg;

      path.lineTo(offset.x + this.infos.hexagoneSize * Math.cos(angleRad), offset.y +
        this.infos.hexagoneSize * Math.sin(angleRad))
    }
    path.closePath();
    ctx.lineWidth = 1
    ctx.stroke(path);
    ctx.fillStyle = "red";


    options.path = path;
    this.hexas.push(options)
    
    var debug = {

      x: offset.x - 10,
      y: offset.y - 15
    }

    ctx.fillRect(debug.x, debug.y, 40, 30)
    ctx.font = "16px Arial";
    ctx.fillStyle = "white";
    ctx.fillText(`${options.position.x} ${options.position.y}`, debug.x + 5, debug.y + 15);
    /**/
  }



  destroy() {

  }
}

class HexagoneLayer extends L.GridLayer {

  constructor() {
    super();
    this.tileSizesInfos = {};
  }



  createTile(coords) {
    var tileSizeInfos = this.tileSizesInfos[coords.z];

    if (!tileSizeInfos) {
      var size = this.getTileSize();
      var hexagoneSize = HEXAGONE_SIZE * (coords.z + 1)
      var dimensions = {
        width: 2 * hexagoneSize,
        height: Math.sqrt(3) * hexagoneSize
      }
      tileSizeInfos = {
        size,
        hexagoneSize,
        dimensions,
        count: {
          x: size.x / dimensions.width,
          y: size.y / dimensions.height
        },
        widthPlus: (dimensions.width + dimensions.width / 2),
        getPosition(coords) {
          return {
            x: 0,
            y: (((this.dimensions.height - (this.size.y % this.dimensions.height)) * (coords.y)) / this.dimensions.height)
          }
        },
        getOffset(coords) {
          return {
            x: (((this.widthPlus - (this.size.x % this.widthPlus)) * (coords.x)) % this.widthPlus),
            y: (((this.dimensions.height - (this.size.y % this.dimensions.height)) * (coords.y)) % this.dimensions.height)
          }
        }
      }
      this.tileSizesInfos[coords.z] = tileSizeInfos;
    }
    var tile = new Tile({
      coords,
      infos: tileSizeInfos,
    })
    tile.draw();


    return tile.container;
  }
}


module.exports = sools.define(View, (base) => {
  return class Globe extends base {
    constructor() {
      super();
    }

    async initialized() {
      await super.initialized()
      this.lMap = L.map('mapid', {
        crs: L.CRS.Simple,
        center: [10, 0],
        minZoom: 0,
        maxZoom: 3,
        zoom: 2,
        /*
        zoomSnap:2,
        maxBounds: [
          [-100, -100],
          [150, 300]
        ]
        /**/
      })
      this.hexagoneLayer = new HexagoneLayer();
      this.hexagoneLayer.addTo(this.lMap)
      var maps = await datas.execute(({ db }) => {
        return db.clanMaps.get()
          .forEach((clanMap) => {
            clanMap.load({
              map: true
            })
          })
      })

      console.log("maps", maps);

    }
  }
}, [
  new Properties(),
  new Definition({
    layout: MainLayout,
    name: "globe-view",
    template: require("./index.html")
  })
])

/**/