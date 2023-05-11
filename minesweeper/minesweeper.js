const SIZE = 10;
const MINES = 10;
let moves = 0;
let startTime;
let gameOver = false;

const board = Array(SIZE)
  .fill()
  .map(() => Array(SIZE).fill(0));
const mineLocations = new Set();
const openedCells = new Set();

while (mineLocations.size < MINES) {
  const x = Math.floor(Math.random() * SIZE);
  const y = Math.floor(Math.random() * SIZE);

  if (!mineLocations.has(`${x},${y}`)) {
    mineLocations.add(`${x},${y}`);
    board[x][y] = 'M';
  }
}

for (let i = 0; i < SIZE; i++) {
  for (let j = 0; j < SIZE; j++) {
    if (board[i][j] !== 'M') {
      let mines = 0;

      for (let x = Math.max(i - 1, 0); x <= Math.min(i + 1, SIZE - 1); x++) {
        for (let y = Math.max(j - 1, 0); y <= Math.min(j + 1, SIZE - 1); y++) {
          if (board[x][y] === 'M') {
            mines++;
          }
        }
      }

      board[i][j] = mines || '0';
    }
  }
}

const container = document.createElement('div');
container.classList.add('minesweeper');

for (let i = 0; i < SIZE; i++) {
  for (let j = 0; j < SIZE; j++) {
    const cell = document.createElement('div');
    const cellContent = document.createElement('span');

    cell.classList.add('cell');
    cellContent.classList.add('sell-content');
    cell.appendChild(cellContent);
    cell.addEventListener('click', () => {
      if (gameOver) {
        return;
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

    container.appendChild(cell); // This line was missing
  }
}

document.body.appendChild(container);
