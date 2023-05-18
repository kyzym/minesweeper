export function createGameCell(i, j, handleLeftClick, handleRightClick) {
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
