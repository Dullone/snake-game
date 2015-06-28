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
    if(outOfBounds(loc)){
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
    if(loc[0] > _sizeX -1 || loc[1] > _sizeY -1 || loc[0] < 0 || loc[1] < 0) {
      return true;
    }
    return false;
  };

  return {
    init: init,
    addToBoard: addToBoard,
    removeFromBoard: removeFromBoard,
    outOfBounds: outOfBounds,
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
  var _tick_interval = 200;

  var init = function(board) {
    _board = board;
    if(board) {
      _body.push([_head.x, _head.y])
      drawSnake();
      _direction = directions.right;
      setTimeout(tick, _tick_interval);
    }
  };


  var drawSegment = function(segment) {
    _board.addToBoard(segment, snakeClass);
  };

  var drawSnake = function() {
    _body.forEach(drawSegment);
  };


  var changeDirection = function(direction) {
    if(directions[direction]) {
      _direction = directions[direction];
    }
  };

  var move = function() {
    //add segement in direction currently pointed
    var new_head = nextMove();
    _body.unshift(new_head);
    removeLastSegment();
  };

  //position where we are pointed and will move to next tick
  var nextMove = function() {
    return [_body[0][0] + _direction[0], _body[0][1] + _direction[1]];
  };

  var removeLastSegment = function() {
    _board.removeFromBoard(_body.pop(), snakeClass);
  };

  var tick = function() {
    //check if hit self
    //check if hit  wall, game over
    if(_board.outOfBounds(nextMove())) {
      console.log('out of bounds');
      return;
    };
    //move snake
    move();
    drawSnake();
    setTimeout(tick, _tick_interval);

  };

  return {
    init: init,
    changeDirection: changeDirection,
  };

})();

var input = function() {

  var getInput = function(event) {
    console.log('getinput ' + event.keyCode);
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

$(document).ready(function() {
  board.init();
  snake.init(board);
  input.init('body', snake);
});