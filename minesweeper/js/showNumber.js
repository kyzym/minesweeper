import { board, openAdjacentCells, openedCells } from '../main.js';
import { setColor } from './setColor.js';

export function showNumber(cell, cellContent, i, j) {
  cell.classList.remove('cell');
  cell.classList.add('number');

  cellContent.textContent = board[i][j];
  setColor(cellContent, board[i][j].toString());
  openedCells.add(`${i},${j}`);

  if (board[i][j] === '0') {
    openAdjacentCells(i, j);
  }
}
