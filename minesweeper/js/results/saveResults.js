import { loadResults } from './loadResults.js';

export function saveResult(time, moves) {
  const results = loadResults();
  const newResult = { time, moves, date: new Date().toLocaleString('ru') };
  results.push(newResult);

  while (results.length > 10) {
    results.shift();
  }
  localStorage.setItem('minesweeperResults', JSON.stringify(results));
}
