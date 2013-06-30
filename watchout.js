(function(){

  var gameOptions = {
    height: 450,
    width: 700,
    nPlayers: 2,
    nEnemies: 30,
    padding: 20
  };

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
    this.x = 50;
    this.y = 50;
    this.angle = 0;
  }
  Player.prototype.path = 'm-7.5,1.62413c0,-5.04095 4.08318,-9.12413 9.12414,-9.12413c5.04096,0 9.70345,5.53145 11.87586,9.12413c-2.02759,2.72372 -6.8349,9.12415 -11.87586,9.12415c-5.04096,0 -9.12414,-4.08318 -9.12414,-9.12415z';
  Player.prototype.class = "player";
  Player.prototype.setupDraggin = function(){

  };

  // Enemy Pseodo-Class
  // Enemy Constructor
  function Enemy(id){
    this.id = id;
    this.x = Math.random() * 100; // return a random scale factor
    this.y = Math.random() * 100;
  }
  Enemy.prototype.class = "enemy";
  Enemy.prototype.radius = 10;

  // Creates Player Data: Returns an Array of Player Objects
  function makePlayerObjects(){
    return _.range(gameOptions.nPlayers).map(function(i){
      return new Player(i);
    });
  }

  // Creates Enemy Data: Returns an Array of Enemy Objects
  function makeEnemyObjects(){
    return _.range(gameOptions.nEnemies).map(function(i){
      return new Enemy(i);
    });
  }

  function d3JoinData(target,data,callback){
    return gameBoard.selectAll(target).data(data, callback);
  }
  function updateEnemies(){
    // Data Join
    // make an array of new enemies and join then to svg objects
    var enemies = d3JoinData("circle.enemy", makeEnemyObjects(), function(d){return d.id;});

    var players = d3JoinData('path.player', makePlayerObjects(), function(d){return d.id;});

    // Enter
    // enemies.enter().append('circle')
    //   .attr('class', function(enemy){
    //     return enemy.class;
    //     })
    //   .attr('r', function(enemy){
    //     return enemy.radius;
    //     });

    // Update
    enemies.transition().duration(2000).ease('exp')
      .attr('cx', function(enemy){
        return axes.x(enemy.x);
        })
      .attr('cy', function(enemy){
        return axes.y(enemy.y);
        });


    // Exit
    // enemies.exit().remove();
    setTimeout(updateEnemies,2000);
  }

  function initializeEnemies(){
    d3JoinData('path.player', makePlayerObjects(), function(d){return d.id;}).enter()
      .append("path").
    d3JoinData("circle.enemy", makeEnemyObjects(), function(d){return d.id;})
      .enter().append("circle")
      .attr({cx: axes.x(50), cy: axes.y(50), r: 10})
      .transition().duration(2000).ease('back')
      .attr('class',function(e){return e.class;})
      .attr('cx', function(e){return axes.x(e.x);})
      .attr('cy', function(e){return axes.y(e.y);})
      .attr('r', function(e){return e.radius;})
      .each('end',updateEnemies);
 }

  initializeEnemies();

}).call(this);
