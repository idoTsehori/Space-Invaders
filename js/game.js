'use strict';

const BOARD_SIZE = 14;
const ALIENS_ROW_LENGTH = 8;
const ALIENS_ROW_COUNT = 3;
const HERO = '🤖';
const ALIEN = '👽';
const LASER = '⤊';
const SUPER_MODE_LASER = '🐱‍🏍';
const SKY = 'SKY';
const CANDY = '🍭';
const EMPTY = '';
const EARTH = 'EARTH';

var gCandyInterval;
// Matrix of cell objects. e.g.: {type: SKY, gameObject: ALIEN}
var gBoard;
var gGame;

function play(elBtn) {
  elBtn.innerHTML = 'Re-Start';
  init();
}

function init() {
  // Restart Game Model:
  gGame = createGame();
  // Restart Alien Model
  gAliensTopRowIdx = 0;
  gAliensBottomRowIdx = 2;
  gIsAlienFreeze = false;
  gMovingToRight = true;
  gAliensGotToTheWall = false;

  // Restart Dom:
  document.querySelector('.modal').classList.add('hide');
  document.querySelector('.score-msg').classList.remove('hide');
  updateScore(0);

  // Clean Interval from prev game
  if (gShootInterval) clearInterval(gShootInterval);
  if (gIntervalAliens) clearInterval(gShootInterval);
  if (gCandyInterval) clearInterval(gCandyInterval);

  gBoard = createBoard(BOARD_SIZE);
  createHero(gBoard);
  createAliens(gBoard);
  renderBoard(gBoard);
  //
  setInterval(moveAliens, ALIEN_SPEED);

  var candyInterval = setInterval(showCandy, 10000);
}

function createGame() {
  return {
    isOn: true,
    aliensCount: 0,
    score: 0,
    isWin: false,
  };
}

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

function createCell(gameObject = null) {
  return {
    type: SKY,
    gameObject: gameObject,
  };
}

function updateCell(pos, gameObject = null) {
  gBoard[pos.i][pos.j].gameObject = gameObject;
  var elCell = getElCell(pos);
  elCell.innerHTML = gameObject || '';
}

function gameOver() {
  gGame.isOn = false;
  gIsAlienFreeze = true;
  clearInterval(gIntervalAliens);
  clearInterval(gCandyInterval);
  document.querySelector('.modal').classList.remove('hide');
  document.querySelector('.modal h2').innerHTML = gGame.isWin ? 'You Won!🥳' : 'You Lost :(';
}

function showCandy() {
  var randomJ = getFistRowEmptyJ();
  if (!randomJ) return;
  // Show candy
  updateCell({ i: 0, j: randomJ }, CANDY);
  // After 5 secs hide candy:
  setTimeout(() => {
    updateCell({ i: 0, j: randomJ });
  }, 5000);
}
