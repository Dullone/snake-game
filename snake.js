var board = (function() {
  const _sizeX = 40;
  const _sizeY = 40;
  _boardArray = [];

  var init = function() {
    createBoard();
  };

  var createBoard = function() {
    var html_string = '';
    for (var x = 0; x < _sizeX; x++) {
      
      _boardArray[x] = [];
      html_string += '<div class="row">'

      for (var y = 0; y < _sizeY; y++) {
        html_string += '<div class=\'board-square empty-board\' id=' + 
                        arrayToDivID(x,y) +  '></div>';
        _boardArray[x][y] = ' ';
      }

      html_string += '</div>'
    }

    $('#board-container').empty();
    $('#board-container').append(html_string);
    console.log('createBoard');

  };

  var toggleBoardClass = function(loc, _cssClass){
    $square = $('#' + arrayToDivID(loc[0], loc[1]));

    if($square) {
      $square.toggleClass(_cssClass);
      $square.toggleClass('empty-board');
    }

  };

  var addToBoard = function(loc, cssClass) {
    if(outOfBounds(loc) || _boardArray[loc[0]][loc[1]] != ' '){
      return false;
    }
    _cssClass = String(cssClass);
    _boardArray[loc[0]][loc[1]] =  _cssClass;
    toggleBoardClass(loc, _cssClass);
    return true;
  };

  var removeFromBoard = function(loc, cssClass) {
    if(outOfBounds(loc)){
      return false;
    }
    _cssClass = String(cssClass);
    if (_boardArray[loc[0]][loc[1]] ===  _cssClass) {
      _boardArray[loc[0]][loc[1]] =  " ";
      toggleBoardClass(loc, cssClass);
    }
    return true;
  };

  var arrayToDivID = function(x, y) {
    return 'b_' + x + '_' + y;
  };

  var outOfBounds = function(loc) {
    if(loc[0] < _sizeX && loc[1] < _sizeY && loc[0] >= 0 && loc[1] >= 0) {
      return false;
    }
    console.log('out of bounds');
    return true;
  };

  //Chechs for valid array and if inbounds
  var validBoardLocation = function(loc) {
    if(Array.isArray(loc) &&  loc.length == 2 && !outOfBounds(loc)){
      return true;
    }

    return false;
  };

  var randomSlot = function() {
    var slotX = Math.floor(Math.random()  * _sizeX);
    var slotY = Math.floor(Math.random() * _sizeY);

    //if not empty, traverse array for first empty slot
    if(_boardArray[slotX][slotY] != ' ') {
      //from random slot to the end of the array
      for(var x = slotX; x < _sizeX; x++) {
        for(var  y = slotY; y < _sizeY; y++) {
          if(_boardArray[x][y] === ' ') {
            return [x, y];
          }
        }
      }

      //if not found, check from begining of board to random slot
      for(var x = 0; x < slotX; x++) {
        for(var y = 0; y < slotY; y++) {
          if(_boardArray[x][y] === ' ') {
            return [x, y];
          }
        }
      }

    } else {
      return [slotX, slotY];
    }

    //empty slot not fond, return false
    return false;

  };

  var getObjectAtLocation = function(loc) {
    if(validBoardLocation(loc)) {
      return _boardArray[loc[0]][loc[1]]
    }
  };

  return {
    init: init,
    addToBoard: addToBoard,
    removeFromBoard: removeFromBoard,
    outOfBounds: outOfBounds,
    getObjectAtLocation: getObjectAtLocation,
    randomSlot: randomSlot,
  };

})();

var snake = (function() {
  var _head = {
    x: 20,
    y: 20,
  }

  var directions = {
    'up':     [-1,0],
    'right':  [0,1],
    'down':   [1,0],
    'left':   [0,-1],
  }

  const snakeClass = 'snake';
  var _direction = 1;
  var _body = [];
  var _board = null;
  var _dead = false;

  var init = function(board) {
    _board = board;
    
    if(board) {
      
      _body = [];
      _dead = false
      _direction = directions['right'];

      _body.push([_head.x, _head.y])
      drawSnake();
      _direction = directions.right;
    }
  };


  var drawSegment = function(segment) {
    _board.addToBoard(segment, snakeClass);
  };

  var drawSnake = function() {
    _body.forEach(drawSegment);
  };


  var changeDirection = function(direction) {
    var _oldDirection = _direction;
    //if one of the valid four directions
    if(directions[direction]) {
      _direction = directions[direction];
    }

    //don't alow a  180 degree turn
    var moveLocation = [_body[0][0] + _direction[0], _body[0][1] + _direction[1]]
    if(_body.length > 1 && moveLocation[0] === _body[1][0] && 
                              moveLocation[1] === _body[1][1]){
      _direction = _oldDirection;
    }
  };

  var move = function() {
    //add segement in direction currently pointed
    var new_head = nextMove();
    if(hitSelfCheck(new_head)){
      _dead = true;
      return;
    };

    var ate = foodCheck(new_head)
    if(ate) {
      game.eatFood();
    }
    //move snake forward one
    _body.unshift(new_head);
    
    if(!ate){
      removeLastSegment();
    }
  };

  var foodCheck = function(loc) {
    if(_board.getObjectAtLocation(loc) === game.cssFood ) {
      return true;
    }

    return false;
  };

  //position where we are pointed and will move to next tick
  var nextMove = function() {
    return [_body[0][0] + _direction[0], _body[0][1] + _direction[1]];
  };

  var hitSelfCheck = function(loc){
    if(board.getObjectAtLocation(loc) === snakeClass){
      return true;
    }
    return false;
  };

  var removeLastSegment = function() {
    _board.removeFromBoard(_body.pop(), snakeClass);
  };

  var tick = function() {
    //check if hit  wall
    if(wallHit()) {
      _dead = true;
      return;
    };
    //move snake
    move();
    drawSnake();
    
  };

  var wallHit = function() {
    if(_board.outOfBounds(nextMove())) {
      console.log('out of bounds');
      return true;
    }
    return false;
  };

  var dead = function() {
    return _dead;
  };

  return {
    init: init,
    changeDirection: changeDirection,
    tick: tick,
    dead: dead,
  };

})();

var directionInput = function() {

  var getInput = function(event) {
    switch(event.keyCode) {
      case 'w'.charCodeAt(0): 
        _listener.changeDirection('up');
        break;
      case 'a'.charCodeAt(0):
        _listener.changeDirection('left');
        break;
      case 'd'.charCodeAt(0): 
        _listener.changeDirection('right');
        break;
      case 's'.charCodeAt(0): 
        _listener.changeDirection('down');
        break;

    }
  };

  var init = function(container, listener) {
    _listener = listener;
    $(container).keypress(getInput);
  };

  return {
    init: init,
  };

}();

var game = function() {

  var _tick_interval = 250;
  const speedUpFactor = .92;
  const min_interval = 100;
  var _nextTick = null;
  const _cssFood = 'food';
  var _foodLocation = null;
  var _score = 0;

  var init = function(board, snake) {
    _board = board;
    _snake = snake;
    _tick_interval = 250;
    _foodLocation = null;
    _score = 0;
    clearTimeout(_nextTick);
    updateScore();
    changeButtonColor(false);
    $('#game-over').empty();

    _nextTick = setTimeout(tick, _tick_interval);
  };

  var tick = function() {
    
    _snake.tick();
    if(_snake.dead()) {
      gameOver();
      return;
    }
    addFood();
    _nextTick = setTimeout(tick, _tick_interval);
  };

  var gameOver = function(message) {
    message = message || "Game Over";
    changeButtonColor(true);
    $('#game-over').append(message);
    if(_nextTick) {
      clearTimeout(_nextTick);
    }
  };

  var changeButtonColor = function(emphasis){
    if(!emphasis){
      $('#reset').addClass('normal-btn');
      $('#reset').removeClass('warn');
    } else {
      $('#reset').removeClass('normal-btn');
      $('#reset').addClass('warn');
    }
  };
  
  //add food if no food on board
  var addFood = function() {
    if(_foodLocation) {
      return;
    }

    var slot = _board.randomSlot();
    if(slot){
      _board.addToBoard(slot, _cssFood)
      _foodLocation = slot;
      console.log('food added: ' + _foodLocation);
    } else {
      //board is full
      gameOver("Congratulations, you won!");
    };

  };

  var eatFood = function() {
    _board.removeFromBoard(_foodLocation, _cssFood);
    _foodLocation = null;
    _score += 10;
    updateScore();
    speedUpGame();
  };

  var updateScore = function(){
    $('#score').text(_score)
  };

  var speedUpGame = function(){
    _tick_interval *= speedUpFactor;
    if(_tick_interval < min_interval){
      _tick_interval = min_interval;
    }
  };

  return {
    init: init,
    cssFood: _cssFood,
    eatFood: eatFood,
  }
}();

$(document).ready(function() {

  var makeGame = function(){
    board.init();
    snake.init(board);
    directionInput.init('body', snake);
    game.init(board, snake);
  }

  makeGame();

  $('#reset').click(function(event) {
    this.blur();
    makeGame();    
  });
});