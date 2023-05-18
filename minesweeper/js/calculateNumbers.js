export function calculateNumbers(fieldSize, board) {
  for (let x = 0; x < fieldSize; x++) {
    for (let y = 0; y < fieldSize; y++) {
      if (board[x][y] !== 'M') {
        let mines = 0;

        for (
          let dx = Math.max(x - 1, 0);
          dx <= Math.min(x + 1, fieldSize - 1);
          dx++
        ) {
          for (
            let dy = Math.max(y - 1, 0);
            dy <= Math.min(y + 1, fieldSize - 1);
            dy++
          ) {
            if (board[dx][dy] === 'M') {
              mines++;
            }
          }
        }

        board[x][y] = mines || '0';
      }
    }
  }
}
