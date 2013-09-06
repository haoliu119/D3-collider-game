(function(){

  var gameOptions = {
    height: 450,
    width: 700,
    nPlayers: 1,
    nEnemies: 10,
    padding: 20
  };
  var gameStats = {
    score: 0,
    bestScore: 0
  };
  // gameBoard is a d3 SVG object
  var $board = $('.container');
  var gameBoard = d3.select(".container").append("svg")
    .attr('width', gameOptions.width)
    .attr('height', gameOptions.height)
    .attr('class','gameBoard');

  var axes = {
    x: d3.scale.linear().domain([0,100]).range([0,gameOptions.width]), // d3.scale is both an object and a function which can take in data to compute with
    y: d3.scale.linear().domain([0,100]).range([0,gameOptions.height])
  };

  // Player Pseudo-Class
  // Player Constructor
  function Player(id){
    this.id = id;
    this.x = 300;
    this.y = 300;
    this.active = false;
  }
  function updateBestScore(){
    gameStats.bestScore = _.max([gameStats.bestScore, gameStats.score]);
    return d3.select('#best-score').text(gameStats.bestScore.toString());
  }
  function updateScore() {
    return d3.select('#current-score').text(gameStats.score.toString());
  };
  function increaseScore() {
    gameStats.score += 1;
    updateBestScore();
    return updateScore();
  }
  function flashBoard(){
    $board.addClass('flash');
    setTimeout(function(){$board.removeClass('flash');},100);
    // $board.animate({background: 'red'},500,function(){$board.css({background: 'white'});});
  }
	  // Player.prototype = Object.create(Elvis.prototype);
	  // Player.prototype.constructor = Player;
  Player.prototype.path = 'm-7.5,1.62413c0,-5.04095 4.08318,-9.12413 9.12414,-9.12413c5.04096,0 9.70345,5.53145 11.87586,9.12413c-2.02759,2.72372 -6.8349,9.12415 -11.87586,9.12415c-5.04096,0 -9.12414,-4.08318 -9.12414,-9.12415z';
  Player.prototype.class = "player";
  Player.prototype.radius = 5;
  // Player.prototype.minX = Player.prototype.minY = gameOptions.padding;
  // Player.prototype.maxX = gameOptions.width - gameOptions.padding;
  // Player.prototype.maxY = gameOptions.height - gameOptions.padding;
  // Player.prototype.limitX = function(x){
  	// this.x = x < this.minX ? this.minX : x > this.maxX ? this.maxX : x;
  // }
  // Player.prototype.limitY = function(y){
  	// this.y = y < this.minY ? this.minY : y > this.maxY ? this.maxY : y;
  // }

  // Enemy Pseodo-Class
  // Enemy Constructor
  function Enemy(id){
    this.id = id;
    this.x = Math.random() * 100; // return a random scale factor
    this.y = Math.random() * 100;
  }
  Enemy.prototype.class = "enemy";
  Enemy.prototype.radius = 10;
  Enemy.prototype.render = function(){
  	// this.el = 
  	// return this;
  }

  // Creates Player Data: Returns an Array of Player Objects
  // function makePlayerObjects(){
  //   return _.range(gameOptions.nPlayers).map(function(i){
  //     return new Player(i);
  //   });
  // }
  // Creates Enemy Data: Returns an Array of Enemy Objects
  function makeEnemyObjects(){
    return _.range(gameOptions.nEnemies).map(function(i){
      return new Enemy(i);
    });
  }
  function tweenDetectCollision(data){
  	var enemy = d3.select(this),
  	startPos = {
  		x: parseFloat(enemy.attr('cx')),
  		y: parseFloat(enemy.attr('cy'))
  	},
  	endPos = {
  		x: axes.x(data.x),
  		y: axes.y(data.y)
  	};
  	return function (t){
  		var nextPos = {
  			x: startPos.x + (endPos.x - startPos.x) * t,
  			y: startPos.y + (endPos.y - startPos.y) * t
  		}
      checkCollision(enemy);
  		return enemy.attr('cx', nextPos.x).attr('cy', nextPos.y);
  	}
  }
  function checkCollision(enemy){
    // return function(player) {
      var radiusSum, separation, xDiff, yDiff;
      radiusSum = parseFloat(enemy.attr('r')) + player.radius;
      xDiff = parseFloat(enemy.attr('cx')) - player.x;
      yDiff = parseFloat(enemy.attr('cy')) - player.y;
      separation = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));
      if (separation < radiusSum) return onCollision();
    // }
  };
  function onCollision() {
      updateBestScore();
      flashBoard();
      gameStats.score = 0;
      return updateScore();
    };
  function updateEnemies(){
    $enemies = gameBoard.selectAll('circle.enemy').data(makeEnemyObjects(),function(d){return d.id;});
    $enemies.transition().duration(2000).ease('elastic')
      .attr('fill', randomColor())
    	.tween('custom', tweenDetectCollision);
    // enemies.exit().remove();
    setTimeout(updateEnemies,2000);
  }
  function randomColor(){
  	return '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6);
  }
  function initialRender(){
  	// Initializes Players
	  // $players.enter().append("path")
	  //   	.attr('class',function(p){return p.class;})
	  //   	.attr('d',function(p){return p.path;})
	  //   	.attr('r',function(p){return p.radius;})
	  //   	.attr('angle',function(p){return p.angle;})
	  //   	.attr('transform','translate(300,300)')
	  //   	.on('click',function(d, i){console.log(d,i);});
    player.el = gameBoard.selectAll('path.player')
      .data([player],function(d){return d.id})
      .enter().append("path")
          .attr({
            class: player.class,
            d: player.path,
            r: player.radius,
          })
          .attr('transform',('translate('+player.x+','+player.y+')')+('rotate(-90)'))
          .on('click',function(d, i){
            if (player.active){
              player.active = false;
              player.el.classed('active',false);
            }else{
              player.active = true;
              player.el.classed('active',true);
            }
          });
	  // Initializes Enemies
    $enemies.enter().append("circle")
	      .attr({cx: axes.x(50), cy: axes.y(50), r: 10})
	      .attr('class',function(e){return e.class;})
	      .attr('fill',randomColor())
	      .on('click',function(){
	      	$enemies.on('click',null);
	      	updateEnemies();
          setInterval(increaseScore, 50);
			  });
 }
  // Initializing Enemy and Player Objects
  var $enemies = gameBoard.selectAll('circle.enemy').data(makeEnemyObjects(),function(d){return d.id;});
  // var $players = gameBoard.selectAll('path.player').data(makePlayerObjects(),function(d){return d.id;});
  var player = new Player(1);


  initialRender();
  gameBoard.on('mousemove',movePlayer);
  function movePlayer(d,i){
    if (player.active){
    	var mouse = {
    		x: d3.mouse(this)[0],
    		y: d3.mouse(this)[1]
    	}
      var delta={
        x: mouse.x-player.x,
        y: mouse.y-player.y
      }
      var angle = 360 * (Math.atan2(delta.y, delta.x) / (Math.PI * 2))
      player.x = mouse.x;
      player.y = mouse.y;
    	return player.el.attr('transform',('translate('+player.x+','+player.y+')')+('rotate('+angle+')'));
    }
  };

}).call(this);
