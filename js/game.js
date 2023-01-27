'use strict';

// Game Elements Symbols:
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

// Model:
var gGame;
var gBoard;

// Intervals on Board:
var gCandyInterval;

// BackGround Music:
var music = new Audio('sounds/Background Music.mp3');

function play(elBtn) {
  elBtn.innerHTML = 'Re-Start';
  init();
}

function init() {
  music.volume = 0.2;
  music.play();
  // Restart Game Model:
  gGame = createGame();
  // Restart Hero Model:
  gHero = { pos: { i: 12, j: 5 }, isShoot: false };

  // Restart Alien Model
  gAliensTopRowIdx = 0;
  gAliensBottomRowIdx = 2;
  gIsAlienFreeze = false;
  gMovingToRight = true;
  gAliensGotToTheWall = false;

  // Clean Interval from prev game
  if (gShootInterval) clearInterval(gShootInterval);
  if (gIntervalAliens) clearInterval(gIntervalAliens);
  if (gCandyInterval) clearInterval(gCandyInterval);

  gBoard = createBoard(BOARD_SIZE);
  createHero(gBoard);
  createAliens(gBoard);
  renderBoard(gBoard);

  // Restart Dom:
  document.querySelector('.title').style.rotate = '0deg';
  document.querySelector('.modal').classList.add('hide');
  // Show Freeze Btn:
  document.querySelector('.freeze-btn').classList.remove('hide');

  // reStart score:
  updateScore(0);
  // Super Mode:
  document.querySelector('.super-mode span').innerHTML = gGame.superModeCount;
  // Super Shoot:
  document.querySelector('.super-shoot span').innerHTML = gGame.superShootCount;
  document.querySelector('.game-details').classList.remove('hide');

  //
  //
  gIntervalAliens = setInterval(moveAliens, ALIEN_SPEED);
  gCandyInterval = setInterval(showCandy, 10000);
}

function createGame() {
  return {
    isOn: true,
    aliensCount: 0,
    score: 0,
    isWin: false,
    superModeCount: 3,
    superShootCount: 2,
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
  document.querySelector('.modal h2').innerHTML = gGame.isWin ? 'You Won!🥳' : 'You Lost ☠';
  if (gGame.isWin) {
    document.querySelector('.title').style.rotate = '360deg';
    playSound('sounds/victory.wav');
  } else {
    playSound('sounds/lost game.wav');
  }
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

function handleCandyHit(candyPos) {
  // Play sound:
  playSound('sounds/candy-hit.wav');
  // Update Score +50
  updateScore(50);
  // Remove candy cell
  updateCell({ i: candyPos.i, j: candyPos.j });
  // Freeze Aliens for 5 secs
  gIsAlienFreeze = true;
  setTimeout(() => {
    gIsAlienFreeze = false;
  }, 5000);
}

function freezeGame(elBtn) {
  gIsAlienFreeze = !gIsAlienFreeze;
  elBtn.innerHTML = gIsAlienFreeze ? 'Unfreeze' : 'Freeze';
}
