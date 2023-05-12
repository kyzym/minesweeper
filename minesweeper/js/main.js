import { setColor } from './setColor.js';

const SIZE = 10;
const MINES = 10;
let moves = 0;
let startTime;
let firstMoveMade = false;
let gameOver = false;

// Create data structures for the mine locations and opened cells
const mineLocations = new Set();
const openedCells = new Set();

// Initialize the board with zeros
function initBoard() {
  const board = Array(SIZE)
    .fill()
    .map(() => Array(SIZE).fill(0));
  return board;
}

// Place mines in random locations on the board
function placeMines(board, mineLocations, exclude) {
  while (mineLocations.size < MINES) {
    const x = Math.floor(Math.random() * SIZE);
    const y = Math.floor(Math.random() * SIZE);

    if (
      !mineLocations.has(`${x},${y}`) &&
      (x !== exclude.i || y !== exclude.j)
    ) {
      mineLocations.add(`${x},${y}`);
      board[x][y] = 'M';
    }
  }
  return board;
}

// Count the mines adjacent to each cell and update the cell's value accordingly
function countAdjacentMines(board) {
  for (let i = 0; i < SIZE; i++) {
    for (let j = 0; j < SIZE; j++) {
      if (board[i][j] !== 'M') {
        let mines = 0;
        for (let x = Math.max(i - 1, 0); x <= Math.min(i + 1, SIZE - 1); x++) {
          for (
            let y = Math.max(j - 1, 0);
            y <= Math.min(j + 1, SIZE - 1);
            y++
          ) {
            if (board[x][y] === 'M') {
              mines++;
            }
          }
        }
        board[i][j] = mines || '0';
      }
    }
  }
  return board;
}

let board = initBoard();

const container = document.createElement('div');
container.classList.add('minesweeper');

for (let i = 0; i < SIZE; i++) {
  for (let j = 0; j < SIZE; j++) {
    const cell = document.createElement('div');
    const cellContent = document.createElement('span');

    cell.classList.add('cell');
    cellContent.classList.add('cell-content');
    cell.appendChild(cellContent);
    cell.addEventListener('click', () => {
      if (gameOver) {
        return;
      }

      if (!firstMoveMade) {
        board = placeMines(board, mineLocations, { i, j });
        board = countAdjacentMines(board);
        firstMoveMade = true;
      }

      if (!startTime) {
        startTime = Date.now();
      }

      moves++;

      if (board[i][j] === 'M') {
        gameOver = true;
        cell.classList.remove('cell');
        cell.classList.add('mine');
        cellContent.textContent = 'M';
        alert('Game over. Try again');
      } else {
        cell.classList.remove('cell');
        cell.classList.add('number');
        cellContent.textContent = board[i][j];
        setColor(cellContent, board[i][j].toString());
        openedCells.add(`${i},${j}`);

        if (openedCells.size === SIZE * SIZE - MINES) {
          const endTime = Date.now();
          const timeTaken = Math.round((endTime - startTime) / 1000);
          alert(
            `Hooray! You found all mines in ${timeTaken} seconds and ${moves} moves!`
          );
          gameOver = true;
        }
      }
    });

    container.appendChild(cell);
  }
}

document.body.appendChild(container);
