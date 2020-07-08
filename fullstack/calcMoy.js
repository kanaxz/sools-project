var values = [
	[[6381,-6437],[350794,358834]],
	[[5579,-7355],[229340,497035]],
	[[4263,-7317],[300035,392846]]
]


function work(){
	var result = [0,0];
	for(var pair of values){
		var web = pair[0]
		var game = pair[1];
		for(var i=0;i<2;i++){
			result[i] += game[i] / (Math.abs(web[i]) )
		}
		
	}
	console.log(result[0]/ values.length )
	console.log(result[1]/ values.length )
}
work();