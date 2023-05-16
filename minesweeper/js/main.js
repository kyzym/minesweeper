import { setColor } from './setColor.js';
import { flagSound, loseSound, stepSound, winSound } from './sound.js';
console.log({ flagSound, loseSound, stepSound, winSound });

const SIZE = 10;
const MINES = 10;
const GAME_OVER_MSG = 'Game over. Try again';
const VICTORY_MSG = 'Hooray! You found all mines in ';

let moves = 0;
let startTime;
let firstMoveMade = false;
let gameOver = false;
let intervalId = null;

let movesEmoji = '👞';
let timeEmoji = '⏱';
let restartEmoji = '😊';
const controlsContainer = document.createElement('div');
controlsContainer.className = 'controls';

const board = Array(SIZE)
  .fill()
  .map(() => Array(SIZE).fill(0));
const mineLocations = new Set();
const openedCells = new Set();
const flaggedCells = new Set();

const gameContainer = createDiv('game-container');
const container = createDiv('minesweeper');
const timeDisplay = createDiv('time-display', 'control');
const movesDisplay = createDiv('moves-display', 'control');
const restartButton = createButton(
  'restart-button',
  restartEmoji,
  initializeGame
);

updateTimeDisplay(0);
updateMovesDisplay(0);

document.body.appendChild(gameContainer);
gameContainer.appendChild(controlsContainer);
gameContainer.appendChild(container);

controlsContainer.appendChild(timeDisplay);
controlsContainer.appendChild(restartButton);
controlsContainer.appendChild(movesDisplay);

function createDiv(className, classNameSecond) {
  const div = document.createElement('div');
  div.classList.add(className);
  classNameSecond && div.classList.add(classNameSecond);
  return div;
}

function createButton(className, emoji, onClick) {
  const button = document.createElement('button');
  button.className = className;
  const buttonContent = createDiv('button-emoji');
  button.appendChild(buttonContent);
  buttonContent.textContent = emoji;
  button.addEventListener('click', onClick);
  button.buttonContent = buttonContent;
  return button;
}

function updateTimeDisplay(time) {
  timeDisplay.innerHTML = `${timeEmoji} ${time}`;
}

function updateMovesDisplay(moves) {
  movesDisplay.innerHTML = `${movesEmoji} ${moves}`;
}

function initializeGame() {
  resetGameVariables();
  clearGameBoard();

  for (let i = 0; i < SIZE; i++) {
    for (let j = 0; j < SIZE; j++) {
      const cell = createGameCell(i, j);
      container.appendChild(cell);
    }
  }
}

restartButton.addEventListener('mouseup', () => {
  restartButton.buttonContent.textContent = restartEmoji;
});

function resetGameVariables() {
  moves = 0;
  startTime = null;
  firstMoveMade = false;
  gameOver = false;

  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }

  board.forEach((row) => row.fill(0));
  mineLocations.clear();
  openedCells.clear();
  flaggedCells.clear();

  updateTimeDisplay(0);
  updateMovesDisplay(0);
}

function clearGameBoard() {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
}

function createGameCell(i, j) {
  const cell = document.createElement('div');
  const cellContent = document.createElement('span');

  cell.classList.add('cell');
  cellContent.classList.add('cell-content');
  cell.appendChild(cellContent);

  cell.addEventListener('contextmenu', handleRightClick.bind(null, cell, i, j));
  cell.addEventListener(
    'click',
    handleLeftClick.bind(null, cell, cellContent, i, j)
  );

  return cell;
}

function handleRightClick(cell, i, j, e) {
  e.preventDefault();
  flagSound.play();
  if (gameOver || openedCells.has(`${i},${j}`)) {
    return;
  }

  if (flaggedCells.has(`${i},${j}`)) {
    flaggedCells.delete(`${i},${j}`);
    cell.classList.remove('flag');
  } else {
    flaggedCells.add(`${i},${j}`);
    cell.classList.add('flag');
  }
}

function handleLeftClick(cell, cellContent, i, j) {
  if (
    gameOver ||
    flaggedCells.has(`${i},${j}`) ||
    openedCells.has(`${i},${j}`)
  ) {
    return;
  }

  restartButton.buttonContent.textContent = `😱`;

  if (!firstMoveMade) {
    placeMines(i, j);
    firstMoveMade = true;
  }

  if (!startTime) {
    startTimer();
  }

  moves++;
  updateMovesDisplay(moves);

  if (board[i][j] === 'M') {
    showMines();
    gameOver = true;
    restartButton.buttonContent.textContent = `💩`;
    setTimeout(() => {
      alert(GAME_OVER_MSG);
    }, 100);
    loseSound.play();
  } else {
    stepSound.play();
    showNumber(cell, cellContent, i, j);
    if (!gameOver) {
      setTimeout(() => {
        restartButton.buttonContent.textContent = restartEmoji;
      }, 200);
    }
    if (openedCells.size === SIZE * SIZE - MINES) {
      endGame();
    }
  }
}

function placeMines(i, j) {
  while (mineLocations.size < MINES) {
    const x = Math.floor(Math.random() * SIZE);
    const y = Math.floor(Math.random() * SIZE);

    if (!mineLocations.has(`${x},${y}`) && (x !== i || y !== j)) {
      mineLocations.add(`${x},${y}`);
      board[x][y] = 'M';
    }
  }

  calculateNumbers();
}

function calculateNumbers() {
  for (let x = 0; x < SIZE; x++) {
    for (let y = 0; y < SIZE; y++) {
      if (board[x][y] !== 'M') {
        let mines = 0;

        for (
          let dx = Math.max(x - 1, 0);
          dx <= Math.min(x + 1, SIZE - 1);
          dx++
        ) {
          for (
            let dy = Math.max(y - 1, 0);
            dy <= Math.min(y + 1, SIZE - 1);
            dy++
          ) {
            if (board[dx][dy] === 'M') {
              mines++;
            }
          }
        }

        board[x][y] = mines || '0';
      }
    }
  }
}

function startTimer() {
  startTime = Date.now();
  intervalId = setInterval(() => {
    if (gameOver) {
      clearInterval(intervalId);
    } else {
      const currentTime = Math.floor((Date.now() - startTime) / 1000);
      updateTimeDisplay(currentTime);
    }
  }, 1000);
}

function showMines() {
  for (const mineLocation of mineLocations) {
    const [mineX, mineY] = mineLocation.split(',').map(Number);
    const mineCell = container.children[mineX * SIZE + mineY];
    mineCell.classList.remove('cell');
    mineCell.classList.add('mine');
    mineCell.children[0].textContent = 'M';
  }
}

function showNumber(cell, cellContent, i, j) {
  cell.classList.remove('cell');
  cell.classList.add('number');

  cellContent.textContent = board[i][j];
  setColor(cellContent, board[i][j].toString());
  openedCells.add(`${i},${j}`);

  if (board[i][j] === '0') {
    openAdjacentCells(i, j);
  }
}

function openAdjacentCells(i, j) {
  for (let dx = Math.max(i - 1, 0); dx <= Math.min(i + 1, SIZE - 1); dx++) {
    for (let dy = Math.max(j - 1, 0); dy <= Math.min(j + 1, SIZE - 1); dy++) {
      if (!openedCells.has(`${dx},${dy}`) && board[dx][dy] !== 'M') {
        const cell = container.children[dx * SIZE + dy];
        const cellContent = cell.children[0];
        cell.classList.remove('cell');
        cell.classList.add('number');
        cellContent.textContent = board[dx][dy];
        setColor(cellContent, board[dx][dy].toString());
        openedCells.add(`${dx},${dy}`);
        if (board[dx][dy] === '0') {
          openAdjacentCells(dx, dy);
        }
      }
    }
  }
}

function endGame() {
  const endTime = Date.now();
  const timeTaken = Math.round((endTime - startTime) / 1000);
  winSound.play();
  setTimeout(() => {
    alert(`${VICTORY_MSG}${timeTaken} seconds and ${moves} moves!`);
  }, 500);
  gameOver = true;
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

initializeGame();
