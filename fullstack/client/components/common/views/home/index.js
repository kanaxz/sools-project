const sools = require("sools");
const Properties = require("sools/Propertiable/Properties")
const View = require("sools-ui/view/View")
const Definition = require("sools-ui/view/Definition");
const MainLayout = require("layouts/Main")
const datas = require("datas");
const notify = require("components/notify");
const Form = require("components/data/Form")

require("./home.scss");

const mapExtent = [0.00000000, -8192.00000000, 8192.00000000, 0.00000000];
const mapMinZoom = 2;
const mapMaxZoom = 5;
const mapMaxResolution = 1.00000000;
const mapMinResolution = Math.pow(2, mapMaxZoom) * mapMaxResolution;
const tileExtent = [0.00000000, -8192.00000000, 8192.00000000, 0.00000000];

function buildCRS() {

  let crs = L.CRS.Simple;
  crs.transformation = new L.Transformation(1, -tileExtent[0], -1, tileExtent[3]);
  crs.scale = function(zoom) {
    return Math.pow(2, zoom) / mapMinResolution;
  };
  crs.zoom = function(scale) {
    return Math.log(scale * mapMinResolution) / Math.LN2;
  };
  return crs;
}


module.exports = sools.define(View, (base) => {
  class Home extends base {
    constructor() {
      super();

    }

    async initialized() {
      await super.initialized()
      notify.display({
      	message:'test'
      })
      var crs = buildCRS()
      var mapL = L.map('mapid', {
        crs
      })

      L.tileLayer("/assets/images/maps/SleepingGiants/{z}/{x}/{y}.png", {
        minZoom: 2,
        maxZoom: 5,
        noWrap: true,
        tms: false
      }).addTo(mapL);

      mapL.fitBounds([
        crs.unproject(L.point(mapExtent[2], mapExtent[3])),
        crs.unproject(L.point(mapExtent[0], mapExtent[1]))
      ]);

      mapL.on("click", this.b(async (e) => {
      	console.log(e)
        this.form.style.top = e.containerPoint.y + "px";
        this.form.style.left = e.containerPoint.x + "px";
        this.displayForm = true;
        try {
          await this.form.build(datas.models.ressource, {
            position: {
              y: e.latlng.lat,
              x: e.latlng.lng
            },
            map: {
              _id: this.map._id
            }
          }, {
            map: false
          })
          this.displayForm = false
          notify.display({
        		message:"Ressource ajoutée",
        		type:'success'
        	})
        } catch (e) {
        	notify.display({
        		message:e.message,
        		type:'error'
        	})
        }

      }))

      this.map = await datas.execute(({ db }) => {
        return db.maps.get().filter((map) => {
          return map._id.eq("5ebfe824f1cb45042a678cff")
        }).forEach((map) => {
          map.load({
            ressources: true
          })
        }).atIndex(0)
      })
      
      for (let ressource of this.map.ressources) {

        let icon = L.divIcon({
          className: `${ressource.type} ressource icon map`,
          html:`<p class="level">${ressource.level}</p>`,
          iconSize: [48, 48], // size of the icon
          iconAnchor: [24, 24], // point of the icon which will correspond to marker's location
          popupAnchor: [0, -50] // point from which the popup should open relative to the iconAnchor
        });
        let market = L.marker([ressource.position.y, ressource.position.x], { icon }).addTo(mapL)
         L.layerGroup([market]);

        //.bindPopup("<dl><dt>Claim Walker</dt>" + "<dt>Owned by: </dt></dl>");
        
      }
    }
  }

  return Home;
}, [
  new Properties('displayForm'),
  new Definition({
    layout: MainLayout,
    name: "home-view",
    template: require("./home.html")
  })
])