import { createButton } from './createElements/createButton.js';
import { createDiv } from './createElements/createDiv.js';
import { loadGameState } from './loadGameState.js';
import { saveGameState } from './saveGameState.js';
import { setColor } from './setColor.js';
import { showNumber } from './showNumber.js';
import { flagSound, loseSound, stepSound } from './sound.js';
import { winGame } from './winGame.js';

let fieldSize = 10;
let mines = 10;

let moves = 0;
let startTime;
let firstMoveMade = false;
let gameOver = false;
let intervalId = null;
let difficulty = 'easy';
let movesEmoji = '👞';
let timeEmoji = '⏱';
let restartEmoji = '😊';

const EASY = { size: 10 };
const MEDIUM = { size: 15 };
const HARD = { size: 25 };

const controlsContainer = document.createElement('div');
controlsContainer.className = 'controls';

const difficultySelect = document.createElement('select');
const minesInput = document.createElement('input');

difficultySelect.className = 'difficulty-select';
minesInput.className = 'mines-input';

difficultySelect.innerHTML = `
  <option value="easy">Easy (10x10)</option>
  <option value="medium">Medium (15x15)</option>
  <option value="hard">Hard (25x25)</option>
`;

minesInput.type = 'number';
minesInput.min = 10;
minesInput.max = 99;
minesInput.value = mines;

controlsContainer.appendChild(difficultySelect);
controlsContainer.appendChild(minesInput);

export let board = Array(fieldSize)
  .fill()
  .map(() => Array(fieldSize).fill(0));
let mineLocations = new Set();
export let openedCells = new Set();
let flaggedCells = new Set();

const gameContainer = createDiv('game-container');
const container = createDiv('minesweeper');
const timeDisplay = createDiv('time-display', 'control');
const movesDisplay = createDiv('moves-display', 'control');
const restartButton = createButton(
  'restart-button',
  restartEmoji,
  initializeGame
);

document.body.appendChild(gameContainer);
gameContainer.appendChild(controlsContainer);
gameContainer.appendChild(container);

controlsContainer.appendChild(timeDisplay);
controlsContainer.appendChild(restartButton);
controlsContainer.appendChild(movesDisplay);

function updateTimeDisplay(time) {
  timeDisplay.innerHTML = `${timeEmoji} ${time}`;
}

function updateMovesDisplay(moves) {
  movesDisplay.innerHTML = `${movesEmoji} ${moves}`;
}

function restoreDifficultyAndMines() {
  difficultySelect.value = difficulty;
  minesInput.value = mines;
}

function initializeGame() {
  let loadedState = localStorage.getItem('minesweeperGameState');
  if (loadedState) {
    loadedState = JSON.parse(loadedState);
    fieldSize = loadedState.fieldSize;
    mines = loadedState.mines;
    difficulty = loadedState.difficulty;
  }
  restoreDifficultyAndMines();

  resetGameVariables();
  clearGameBoard();
  container.style.gridTemplateColumns = `repeat(${fieldSize}, 1fr)`;

  for (let i = 0; i < fieldSize; i++) {
    for (let j = 0; j < fieldSize; j++) {
      const cell = createGameCell(i, j);
      container.appendChild(cell);
    }
  }

  if (loadedState) {
    ({
      fieldSize,
      mines,
      moves,
      startTime,
      firstMoveMade,
      gameOver,
      board,
      mineLocations,
      flaggedCells,
    } = loadedState);

    startTime = loadedState.startTime ? new Date(startTime) : null;
    openedCells = new Set(loadedState.openedCells);
    mineLocations = new Set(loadedState.mineLocations);
    flaggedCells = new Set(loadedState.flaggedCells);
    if (startTime && !gameOver) {
      difficultySelect.disabled = true;
      minesInput.disabled = true;

      updateTimeDisplay(Math.floor((Date.now() - startTime.getTime()) / 1000));
      startTimer();
    }
    updateMovesDisplay(moves);
  }

  openedCells.forEach((cell) => {
    const [i, j] = cell.split(',').map(Number);
    const cellElement = container.children[i * fieldSize + j];
    const cellContent = cellElement.children[0];

    cellElement.classList.remove('cell');
    cellElement.classList.add('number');
    cellContent.textContent = board[i][j];
    setColor(cellContent, board[i][j].toString());

    if (board[i][j] === '0') {
      openAdjacentCells(i, j);
    }
  });
}

restartButton.addEventListener('mouseup', () => {
  restartButton.buttonContent.textContent = restartEmoji;
  localStorage.removeItem('minesweeperGameState');

  difficultySelect.disabled = false;
  minesInput.disabled = false;
});

setInterval(() => {
  console.log(firstMoveMade, gameOver);
}, 1000);

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

  saveGameState(
    fieldSize,
    mines,
    moves,
    startTime,
    firstMoveMade,
    gameOver,
    board,
    mineLocations,
    openedCells,
    flaggedCells,
    difficulty
  );
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

    difficultySelect.disabled = true;
    minesInput.disabled = true;
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
      alert('Game over. Try again');
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
    if (openedCells.size === fieldSize * fieldSize - mines) {
      winGame(
        startTime,
        moves,
        gameOver,
        intervalId,
        difficultySelect,
        minesInput
      );
    }
  }

  saveGameState(
    fieldSize,
    mines,
    moves,
    startTime,
    firstMoveMade,
    gameOver,
    board,
    mineLocations,
    openedCells,
    flaggedCells,
    difficulty
  );
}

function placeMines(i, j) {
  while (mineLocations.size < mines) {
    const x = Math.floor(Math.random() * fieldSize);
    const y = Math.floor(Math.random() * fieldSize);

    if (!mineLocations.has(`${x},${y}`) && (x !== i || y !== j)) {
      mineLocations.add(`${x},${y}`);
      board[x][y] = 'M';
    }
  }

  calculateNumbers();
}

function calculateNumbers() {
  for (let x = 0; x < fieldSize; x++) {
    for (let y = 0; y < fieldSize; y++) {
      if (board[x][y] !== 'M') {
        let mines = 0;

        for (
          let dx = Math.max(x - 1, 0);
          dx <= Math.min(x + 1, fieldSize - 1);
          dx++
        ) {
          for (
            let dy = Math.max(y - 1, 0);
            dy <= Math.min(y + 1, fieldSize - 1);
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
  if (!startTime) {
    startTime = new Date();
  }
  intervalId = setInterval(() => {
    if (gameOver) {
      clearInterval(intervalId);
    } else {
      const currentTime = Math.floor((Date.now() - startTime.getTime()) / 1000);
      updateTimeDisplay(currentTime);
    }
  }, 1000);
}

function showMines() {
  for (const mineLocation of mineLocations) {
    const [mineX, mineY] = mineLocation.split(',').map(Number);
    const mineCell = container.children[mineX * fieldSize + mineY];
    mineCell.classList.remove('cell');
    mineCell.classList.add('mine');
    mineCell.children[0].textContent = 'M';
  }
}

export function openAdjacentCells(i, j) {
  for (
    let dx = Math.max(i - 1, 0);
    dx <= Math.min(i + 1, fieldSize - 1);
    dx++
  ) {
    for (
      let dy = Math.max(j - 1, 0);
      dy <= Math.min(j + 1, fieldSize - 1);
      dy++
    ) {
      if (!openedCells.has(`${dx},${dy}`) && board[dx][dy] !== 'M') {
        const cell = container.children[dx * fieldSize + dy];
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

function updateDifficulty() {
  localStorage.removeItem('minesweeperGameState');
  resetGameVariables();
  clearGameBoard();

  difficulty = difficultySelect.value;

  const newMines = parseInt(minesInput.value);

  switch (difficulty) {
    case 'easy':
      fieldSize = EASY.size;
      mines = newMines;
      break;
    case 'medium':
      fieldSize = MEDIUM.size;
      mines = newMines;
      break;
    case 'hard':
      fieldSize = HARD.size;
      mines = newMines;
      break;
  }
  board = Array(fieldSize)
    .fill()
    .map(() => Array(fieldSize).fill(0));
  mineLocations = new Set();

  saveGameState(
    fieldSize,
    mines,
    moves,
    startTime,
    firstMoveMade,
    gameOver,
    board,
    mineLocations,
    openedCells,
    flaggedCells,
    difficulty
  );

  initializeGame();
}

document.addEventListener('DOMContentLoaded', function () {
  initializeGame();
});

difficultySelect.addEventListener('change', updateDifficulty);
minesInput.addEventListener('input', updateDifficulty);
