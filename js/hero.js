'use strict';
const LASER_SPEED = 60;
var gShootInterval;

var gHero = { pos: { i: 12, j: 5 }, isShoot: false };
// creates the hero and place it on board
function createHero(board) {
  board[gHero.pos.i][gHero.pos.j] = createCell(HERO);
}
// Handle game keys
function onKeyDown(ev) {
  if (ev.code === 'ArrowRight') moveHero(1);
  else if (ev.code === 'ArrowLeft') moveHero(-1);
  else if (ev.code === 'Space') shoot();
}
// Move the hero right (1) or left (-1)
function moveHero(dir) {
  var nextJ = gHero.pos.j + dir;
  if (nextJ < 0) return;
  if (nextJ >= gBoard[0].length) return;

  var nextCellPos = { i: gHero.pos.i, j: nextJ };
  // UPDATE MODEL & DOM LAST CELL
  updateCell(gHero.pos);
  // UPDATE  MODEL & DOM NEW CELL
  gHero.pos = nextCellPos;
  updateCell(gHero.pos, HERO);
  console.log(gBoard);
}
// Sets an interval for shutting (blinking) the laser up towards aliens
function shoot() {
  if (gHero.isShoot) return;
  gHero.isShoot = true;
  var shootPos = { i: gHero.pos.i, j: gHero.pos.j };
  gShootInterval = setInterval(blinkLaser, LASER_SPEED, shootPos);
}

// renders a LASER at specific cell for short time and removes it
function blinkLaser(pos) {
  pos.i--;
  var HitElement = gBoard[pos.i][pos.j].gameObject;
  if (HitElement === ALIEN || pos.i <= 0) {
    clearInterval(gShootInterval);
    gHero.isShoot = false;
  }
  // Display Laser:
  updateCell(pos, LASER);
  // Remove Lazer:
  setTimeout(() => {
    updateCell(pos);
    if (HitElement === ALIEN) handleAlienHit(pos);
  }, LASER_SPEED - 20);
}
