var words = {
	datas:'Données',
	users:'utilisateurs',
	groups:'groupes',
	userGroups:'Lien groupe-utilisateur'
}

function lang(key){
	var word = words[key];
	return word || key
}

window.lang = lang;