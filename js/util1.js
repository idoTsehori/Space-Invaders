'use strict';
// Returns a new cell object. e.g.: {type: SKY, gameObject: ALIEN}
function createCell(gameObject = null) {
  return {
    type: SKY,
    gameObject: gameObject,
  };
}
function getElCell(pos) {
  return document.querySelector(`[data-i='${pos.i}'][data-j='${pos.j}']`);
}

function renderCell(location, value) {
  const elCell = getElCell(location);
  elCell.innerHTML = value;
}

function updateScore(diff) {
  // update model and dom
  gGame.score += diff;
  var elSpan = document.querySelector('h2 .score-count');
  elSpan.innerText = gGame.score;
}

function copyMat(mat) {
  var newMat = [];
  for (var i = 0; i < mat.length; i++) {
    newMat[i] = [];
    for (var j = 0; j < mat[0].length; j++) {
      newMat[i][j] = mat[i][j];
    }
  }
  return newMat;
}
function newMat(board) {
  var newBoard = [];
  for (var i = 0; i < board.length; i++) {
    newBoard[i] = [];
    for (var j = 0; j < board[0].length; j++) {
      newBoard[i][j] = createCell();
    }
  }
  return newBoard;
}

// function shiftBoardRight(board, fromI, toI) {
//   for (var i = fromI; i <= toI; i++) {
//     for (var j = board[0].length - 1; j >= 0; j--) {
//       var currCell = board[i][j];
//       if (currCell.gameObject !== ALIEN) continue;
//       var newJ = j + 1;
//       if (newJ === board[0].length) {
//         gAliensGotToTheWall = true;
//         return;
//       }
//       // Update Current cell
//       updateCell({ i, j });
//       // Update Next  cell
//       updateCell({ i: i, j: newJ }, ALIEN);
//     }
//   }
// }

// function shiftBoardLeft(board, fromI, toI) {
//   for (var i = fromI; i <= toI; i++) {
//     for (var j = 0; j < board[0].length; j++) {
//       var currCell = board[i][j];
//       if (currCell.gameObject !== ALIEN) continue;
//       var newJ = j - 1;
//       if (newJ < 0) {
//         gAliensGotToTheWall = !gAliensGotToTheWall;
//         return;
//       }
//       // Update Current cell
//       updateCell({ i, j });
//       // Update Next  cell
//       updateCell({ i: i, j: newJ }, ALIEN);
//     }
//   }
// }

// function shiftBoardDown(board, fromI, toI) {
//   for (var i = toI; i >= fromI; i--) {
//     for (var j = 0; j < board[0].length; j++) {
//       var currCell = board[i][j];
//       if (currCell.gameObject !== ALIEN) continue;
//       var nextPos = { i: i + 1, j: j };
//       // Update Current cell
//       updateCell({ i, j });
//       // Update Next  cell
//       updateCell(nextPos, ALIEN);
//       if (board[nextPos.i][nextPos.j].gameObject === HERO) {
//         checkLostGame();
//       }
//     }
//   }
//   gAliensGotToTheWall = false;
//   gMovingToRight = !gMovingToRight;
//   gAliensTopRowIdx++;
//   gAliensBottomRowIdx++;
// }

// function moveAliens() {
//   if (gIsAlienFreeze) return;

//   if (gAliensGotToTheWall) shiftBoardDown(gBoard, gAliensTopRowIdx, gAliensBottomRowIdx);
//   else if (gMovingToRight) shiftBoardRight(gBoard, gAliensTopRowIdx, gAliensBottomRowIdx);
//   else shiftBoardLeft(gBoard, gAliensTopRowIdx, gAliensBottomRowIdx);
// }
