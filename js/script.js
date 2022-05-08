/* eslint-disable import/extensions */
import createElem from './helpers/createElem.js';
import Button from './helpers/button.js';
import languages from './helpers/languages.js';

const lang = JSON.parse(window.localStorage.getItem('language') || '"en"');

const Keyboard = {

  elements: {
    wrapper: null,
    textarea: null,
    keyboard: null,
  },

  properties: {
    language: languages[lang],
    pressed: new Set(),
  },

  sets: {
    btnArr: [],
    FnBtn: ['Tab', 'CapsLock', 'ShiftLeft', 'ControlLeft', 'MetaLeft', 'AltLeft', 'Space', 'Backspace', 'Delete', 'Enter', 'ShiftRight', 'AltRight', 'ControlRight', 'ArrowRight', 'ArrowLeft'],
  },

  events: {
    shift: false,
    caps: false,
  },

  generateTextarea() {
    this.elements.wrapper = createElem('div', ['wrapper']);
    this.elements.textarea = createElem('textarea', ['textarea'], null, this.elements.wrapper);
    createElem('span', ['system'], 'Keyboard for Windows', this.elements.wrapper);
    createElem('span', ['language-info'], 'Alt + Ctrl to change language', this.elements.wrapper);
  },

  generateKb() {
    this.generateTextarea();
    this.elements.keyboard = createElem('div', ['keyboard'], null, this.elements.wrapper);
    this.properties.language.forEach((item) => {
      const newBtn = new Button(item);
      this.sets.btnArr.push(newBtn);
      this.elements.keyboard.append(newBtn.button);
    });
    document.body.prepend(this.elements.wrapper);
    document.addEventListener('mousedown', (e) => {
      this.mouseEvents(e);
    });
    document.addEventListener('mouseup', (e) => {
      this.mouseEvents(e);
    });
    document.addEventListener('keydown', (e) => {
      this.handleEvents(e);
    });
    document.addEventListener('keyup', (e) => {
      this.handleEvents(e);
    });
    document.addEventListener('mouseout', (e) => {
      this.mouseEvents(e);
    });
  },

  changeKeyboardLetters() {
    this.sets.btnArr.forEach((buttn) => {
      const foundedBtn = this.properties.language.find((item) => item.key === buttn.key);
      const btn = buttn;
      btn.letter = foundedBtn.letter;
      btn.shift = foundedBtn.shift;
      if (foundedBtn.shift) {
        if (this.events.caps) {
          if (this.events.shift) {
            btn.button.innerHTML = foundedBtn.shift.toLowerCase();
          } else {
            btn.button.innerHTML = foundedBtn.letter.toUpperCase();
          }
        } else if (this.events.shift) {
          btn.button.innerHTML = foundedBtn.shift;
        } else {
          btn.button.innerHTML = foundedBtn.letter;
        }
      }
    });
  },

  changeLanguage() {
    if (this.properties.language === languages.en) {
      this.properties.language = languages.ru;
      window.localStorage.setItem('language', JSON.stringify('ru'));
    } else {
      this.properties.language = languages.en;
      window.localStorage.setItem('language', JSON.stringify('en'));
    }
    this.changeKeyboardLetters();
  },

  textareaFill(symbol) {
    const isFnBtn = this.sets.FnBtn.find((item) => item === symbol.key);
    let cursor = this.elements.textarea.selectionStart;
    const start = this.elements.textarea.value.substring(0, cursor);
    const end = this.elements.textarea.value.substring(cursor);
    if (symbol.key === 'Tab') {
      this.elements.textarea.value = `${start}    ${end}`;
      cursor += 4;
    }
    if (symbol.key === 'Space') {
      this.elements.textarea.value = `${start} ${end}`;
      cursor += 1;
    }
    if (symbol.key === 'Enter') {
      this.elements.textarea.value = `${start}\n${end}`;
      cursor += 1;
    }
    if (symbol.key === 'Backspace') {
      this.elements.textarea.value = `${start.slice(0, start.length - 1)}${end}`;
      cursor = cursor - 1 < 0 ? 0 : cursor - 1;
    }
    if (symbol.key === 'Delete') this.elements.textarea.value = `${start}${end.slice(1)}`;
    if (symbol.key === 'ArrowLeft') {
      cursor = cursor - 1 < 0 ? 0 : cursor - 1;
    }
    if (symbol.key === 'ArrowRight') {
      if (cursor < this.elements.textarea.value.length) {
        cursor += 1;
      }
    } if (!isFnBtn) {
      this.elements.textarea.value = `${start}${symbol.button.innerText}${end}`;
      cursor += 1;
    }
    this.elements.textarea.setSelectionRange(cursor, cursor);
  },

  mouseEvents(e) {
    if (!e.target.dataset.key) return;
    const customEvent = { code: e.target.dataset.key, type: e.type };
    this.handleEvents(customEvent);
  },

  handleEvents(e) {
    this.elements.textarea.focus();
    const newBtn = this.sets.btnArr.find((item) => item.key === e.code);
    if (!newBtn) return;
    if (e.type === 'keydown' || e.type === 'mousedown') {
      if (e.preventDefault) e.preventDefault();
      newBtn.button.classList.add('press');
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
        this.events.shift = true;
        this.changeKeyboardLetters();
      }
      if (e.code === 'CapsLock') {
        if (!this.events.caps) {
          this.events.caps = true;
          newBtn.light.classList.add('active');
        } else {
          this.events.caps = false;
          newBtn.button.classList.remove('press');
          newBtn.light.classList.remove('active');
        }
        this.changeKeyboardLetters();
      }
      if (e.code === 'ControlLeft' || e.code === 'ControlRight') this.properties.pressed.add(e.code[0]);
      if (e.code === 'AltLeft' || e.code === 'AltRight') this.properties.pressed.add(e.code[0]);
      if (this.properties.pressed.size === 2) this.changeLanguage();
      this.textareaFill(newBtn);
    } if (e.type === 'keyup' || e.type === 'mouseup') {
      if (newBtn.key !== 'CapsLock') newBtn.button.classList.remove('press');
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
        this.events.shift = false;
        this.changeKeyboardLetters();
      }
      if (e.code === 'ControlLeft' || e.code === 'ControlRight') this.properties.pressed.delete(e.code[0]);
      if (e.code === 'AltLeft' || e.code === 'AltRight') this.properties.pressed.delete(e.code[0]);
    }
    if (e.type === 'mouseout') {
      if (newBtn.key !== 'CapsLock') newBtn.button.classList.remove('press');
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
        this.events.shift = false;
        this.changeKeyboardLetters();
      }
      if (e.code === 'ControlLeft' || e.code === 'ControlRight') this.properties.pressed.delete(e.code[0]);
      if (e.code === 'AltLeft' || e.code === 'AltRight') this.properties.pressed.delete(e.code[0]);
    }
  },
};

Keyboard.generateKb();
