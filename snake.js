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

      for (var y = 0; y < _sizeX; y++) {
        html_string += '<div class=\'board-square board\' id=\'b_' + x + '_' + y + '\'></div>';
        _boardArray[x][y] = ' ';
      }

      html_string += '</div>'
    }

    $('#board-container').append(html_string);
    console.log('createBoard');

  };

  return {
    init: init,
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
  var _direction = 1;
  var _body = [];

  var changeDirection = function(direction) {
    if(directions[direction]) {
      _direction = directions[direction];
    }
  };

  return {
    changeDirection: changeDirection,
  };

})();



$(document).ready(function() {
  board.init();
});