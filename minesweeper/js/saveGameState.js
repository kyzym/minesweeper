export function saveGameState(
  moves,
  startTime,
  firstMoveMade,
  gameOver,
  board,
  mineLocations,
  openedCells,
  flaggedCells
) {
  let gameState = {
    moves,
    startTime: startTime ? startTime.getTime() : null,
    firstMoveMade,
    gameOver,
    board,
    mineLocations: Array.from(mineLocations),
    openedCells: Array.from(openedCells),
    flaggedCells: Array.from(flaggedCells),
  };

  localStorage.setItem('minesweeperGameState', JSON.stringify(gameState));
}
