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
    FnBtn: ['Tab', 'CapsLock', 'ShiftLeft', 'ControlLeft', 'MetaLeft', 'AltLeft', 'Space', 'Backspace', 'Delete', 'Enter', 'ShiftRight', 'AltRight', 'ControlRight', 'ArrowRight', 'ArrowLeft'],
    keyboard: null,
    cursor: 0,
  },

  const: {
    language: languages[lang],
    ctrl: false,
    alt: false,
    pressed: new Set(),
  },

  properties: {
    shift: false,
    caps: false,
  },

  generateTextarea() {
    this.elements.wrapper = createElem('div', ['wrapper']);
    this.elements.textarea = createElem('textarea', ['textarea'], null, this.elements.wrapper);
    createElem('span', ['system'], 'Keyboard for Windows', this.elements.wrapper);
    createElem('span', ['language-info'], 'Alt + Ctrl to change language', this.elements.wrapper);
  },

  generateKb(keyboardAr) {
    Keyboard.generateTextarea();
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
    document.addEventListener('mousedown', (e) => {
      this.mouseEvents(e)
    })
    document.addEventListener('mouseup', (e) => {
      this.mouseEvents(e)
    })
    document.addEventListener('keydown', (e) => {
      this.handleEvents(e)
    })
    document.addEventListener('keyup', (e) => {
      this.handleEvents(e)
    })
  },

  shiftEvent() {
    if (this.properties.shift) {
      if (!this.properties.caps) {
        this.elements.btnArr.forEach((btn) => {
          const foundedBtn = this.const.language.find((item) => item.key === btn.key);
          if (foundedBtn.shift) btn.button.innerHTML = foundedBtn.shift;
        });
      } else {
        this.elements.btnArr.forEach((btn) => {
          const foundedBtn = this.const.language.find((item) => item.key === btn.key);
          if (foundedBtn.shift) btn.button.innerHTML = foundedBtn.shift.toLowerCase();
        });
      }
    } else {
      Keyboard.capsEvent();
    }
  },

  capsEvent() {
    if (this.properties.caps) {
      if (this.properties.shift) {
        this.elements.btnArr.forEach((btn) => {
          const foundedBtn = this.const.language.find((item) => item.key === btn.key);
          if (foundedBtn.shift) btn.button.innerHTML = foundedBtn.shift.toLowerCase();
        });
      } else {
        this.elements.btnArr.forEach((btn) => {
          const foundedBtn = this.const.language.find((item) => item.key === btn.key);
          if (foundedBtn.shift) btn.button.innerHTML = foundedBtn.letter.toUpperCase();
        });
      }
    } else if (this.properties.shift) {
      this.elements.btnArr.forEach((btn) => {
        const foundedBtn = this.const.language.find((item) => item.key === btn.key);
        if (foundedBtn.shift) btn.button.innerHTML = foundedBtn.shift;
      });
    } else {
      this.elements.btnArr.forEach((btn) => {
        const foundedBtn = this.const.language.find((item) => item.key === btn.key);
        if (foundedBtn.shift) btn.button.innerHTML = foundedBtn.letter.toLowerCase();
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
      const isFnBtn = this.elements.FnBtn.find((item) => item === buttn.key);
      if (!isFnBtn) {
        if (this.properties.caps) {
          if (this.properties.shift) {
            buttn.button.innerHTML = foundedBtn.shift.toLowerCase();
          } else {
            buttn.button.innerHTML = foundedBtn.letter.toUpperCase();
          }
        } else if (this.properties.shift) {
          buttn.button.innerHTML = foundedBtn.shift;
        } else {
          buttn.button.innerHTML = foundedBtn.letter;
        }
      }
    });
  },
  

  textareaFill(symbol) {
    const isFnBtn = this.elements.FnBtn.find((item) => item === symbol.key);
    let cursor = this.elements.textarea.selectionStart;
    const left = this.elements.textarea.value.substring(0, cursor);
    const right = this.elements.textarea.value.substring(cursor);
    if (symbol.key === 'Tab') {
      this.elements.textarea.value = `${left}\t${right}`;
      cursor += 1;
    }
    if (symbol.key === 'Space') {
      this.elements.textarea.value = `${left} ${right}`;
      cursor += 1;
    }
    if (symbol.key === 'Enter') {
      this.elements.textarea.value = `${left}\n${right}`;
      cursor += 1;
    }
    if (symbol.key === 'Backspace') {
      this.elements.textarea.value = `${left.slice(0, left.length - 1)}${right}`;
      cursor = cursor - 1 < 0 ? 0 : cursor - 1;
    }
    if (symbol.key === 'Delete') this.elements.textarea.value = `${left}${right.slice(1)}`;
    if (symbol.key === 'ArrowLeft') {
      cursor = cursor - 1 < 0 ? 0 : cursor - 1;
    }
    if (symbol.key === 'ArrowRight') {
      cursor += 1
    }
    if (!isFnBtn) {
      if (this.properties.shift) {
        if (this.properties.caps) {
          this.elements.textarea.value = `${left}${symbol.shift.toLowerCase()}${right}`;
        } else {
          this.elements.textarea.value = `${left}${symbol.shift}${right}`;
        }
      } else if (!this.properties.shift) {
        if (this.properties.caps) {
          this.elements.textarea.value = `${left}${symbol.letter.toUpperCase()}${right}`;
        } else {
          this.elements.textarea.value = `${left}${symbol.letter}${right}`;
        }
      }
      cursor += 1;
    }
    this.elements.textarea.setSelectionRange(cursor, cursor);
  },
  
  mouseEvents(e) {
    if (!e.target.dataset.key) return;
    let ev={code: e.target.dataset.key, type: e.type}
    this.handleEvents(ev)
  },

  handleEvents(e) {
    this.elements.textarea.focus();
    if(e.type === 'keydown' || e.type === 'mousedown') {
      if(e.preventDefault) e.preventDefault()
      this.elements.cursor += 1;
      const newBtn = this.elements.btnArr.find((item) => item.key === e.code);
      if (newBtn)newBtn.button.classList.add('press');
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
        this.properties.shift = true;
        Keyboard.shiftEvent();
      }
      if (e.code === 'CapsLock') {
        if (!this.properties.caps) {
          this.properties.caps = true;
          newBtn.light.classList.add('active');
        } else {
          this.properties.caps = false;
          newBtn.button.classList.remove('press');
          newBtn.light.classList.remove('active');
        }
        Keyboard.capsEvent();
      }
      if (e.code === 'ControlLeft' || e.code === 'ControlRight') this.const.pressed.add(e.code[0]);
      if (e.code === 'AltLeft' || e.code === 'AltRight') this.const.pressed.add(e.code[0]);
      if (this.const.pressed.size === 2) Keyboard.changeLanguage();
      Keyboard.textareaFill(newBtn);
    } else if (e.type === 'keyup' || e.type === 'mouseup') {
      const newBtn = this.elements.btnArr.find((item) => item.key === e.code);
      if (newBtn && newBtn.key !== 'CapsLock') newBtn.button.classList.remove('press');
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
        this.properties.shift = false;
        Keyboard.shiftEvent();
      }
      if (e.code === 'ControlLeft' || e.code === 'ControlRight') this.const.pressed.delete(e.code[0]);
      if (e.code === 'AltLeft' || e.code === 'AltRight') this.const.pressed.delete(e.code[0]);
    };
  },
};

Keyboard.generateKb(keyboardArr, lang);
