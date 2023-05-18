export function showMines(mineLocations, fieldSize, container) {
  for (const mineLocation of mineLocations) {
    const [mineX, mineY] = mineLocation.split(',').map(Number);
    const mineCell = container.children[mineX * fieldSize + mineY];
    mineCell.classList.remove('cell');
    mineCell.classList.add('mine');
    mineCell.children[0].textContent = 'M';
  }
}
