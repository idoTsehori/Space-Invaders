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

function createAliens(board) {
  for (var i = 0; i < ALIENS_ROW_COUNT; i++) {
    for (var j = 0; j < ALIENS_ROW_LENGTH; j++) {
      board[i][j] = createCell(ALIEN);
      gGame.aliensCount++;
    }
  }
}

function handleAlienHit(pos) {
  // updateCell(pos);
  renderCell(pos, '💥');
  gGame.aliensCount--;

  setTimeout(() => {
    // renderCell(pos, '');
    updateCell(pos);
    if (!gGame.aliensCount) {
      gGame.isWin = true;
      gameOver();
    }
  }, 20);

  console.log(gGame.aliensCount);
  updateScore(20);
  // Check If there's no Aliens on board:
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

      // Update next cell
      newBoard[i][j + 1].gameObject = ALIEN;
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

      // Update next cell
      newBoard[i][j - 1].gameObject = ALIEN;
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

      if (newBoard[i + 1].gameObject === HERO) {
        checkLostGame();
        return;
      }
      // Update next cell
      newBoard[i + 1][j].gameObject = ALIEN;
    }
  }
  gAliensTopRowIdx++;
  gAliensBottomRowIdx++;
  gAliensGotToTheWall = !gAliensGotToTheWall;
  gBoard = newBoard;
  renderBoard(gBoard);
  return;
}

// runs the interval for moving aliens side to side and down
// it re-renders the board every time
// when the aliens are reaching the hero row - interval stops

function moveAliens() {
  if (gIsAlienFreeze) return;

  if (gAliensGotToTheWall) shiftBoardDown(gBoard, gAliensTopRowIdx, gAliensBottomRowIdx);
  else if (gMovingToRight) shiftBoardRight(gBoard, gAliensTopRowIdx, gAliensBottomRowIdx);
  else shiftBoardLeft(gBoard, gAliensTopRowIdx, gAliensBottomRowIdx);
}
// function moveAliens() {
//   if (gIsAlienFreeze) return;
//   if (gMovingToRight) {
//     gIntervalAliens = setInterval(
//       shiftBoardRight,
//       1000,
//       gBoard,
//       gAliensTopRowIdx,
//       gAliensBottomRowIdx
//     );
//     if (gAliensGotToTheWall) {
//       clearInterval(gIntervalAliens);
//       gIntervalAliens = undefined;
//     }
//   }
//   if (gAliensGotToTheWall) {
//     console.log('yoyu');
//     gIntervalAliens = setInterval(
//       shiftBoardDown,
//       1000,
//       gBoard,
//       gAliensTopRowIdx,
//       gAliensBottomRowIdx
//     );
//   }

// if (gMovingToRight) shiftBoardRight(newBoard, fromI, toI);
//   renderBoard(newBoard);
//   gBoard = newBoard;
// }

function checkLostGame() {
  clearInterval(gIntervalAliens);
  console.log('You Lose!');
}
