import { showNumber } from './showNumber.js';

export function loadGameState(
  container,
  fieldSize,
  updateTimeDisplay,
  updateMovesDisplay
) {
  let gameState = localStorage.getItem('minesweeperGameState');

  if (gameState) {
    let {
      fieldSize: savedSize,
      mines: savedMines,
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
      fieldSize: savedSize,
      mines: savedMines,
      moves: savedMoves,
      startTime: savedStartTime ? new Date(savedStartTime) : new Date(),
      firstMoveMade: savedFirstMoveMade,
      gameOver: savedGameOver,
      board: savedBoard,
      mineLocations: new Set(savedMineLocations),
      openedCells: new Set(savedOpenedCells),
      flaggedCells: new Set(savedFlaggedCells),
    };

    updateTimeDisplay(
      Math.floor((Date.now() - state.startTime.getTime()) / 1000)
    );

    updateMovesDisplay(state.moves);

    for (let i = 0; i < fieldSize; i++) {
      for (let j = 0; j < fieldSize; j++) {
        const cell = container.children[i * fieldSize + j];
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
