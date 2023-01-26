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
console.log('lalala2');
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
  gGame.aliensCount--;
  var currCellElement = gBoard[pos.i][pos.j].gameObject;
  if (currCellElement === ALIEN) return;

  renderCell(pos, '💥');

  setTimeout(() => {
    updateCell(pos);
    if (!gGame.aliensCount) {
      gGame.isWin = true;
      gameOver();
    }
  }, 100);
  console.log(gBoard);
  updateScore(20);
  console.log(gGame.aliensCount);
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
