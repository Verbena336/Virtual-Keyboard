/* eslint-disable import/extensions */
import createElem from './createElem.js';

export default class Keyboard {
  constructor(keyboardArr) {
    this.keyboardArr = keyboardArr;
  }

  generateKb(lang) {
    this.lang = lang;
    this.wrapper = createElem('div', ['wrapper']);
    this.textarea = createElem('textarea', ['textarea'], null, this.wrapper);
    this.keyboard = createElem('div', ['keyboard'], null, this.wrapper);
    this.keyboardArr.forEach((row) => {
      this.row = createElem('div', ['keyboard__row'], null, this.keyboard);
      row.forEach((item) => {
        createElem('div', ['keyboard__key', item], lang.find((buttonKey) => buttonKey.key === item).letter, this.row);
      });
    });
    this.system = createElem('span', ['system'], 'Keyboard for Windows', this.wrapper);
    this.languageInfo = createElem('span', ['language-info'], 'Alt + Shift to change language', this.wrapper);
    document.body.prepend(this.wrapper);
    return this;
  }
}
