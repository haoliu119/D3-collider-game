(function(){
	var gameOptions,gameBoard;

	gameOptions = {
		height: 450,
		width: 700,
		nEnemies: 30,
		padding: 20
	}

	gameBoard = d3.select(".container").append("svg")
		.attr('width', gameOptions.width)
		.attr('height', gameOptions.height);
}).call(this);