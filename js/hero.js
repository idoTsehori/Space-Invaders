'use strict'
const LASER_SPEED = 50
const SUPER_MODE_SPEED = 25
var gIsSuperShoot = false
var gIsSuperMode = false
var gShootInterval

var gHero = { pos: { i: 12, j: 5 }, isShoot: false }

// creates the hero and place it on board
function createHero(board) {
	board[gHero.pos.i][gHero.pos.j] = createCell(HERO)
}

// Handle game keys
function onKeyDown(ev) {
	if (!gGame.isOn) return
	console.log(ev.code)
	if (ev.code === 'ArrowRight') moveHero(1)
	else if (ev.code === 'ArrowLeft') moveHero(-1)
	else if (ev.code === 'Space') shoot()
	else if (ev.code === 'KeyN') {
		gIsSuperShoot = true
		shoot()
	} else if (ev.code === 'KeyX') {
		gIsSuperMode = true
		shoot()
	}
}

// Move the hero right (1) or left (-1)
function moveHero(dir) {
	var nextJ = gHero.pos.j + dir
	if (nextJ < 0) return
	if (nextJ >= gBoard[0].length) return

	var nextCellPos = { i: gHero.pos.i, j: nextJ }
	// UPDATE MODEL & DOM LAST CELL
	updateCell(gHero.pos)
	// UPDATE  MODEL & DOM NEW CELL
	gHero.pos = nextCellPos
	updateCell(gHero.pos, HERO)
	console.log(gBoard)
}

// Sets an interval for shutting (blinking) the laser up towards aliens
function shoot() {
	if (gHero.isShoot) return
	gHero.isShoot = true
	var shootPos = { i: gHero.pos.i, j: gHero.pos.j }
	gShootInterval = setInterval(blinkLaser, LASER_SPEED, shootPos)
}

// renders a LASER at specific cell for short time and removes it
function blinkLaser(pos) {
	var currentShoot = gIsSuperMode ? LASER_SPEED : SUPER_MODE_SPEED
	pos.i--

	var HitElement = gBoard[pos.i][pos.j].gameObject
	if (HitElement === ALIEN || pos.i <= 0) {
		gHero.isShoot = false
		clearInterval(gShootInterval)
		gIsSuperMode = false
	}

	// Display Laser:
	if (gIsSuperMode) updateCell(pos, SUPER_MODE_LASER)
	else updateCell(pos, LASER)

	// Remove Lazer:
	setTimeout(() => {
		if (HitElement === ALIEN) {
			playSound('sounds/explode.wav')
			handleAlienHit(pos)
			return
		}

		updateCell(pos)
	}, currentShoot - 17)
}
