'use strict';

const ALIEN_SPEED = 500;
var gIntervalAliens;

// The following two variables represent the part of the matrix (some rows)
// that we should shift (left, right, and bottom)
// We need to update those when:
// (1) shifting down and (2) last alien was cleared from row
var gAliensTopRowIdx = 0;
var gAliensBottomRowIdx = 2;

var gIsAlienFreeze;
var gMovingToRight;
var gAliensGotToTheWall;
var gHideFireTimeout;
var gPosOnFire;

function gHideFire() {
  if (gPosOnFire) updateCell(gPosOnFire);
  gPosOnFire = null;
  checkLostGame();
  if (gGame.isWin) gameOver();
}

function createAliens(board) {
  for (var i = 0; i < ALIENS_ROW_COUNT; i++) {
    for (var j = 0; j < ALIENS_ROW_LENGTH; j++) {
      board[i][j] = createCell(ALIEN);
      gGame.aliensCount++;
    }
  }
}

function handleAlienHit(pos) {
  if (gIsSuperShoot) {
    KillNegs(gBoard, pos.i, pos.j, pos);
    gIsSuperShoot = false;
    return;
  }
  // gGame.aliensCount--;
  var currCellElement = gBoard[pos.i][pos.j].gameObject;
  if (currCellElement === ALIEN) return;

  renderCell(pos, '💥');
  gPosOnFire = pos;

  gHideFireTimeout = setTimeout(() => gHideFire(), 100);
  updateScore(20);
}

function shiftBoardRight(board, fromI, toI) {
  var newBoard = copyMat(board);
  for (var i = fromI; i <= toI; i++) {
    for (var j = board[0].length - 1; j >= 0; j--) {
      var currCell = board[i][j];
      if (currCell.gameObject !== ALIEN) continue;
      var newJ = j + 1;
      if (newJ >= board[0].length) {
        gAliensGotToTheWall = !gAliensGotToTheWall;
        gMovingToRight = !gMovingToRight;
        return;
      }
      // Update Current cell
      newBoard[i][j].gameObject = null;

      var nextCell = newBoard[i][j + 1];
      if (nextCell.gameObject === HERO) {
        gameOver();
        return;
      }
      // Update next cell
      nextCell.gameObject = ALIEN;
    }
  }
  gBoard = newBoard;
  renderBoard(gBoard);
}

function shiftBoardLeft(board, fromI, toI) {
  var newBoard = copyMat(board);
  for (var i = fromI; i <= toI; i++) {
    for (var j = 0; j < board[0].length; j++) {
      var currCell = board[i][j];
      if (currCell.gameObject !== ALIEN) continue;
      var newJ = j - 1;
      if (newJ < 0) {
        gAliensGotToTheWall = !gAliensGotToTheWall;
        gMovingToRight = !gMovingToRight;
        return;
      }
      // Update Current cell
      newBoard[i][j].gameObject = null;
      var nextCell = newBoard[i][j - 1];
      if (nextCell.gameObject === HERO) {
        gameOver();
        return;
      }
      // Update next cell
      nextCell.gameObject = ALIEN;
    }
  }
  gBoard = newBoard;
  renderBoard(gBoard);
}

function shiftBoardDown(board, fromI, toI) {
  var newBoard = copyMat(board);
  for (var i = toI; i >= fromI; i--) {
    for (var j = 0; j < board[0].length; j++) {
      var currCell = board[i][j];
      if (currCell.gameObject !== ALIEN) continue;
      // Update Current cell
      newBoard[i][j].gameObject = null;
      var nextCell = newBoard[i + 1][j];
      // Check Lose:
      if (
        nextCell.gameObject === HERO ||
        getElCell({ i: i + 1, j: j }).classList.contains('earth')
      ) {
        gameOver();
        return;
      }
      // Update next cell
      nextCell.gameObject = ALIEN;
    }
  }
  gAliensTopRowIdx++;
  gAliensBottomRowIdx++;
  gAliensGotToTheWall = !gAliensGotToTheWall;
  gBoard = newBoard;
  renderBoard(gBoard);
  return;
}

function moveAliens() {
  if (gIsAlienFreeze) return;
  /* to maybe remove
    check if there is timeout (someone on fire)
      if yes -> cleanup and do what timeout was supposed to do
      if no -> don't do anything 
  end */
  if (gHideFireTimeout) {
    clearTimeout(gHideFireTimeout);
    gHideFire();
  }

  if (gAliensGotToTheWall) shiftBoardDown(gBoard, gAliensTopRowIdx, gAliensBottomRowIdx);
  else if (gMovingToRight) shiftBoardRight(gBoard, gAliensTopRowIdx, gAliensBottomRowIdx);
  else shiftBoardLeft(gBoard, gAliensTopRowIdx, gAliensBottomRowIdx);
}

function checkLostGame() {
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[0].length; j++) {
      var currCell = gBoard[i][j];
      if (currCell.gameObject === ALIEN) return;
    }
  }
  gGame.isWin = true;
}
