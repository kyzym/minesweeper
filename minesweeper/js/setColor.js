export const setColor = (cellContent, number) => {
  switch (number) {
    case '1':
      cellContent.style.color = 'blue';
      break;
    case '2':
      cellContent.style.color = 'green';
      break;
    case '3':
      cellContent.style.color = 'red';
      break;
    case '4':
      cellContent.style.color = 'purple';
      break;
    case '5':
      cellContent.style.color = 'maroon';
      break;
    case '6':
      cellContent.style.color = 'turquoise';
      break;
    case '7':
      cellContent.style.color = 'black';
      break;
    case '8':
      cellContent.style.color = 'gray';
      break;
  }
};
