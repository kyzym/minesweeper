export function saveGameState(
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
) {
  let gameState = {
    fieldSize,
    mines,
    moves,
    startTime: startTime ? startTime.getTime() : null,
    firstMoveMade,
    gameOver,
    board,
    mineLocations: Array.from(mineLocations),
    openedCells: Array.from(openedCells),
    flaggedCells: Array.from(flaggedCells),
    difficulty,
  };

  localStorage.setItem('minesweeperGameState', JSON.stringify(gameState));
}
