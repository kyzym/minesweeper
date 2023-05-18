export function clearGameBoard(container) {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
}
