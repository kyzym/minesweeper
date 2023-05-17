export function loadResults() {
  const results = localStorage.getItem('minesweeperResults');
  return results ? JSON.parse(results) : [];
}
