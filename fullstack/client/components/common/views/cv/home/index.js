const sools = require("sools");
const Properties = require("sools/Propertiable/Properties")
const View = require("sools-ui/view/View")
const Definition = require("sools-ui/view/Definition");
const MainLayout = require("layouts/Main")
const EmptyLayout = require("layouts/empty")

const datas = require("datas");
const notify = require("components/notify");
require("./home.scss");

var techs = {
	python:{
		name:'Python',
	},
	nodeJs:{
		name:'Node.js'
	},
	js:{
		name:'js'
	},
	html:{
		name:'html'
	},
	css:{
		name:'css'
	},
	mysql:{
		name:'MySql'
	}, 
	pug:{
		name:'pug'
	},
	scrum:{
		name:'Agile/Scrum'
	},
	cs:{
		name:'C#'
	},
	reactNative:{
		name:'React Native'
	},
	wpf:{
		name:'WPF'
	},
	di:{
		name:'Depedency Injection'
	},
	telerik:{
		name:'Telerik'
	},

	git:{
		name:'Git'
	},
	vs:{
		name:'Visual Studio'
	},
	azure:{
		name:'Azure'
  },
  react:{
    name:'React'
  },
	grunt:{
		name:'Grunt'
	},
	scss:{
		name:'scss'
	},
	pdfJs:{
		name:'Pdf.js'
	},
	sqlServer:{
		name:'SQLServer'
	},
	aspNet:{
		name:'Asp.net'
	},
	customElements:{
		name:'CustomElements'
	},
	class:{
		name:'class'
	},
	mixin:{
		name:'mixin'
	},
	momentJs:{
		name:'Moment.js'
	},
	
	webpack:{
		name:'Webpack'
	},
	passportJs:{
		name:'Passport.js'
	},
	angular:{
		name:'Angular'
	},
	vueJs:{
		name:'Vue.js'
	},
	security:{
		name:'Sécurité'
	},
	network:{
		name:'Réseau'
	},
	mac:{
		name:'Mac'
	},
	shell:{
		name:'Shell'
	},
	cpp:{
		name:'C++'
	},

	c:{
		name:'C'
	},
	php:{
		name:'PHP'
	},
	mongoDb:{
		name:'MongoDB'
	},
	java:{
		name:'Java'
	},
	mvc:{
		name:'MVC'
	},
	sharePoint:{
		name:'SharePoint'
	},
	mocha:{
		name:'Mocha'
	},
	chai:{
		name:'Chai'
	},
	leaflet:{
		name:'Leaflet'
	}
}

module.exports = sools.define(View, (base) => {
  class Home extends base {
    constructor() {
      super();

      this.jobs = [{
        name: 'Galadrim - Agence web',
        link: 'https://galadrim.fr/',
        image: 'galadrim.png',
        date: 'Août 2018 - Octobre 2019',
        techs: 'Agile(scrum)',
        job: 'Développeur Fullstack JS',
        type:'Freelance',
        techs:[techs.python,techs.reactNative],
        projects: [{
          name: 'Open Health',
          link: 'https://www.openhealth.fr',
          techs: [techs.nodeJs, techs.js, techs.html, techs.css, techs.mysql, techs.pug,techs.scrum],
          description: ["Platerforme permettant d'accèder à des dashboards externes","Administration", "Mise en place de plusieurs APIs tiers: Salesforce, Pardot, Azure, Qlik, Mailjet"]
        }, {
          name: 'Ostéogo',
          link: 'https://www.osteogo.fr/',
          techs: [techs.nodeJs, techs.js, techs.html, techs.css, techs.mysql, techs.pug,techs.scrum],
          description: ["Mise en relation d'ostéopathes", "Cartographie", "Paiement avec Stripe", "Gestion des contrats par Docusign"]
        }]
      }, {
        name: 'Projetlys - ESN',
        link: 'https://projetlys.com',
        image: 'projetlys.png',
        date: 'Septembre 2014 - Octobre 2017',
        techs: 'Agile(scrum)',
        type:'Alternance (3 semaines entreprise/1 semaine école)',
        job: 'Développeur Fullstack C#/JS',
        techs:[techs.mvc,techs.sharePoint,techs.xamarin,techs.azure],
        projects: [{
          name: 'Ma collectivité numérique',
          techs: [techs.cs, techs.wpf, techs.di, techs.telerik, techs.git, techs.vs],
          description: ["Application bureau WPF", "Dashboard","Cartographie","Graphiques"],
        }, {
          name: 'PDF Notes',
          techs: [techs.cs, techs.aspNet,techs.sqlServer,techs.html, techs.js, techs.scss, techs.vs, techs.pdfJs, techs.git],
          description: ["Application Windows universelle (UWP)", "Dessins et prise de notes sur un document PDF", "Partage à des utilisateurs ou à des groupes", "Temps réel"]
        }]
      }]

      this.personalProjects = [{
        name: 'sools',
        description: [
          "Gestion d'héritage en js (class/mixin)"
        ],
        techs:[techs.js,techs.class,techs.mixin]
      },{
        name: 'sools-ui',
        description: ['Librairie UI', 'CustomElements'],
        techs: [techs.html, techs.js, techs.customElements]
      },{
        name: 'sools-data',
        description: [ "ORM","Data","Business logic",'Abstraction','Low-code'],
        techs: [techs.mongoDb]
      }]
      this.personalProjects.techs = [techs.mocha,techs.chai,techs.angular,techs.react ,techs.grunt,techs.momentJs,techs.passportJs,techs.webpack,techs.scss,techs.mysql,techs.leaflet]

      this.trainings = [{
      	name:'BTS IRIS',
      	date:'2012 - 2014',
      	image:'branly.jpg',
      	school:'Lycée Edouard Branly',
      	techs:[techs.cpp,techs.cs,techs.php,techs.aspNet,techs.html,techs.js,techs.css,techs.network]
      },{
      	school:'ISITECH',
      	image:'isitech.png',
      	name:'Expert en système d\'information (bac+5)',
      	date:'2014 - 2017',
      	techs:[techs.cs, techs.cpp, techs.php, techs.java, techs.html,techs.js,techs.css, techs.security, techs.network]
      },{
      	name:'École 42',
      	image:'42.png',
      	school:'',
      	date:'2017 - 2018',
      	techs:[techs.c,techs.shell,techs.mac]
      }]
    }

    async initialized() {
      await super.initialized()
    }
  }

  return Home;
}, [
  new Properties('displayForm'),
  new Definition({
    layout: EmptyLayout,
    name: "cv-view",
    template: require("./home.html")
  })
])



/*
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

/**/