import { showNumber } from './showNumber.js';

export function loadGameState(
  container,
  SIZE,
  updateTimeDisplay,
  updateMovesDisplay,
  startTimer
) {
  let gameState = localStorage.getItem('minesweeperGameState');

  if (gameState) {
    let {
      moves: savedMoves,
      startTime: savedStartTime,
      firstMoveMade: savedFirstMoveMade,
      gameOver: savedGameOver,
      board: savedBoard,
      mineLocations: savedMineLocations,
      openedCells: savedOpenedCells,
      flaggedCells: savedFlaggedCells,
    } = JSON.parse(gameState);

    const state = {
      moves: savedMoves,
      startTime: savedStartTime ? new Date(savedStartTime) : null,
      firstMoveMade: savedFirstMoveMade,
      gameOver: savedGameOver,
      board: savedBoard,
      mineLocations: new Set(savedMineLocations),
      openedCells: new Set(savedOpenedCells),
      flaggedCells: new Set(savedFlaggedCells),
    };

    if (!state.gameOver) {
      startTimer();
    }

    updateTimeDisplay(
      Math.floor((Date.now() - state.startTime.getTime()) / 1000)
    );
    updateMovesDisplay(state.moves);

    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        const cell = container.children[i * SIZE + j];
        const cellContent = cell.children[0];

        if (state.flaggedCells.has(`${i},${j}`)) {
          cell.classList.add('flag');
        }

        if (state.openedCells.has(`${i},${j}`)) {
          showNumber(cell, cellContent, i, j);
        }
      }
    }

    return state;
  }

  return null;
}
