/* eslint-disable import/extensions */
import createElem from './createElem.js';
import Button from './button.js';

export default function generateKb(keyboardArr, lang) {
  const wrapper = createElem('div', ['wrapper']);
  createElem('textarea', ['textarea'], null, wrapper);
  const keyboard = createElem('div', ['keyboard'], null, wrapper);
  keyboardArr.forEach((row) => {
    const rowElem = createElem('div', ['keyboard__row'], null, keyboard);
    row.forEach((item) => {
      const matchButton = lang.find((buttonItem) => buttonItem.key === item);
      if (matchButton) {
        rowElem.append(new Button(matchButton).button);
      }
    });
  });
  createElem('span', ['system'], 'Keyboard for Windows', wrapper);
  createElem('span', ['language-info'], 'Alt + Shift to change language', wrapper);
  document.body.prepend(wrapper);
}
