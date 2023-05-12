// Import the setColor function
import { setColor } from './setColor.js';

// Define constants for the size of the board and the number of mines
const SIZE = 10;
const MINES = 10;

// Initialize game state variables
let moves = 0;
let startTime;
let firstMoveMade = false;
let gameOver = false;

// Create the game board and sets to keep track of mines, opened cells, and flagged cells
const board = Array(SIZE)
  .fill()
  .map(() => Array(SIZE).fill(0));
const mineLocations = new Set();
const openedCells = new Set();
const flaggedCells = new Set(); // Added set for flagged cells

// Create the game container element
const container = document.createElement('div');
container.classList.add('minesweeper');

// Create cells for the game board
for (let i = 0; i < SIZE; i++) {
  for (let j = 0; j < SIZE; j++) {
    const cell = document.createElement('div');
    const cellContent = document.createElement('span');

    cell.classList.add('cell');
    cellContent.classList.add('cell-content');
    cell.appendChild(cellContent);

    // Add a right-click (contextmenu) event listener for flagging cells
    cell.addEventListener('contextmenu', (e) => {
      e.preventDefault();

      if (openedCells.has(`${i},${j}`)) {
        return;
      }

      if (flaggedCells.has(`${i},${j}`)) {
        flaggedCells.delete(`${i},${j}`);
        cell.classList.remove('flag');
      } else {
        flaggedCells.add(`${i},${j}`);
        cell.classList.add('flag');
      }
    });

    // Add a click event listener for opening cells
    cell.addEventListener('click', () => {
      if (gameOver || flaggedCells.has(`${i},${j}`)) {
        return;
      }

      if (!firstMoveMade) {
        // Generate mines after the first move
        while (mineLocations.size < MINES) {
          const x = Math.floor(Math.random() * SIZE);
          const y = Math.floor(Math.random() * SIZE);

          if (!mineLocations.has(`${x},${y}`) && (x !== i || y !== j)) {
            mineLocations.add(`${x},${y}`);
            board[x][y] = 'M';
          }
        }

        // Calculate numbers for cells
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
