var board = (function() {
  var _sizeX = 40;
  var _sizeY = 40;
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

  var addToBoard = function(x, y, cssClass) {
    _cssClass = String(cssClass);
    _boardArray[x][y] =  _cssClass;
    $square = $('#' + arrayToDivID(x,y));

    if($square) {
      $square.addClass(_cssClass);
      $square.removeClass('empty-board');
    }

  };

  var arrayToDivID = function(x, y) {
    return 'b_' + x + '_' + y;
  };

  return {
    init: init,
    addToBoard: addToBoard,
  };

})();

var snake = (function() {
  var _head = {
    x: 20,
    y: 20,
  }

  var directions = {
    'up': 0,
    'right': 1,
    'down': 2,
    'left': 3,
  }

  const snakeClass = 'snake';
  var _direction = 1;
  var _body = [];
  var _board = null;

  var init = function(board) {
    _board = board;
    if(board) {
      _body.push([_head.x, _head.y])
      drawSnake();
    }
  };


  var drawSegment = function(segment) {
    _board.addToBoard(segment[0], segment[1], snakeClass);
  };

  var drawSnake = function() {
    _body.forEach(drawSegment);
  };

  var changeDirection = function(direction) {
    if(directions[direction]) {
      _direction = directions[direction];
    }
  };

  return {
    init: init,
    changeDirection: changeDirection,
  };

})();



$(document).ready(function() {
  board.init();
  snake.init(board);
});