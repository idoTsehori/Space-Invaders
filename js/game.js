'use strict';

const BOARD_SIZE = 14;
const ALIENS_ROW_LENGTH = 8;
const ALIENS_ROW_COUNT = 3;
const HERO = '♆';
const ALIEN = '👽';
const LASER = '⤊';
const SKY = 'SKY';
const EMPTY = '';
const EARTH = 'EARTH';

// Matrix of cell objects. e.g.: {type: SKY, gameObject: ALIEN}
var gBoard;
var gNewBoard;

var gGame = {
  isOn: false,
  aliensCount: 0,
  score: 0,
  isWin: false,
};

// Called when game loads
function init() {
  // Game Model:
  gGame.isOn = true;
  gGame.aliensCount = 0;
  gGame.score = 0;
  gGame.isWin = false;
  // Alien Model
  gAliensTopRowIdx = 0;
  gAliensBottomRowIdx = 2;
  gIsAlienFreeze = false;
  gMovingToRight = true;
  gAliensGotToTheWall = false;

  // Dom:
  document.querySelector('.modal').classList.add('hide');
  updateScore(0);

  gBoard = createBoard(BOARD_SIZE);
  createHero(gBoard);
  createAliens(gBoard);
  renderBoard(gBoard);
  //
  setInterval(moveAliens, ALIEN_SPEED);
}
// Create and returns the board with aliens on top, ground at bottom
// use the functions: createCell, createHero, createAliens
function createBoard(size) {
  var board = [];
  for (var i = 0; i < size; i++) {
    board[i] = [];
    for (var j = 0; j < size; j++) {
      board[i][j] = createCell();
      if (i === size - 1) board[i][j].type = EARTH;
    }
  }

  return board;
}
// Render the board as a <table> to the page
function renderBoard(board) {
  var strHTML = '';
  for (var i = 0; i < board.length; i++) {
    strHTML += '<tr>';
    for (var j = 0; j < board[0].length; j++) {
      var cellData = `data-i="${i}" data-j="${j}"`;
      var currCell = board[i][j];
      var cellClass = currCell.type === SKY ? 'sky' : 'earth';
      var currCellContent = currCell.gameObject ? currCell.gameObject : EMPTY;
      strHTML += `<td class="cell ${cellClass}" ${cellData}>${currCellContent}</td>`;
    }
    strHTML += '</tr>';
  }
  var elBoard = document.querySelector('.board');
  elBoard.innerHTML = strHTML;
}
// Returns a new cell object. e.g.: {type: SKY, gameObject: ALIEN}
function createCell(gameObject = null) {
  return {
    type: SKY,
    gameObject: gameObject,
  };
}
// position such as: {i: 2, j: 7}
function updateCell(pos, gameObject = null) {
  gBoard[pos.i][pos.j].gameObject = gameObject;
  var elCell = getElCell(pos);
  elCell.innerHTML = gameObject || '';
}

function gameOver() {
  gGame.isOn = false;
  document.querySelector('.modal').classList.remove('hide');
  document.querySelector('.modal h2').innerHTML = gGame.isWin ? 'You Won!🥳' : 'You Lost :(';
}
