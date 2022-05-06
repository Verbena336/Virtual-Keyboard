/* eslint-disable import/extensions */
import createElem from './createElem.js';

export default class Button {
  constructor({ letter, shift, key }) {
    this.letter = letter;
    this.shift = shift;
    this.key = key;
    this.classesArr = ['keyboard__key'];
    if (this.key === 'Backspace' || this.key === 'Enter') {
      this.classesArr.push('keyboard__key--size-l');
    } else if (this.key === 'Tab' || this.key === 'Delete' || this.key === 'ControlLeft' || this.key === 'ControlRight') {
      this.classesArr.push('keyboard__key--size-xs');
    } else if (this.key === 'CapsLock') {
      this.classesArr.push('keyboard__key--size-s');
      this.light = createElem('div', ['light']);
    } else if (this.key === 'ShiftLeft' || this.key === 'ShiftRight') {
      this.classesArr.push('keyboard__key--size-m');
    } else if (this.key === 'Space') {
      this.classesArr.push('keyboard__key--size-xl');
    }
    this.button = createElem('div', this.classesArr, letter);
    if (this.light) {
      this.button.append(this.light);
    }
  }
}
