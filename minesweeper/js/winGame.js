import { saveResult } from './results/saveResults.js';
import { winSound } from './sound.js';

export function winGame(startTime, moves, gameOver, intervalId) {
  const VICTORY_MSG = 'Hooray! You found all mines in ';
  const endTime = Date.now();
  const timeTaken = Math.round((endTime - startTime) / 1000);
  winSound.play();
  setTimeout(() => {
    alert(`${VICTORY_MSG}${timeTaken} seconds and ${moves} moves!`);
    saveResult(timeTaken, moves);
  }, 500);
  gameOver = true;
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}
