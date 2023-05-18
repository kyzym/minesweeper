import { createDiv } from './createDiv.js';

export function createButton(className, emoji, onClick) {
  const button = document.createElement('button');
  button.className = className;

  const buttonContent = createDiv('button-emoji');

  button.appendChild(buttonContent);
  buttonContent.textContent = emoji;

  button.addEventListener('click', onClick);
  button.buttonContent = buttonContent;

  return button;
}
