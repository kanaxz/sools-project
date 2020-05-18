const constantes = require("./shared/constantes");
const fs = require("fs");

function work(){
	var scss = ".ressource {";
	for(var ressourceType of constantes.ressourceTypes){
		scss += `
	&.${ressourceType}{
		&.icon{
			background-image: url(/assets/images/ressources/${ressourceType}.png);
		}
	}
		`
	}
	scss +=`
}`
	fs.writeFileSync("./client/generated.scss",scss);
}

work();