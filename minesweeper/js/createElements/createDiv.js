export function createDiv(className, classNameSecond) {
  const div = document.createElement('div');
  div.classList.add(className);
  classNameSecond && div.classList.add(classNameSecond);
  return div;
}
