/* eslint-disable import/extensions */
// import { en, ru } from './languages/languages.js';
// import { Keyboard } from './keyboard.js';
import keyboardArr from './keybordArr.js';
import createElem from './createElem.js';
import Button from './button.js';
import languages from './languages/languages.js';

const lang = JSON.parse(window.localStorage.getItem('language') || '"en"');

const Keyboard = {

  elements: {
    wrapper: null,
    textarea: null,
    btnArr: [],
    keyboard: null,
  },

  const: {
    language: null,
    ctrl: false,
    alt: false,
  },

  properties: {
    shift: false,
  },

  generateTextarea() {
    this.elements.wrapper = createElem('div', ['wrapper']);
    this.elements.textarea = createElem('textarea', ['textarea'], null, this.elements.wrapper);
    createElem('span', ['system'], 'Keyboard for Windows', this.elements.wrapper);
    createElem('span', ['language-info'], 'Alt + Ctrl to change language', this.elements.wrapper);
  },

  generateKb(keyboardAr, langKey) {
    Keyboard.generateTextarea();
    this.const.language = languages[langKey];
    this.elements.keyboard = createElem('div', ['keyboard'], null, this.elements.wrapper);
    keyboardAr.forEach((row) => {
      const rowElem = createElem('div', ['keyboard__row'], null, this.elements.keyboard);
      row.forEach((item) => {
        const matchButton = this.const.language.find((buttonItem) => buttonItem.key === item);
        if (matchButton) {
          const newBtn = new Button(matchButton);
          this.elements.btnArr.push(newBtn);
          rowElem.append(newBtn.button);
        }
      });
    });
    document.body.prepend(this.elements.wrapper);
    Keyboard.handleEvents();
  },

  shiftEvent() {
    if (this.properties.shift) {
      this.elements.btnArr.forEach((btn) => {
        const foundedBtn = this.const.language.find((item) => item.key === btn.key);
        if (foundedBtn.shift) btn.button.innerHTML = foundedBtn.shift;
      });
    } else {
      this.elements.btnArr.forEach((btn) => {
        const foundedBtn = this.const.language.find((item) => item.key === btn.key);
        if (foundedBtn.shift) btn.button.innerHTML = foundedBtn.letter;
      });
    }
  },

  changeLanguage() {
    if (this.const.language === languages.en) {
      this.const.language = languages.ru;
      window.localStorage.setItem('language', JSON.stringify(Object.keys(languages)[1]));
    } else {
      this.const.language = languages.en;
      window.localStorage.setItem('language', JSON.stringify(Object.keys(languages)[0]));
    }
    this.elements.btnArr.forEach((buttn) => {
      const foundedBtn = this.const.language.find((item) => item.key === buttn.key);
      buttn.letter = foundedBtn.letter;
      buttn.shift = foundedBtn.shift;
      buttn.button.innerHTML = foundedBtn.letter;
    });
  },

  handleEvents() {
    const pressed = new Set();
    document.addEventListener('keydown', (e) => {
      this.elements.textarea.focus();
      e.preventDefault();
      const newBtn = this.elements.btnArr.find((item) => item.key === e.code);
      if (newBtn)newBtn.button.classList.add('press');
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
        this.properties.shift = true;
        Keyboard.shiftEvent();
      }
      if (e.code === 'ControlLeft' || e.code === 'ControlRight') pressed.add(e.code[0]);
      if (e.code === 'AltLeft' || e.code === 'AltRight') pressed.add(e.code[0]);
      if (pressed.size === 2) Keyboard.changeLanguage();
      this.elements.textarea.innerHTML = newBtn.button.innerHTML;
    });
    document.addEventListener('keyup', (e) => {
      const newBtn = this.elements.btnArr.find((item) => item.key === e.code);
      if (newBtn) newBtn.button.classList.remove('press');
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
        this.properties.shift = false;
        Keyboard.shiftEvent();
      }
      if (e.code === 'ControlLeft' || e.code === 'ControlRight') pressed.delete(e.code[0]);
      if (e.code === 'AltLeft' || e.code === 'AltRight') pressed.delete(e.code[0]);
    });
  },

};

Keyboard.generateKb(keyboardArr, lang);
