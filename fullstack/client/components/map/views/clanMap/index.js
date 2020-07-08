const sools = require("sools");
const Properties = require("sools/Propertiable/Properties")
const View = require("sools-ui/view/View")
const Definition = require("sools-ui/view/Definition");
const MainLayout = require("layouts/Main")
const EmptyLayout = require("layouts/empty")

const datas = require("datas");
const notify = require("components/notify");
const constantes = require("shared/constantes")
const Ressource = require("./ressource");
const utils = require("./utils")
const Form = require("./form")
require("./index.scss");
const mapMinZoom = 2;
const mapMaxZoom = 5;
const mapMaxResolution = 1.00000000;
const mapMinResolution = Math.pow(2, mapMaxZoom) * mapMaxResolution;
var size = 8192.0;
var ratio = 150;


var translation = {
  x: 4096 - 32,
  y: -4096 + 36
}


function project(point) {
  return {
    x: (point.lng - translation.x) * ratio,
    y: (point.lat - translation.y) * -ratio,
  }
}

function unproject(point) {
  return {
    lng: (point.x / ratio) + translation.x,
    lat: (-point.y / ratio) + translation.y
  }

}

function buildCRS() {

  let crs = L.CRS.Simple;
  crs.transformation = new L.Transformation(1, 0, -1, 0);
  crs.scale = function(zoom) {
    return Math.pow(2, zoom) / mapMinResolution;
  };
  crs.zoom = function(scale) {
    return Math.log(scale * mapMinResolution) / Math.LN2;
  };
  /**/
  return crs;
}

module.exports = sools.define(View, (base) => {
  class Map extends base {
    constructor() {
      super();
      this.ressources = [];
      this.ressourceTypes = constantes.ressourceTypes;
      this.ressourcesGroup = L.featureGroup([])
    }

    addRessource(ressource) {
      var ressourceEl = new Ressource(ressource)
      ressourceEl.attach(this);
      this.ressources.push(ressourceEl);
      let icon = L.divIcon({
        className: `icon map`,
        html: ressourceEl,
        iconSize: [48, 48], // size of the icon
        //iconAnchor: [24, 24], // point of the icon which will correspond to marker's location
        popupAnchor: [0, -50] // point from which the popup should open relative to the iconAnchor
      });
      var point = unproject(ressource.position);
      var marker = L.marker([point.lat, point.lng], { icon })
      marker.ressource = ressource
      marker.bindPopup((marker)=>{
      	setTimeout(async ()=>{      		
      		this.popup = marker.getPopup();
      		var ressource = await this.form.edit(marker.ressource)
      		marker.setLatLng(unproject(ressource.position))
      		this.popup.remove();
      	},1)
      	return this.ressource;
      })
      this.ressourcesGroup.addLayer(marker)

    }

    async initialized() {
      await super.initialized()
      this.ressource.parentNode.removeChild(this.ressource);
      var crs = buildCRS()
      this.lMap = L.map('mapid', {
        crs
      })

      this.layer = L.tileLayer("/assets/images/maps/SleepingGiants/{z}/{x}/{y}.png", {
        minZoom: 2,
        maxZoom: 5,
        noWrap: true,
        tms: false
      })
      this.layer.addTo(this.lMap);
      this.ressourcesGroup.addTo(this.lMap);
      this.lMap.fitBounds([
        [0, 0],
        [-8192, 8192]
      ]);

      this.lMap.on("mousedown",(e)=>{
      	if(this.popup && this.popup.isOpen()){
      		this.preventNextClick = true;
      		this.popup = null;
      	}
      })

      this.lMap.on("click", this.b(async (e) => {
      	if(this.preventNextClick){
      		this.preventNextClick = false;
      		return
      	}
        try {
          this.popup = L.popup()
            .setLatLng( e.latlng)
            .setContent(this.ressource)
            .openOn(this.lMap);
          var ressource = await this.form.edit({
            position: project(e.latlng),
          })

          await datas.execute(({ db }) => {
            return db.clanMaps.update((clanMaps) => {
              return clanMaps.filter((clanMap) => {
                return clanMap._id.eq(this.clanMap._id)
              })
            }, (clanMap) => {
              clanMap.ressources.push([ressource]);
            })
          })
          this.popup.remove();
          this.popup = null;
          this.addRessource(ressource)
          notify.display({
            message: "Ressource ajoutée",
            type: 'success'
          })
        } catch (e) {
          notify.display({
            message: e.message,
            type: 'error'
          })
          throw e;
        }

      }))

      this.clanMap = await datas.execute(({ db }) => {
        return db.clanMaps.get().filter((map) => {
          return map._id.eq("5ec95e0cceea2a00b995c14f")
        }).forEach((clanMap) => {
          clanMap.load({
            map: true,
            clan: true
          })
        }).atIndex(0)
      })
      console.log(this.clanMap)
      this.clanMap.ressources.forEach((ressource) => {
        this.addRessource(ressource);
      })
      /**/
    }
  }

  return Home;
}, [
  new Properties(),
  new Definition({
    layout: MainLayout,
    name: "map-view",
    template: require("./index.html")
  })
])

/**/