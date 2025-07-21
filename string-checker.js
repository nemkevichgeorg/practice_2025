class StringChecker extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.state = {
      inputString: '',
      result: null,
      generated: false
    };
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  // Проверка совпадения первой и последней буквы
  checkFirstLastLetter(str) {
    if (str.length === 0) return false;
    const first = str[0].toLowerCase();
    const last = str[str.length - 1].toLowerCase();
    return first === last;
  }

  // Генерация случайной строки
  generateRandomString() {
    const length = Math.floor(Math.random() * 10) + 3; // Длина 3-12 символов
    const chars = 'abcdefghijklmnopqrstuvwxyzабвгдеёжзийклмнопрстуфхцчшщъыьэюя';
    let result = '';
    
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    this.state.inputString = result;
    this.state.generated = true;
    this.state.result = this.checkFirstLastLetter(result);
    this.updateUI();
  }

  handleInput(e) {
    this.state.inputString = e.target.value;
    this.state.generated = false;
    this.state.result = this.checkFirstLastLetter(e.target.value);
    this.updateUI();
  }

  updateUI() {
    const resultEl = this.shadowRoot.querySelector('.result');
    const inputEl = this.shadowRoot.querySelector('input');
    
    inputEl.value = this.state.inputString;
    
    if (this.state.inputString.length === 0) {
      resultEl.innerHTML = 'Введите строку или сгенерируйте случайную';
    } else {
      const match = this.state.result;
      resultEl.innerHTML = `
        <div class="result-value">
          Строка: <strong>"${this.state.inputString}"</strong><br>
          Первая буква: <span class="letter">${this.state.inputString[0]?.toUpperCase() || ''}</span><br>
          Последняя буква: <span class="letter">${this.state.inputString[this.state.inputString.length - 1]?.toUpperCase() || ''}</span><br>
          Совпадение: <span class="${match ? 'match' : 'no-match'}">${match ? 'ДА' : 'НЕТ'}</span>
        </div>
      `;
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        .container {
          font-family: 'Segoe UI', Arial, sans-serif;
          padding: 20px;
          border: 1px solid #e0e0e0;
          border-radius: 10px;
          max-width: 500px;
          margin: 20px auto;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          background: white;
        }
        h3 {
          color: #2c3e50;
          margin-top: 0;
          border-bottom: 1px solid #eee;
          padding-bottom: 10px;
        }
        .input-group {
          margin: 15px 0;
        }
        input {
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          width: 100%;
          box-sizing: border-box;
          font-size: 16px;
          margin-bottom: 10px;
        }
        .controls {
          display: flex;
          gap: 10px;
          margin-top: 10px;
        }
        button {
          padding: 10px 15px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
          transition: background 0.3s;
          flex: 1;
        }
        #check-btn {
          background: #4CAF50;
          color: white;
        }
        #check-btn:hover {
          background: #45a049;
        }
        #generate-btn {
          background: #2196F3;
          color: white;
        }
        #generate-btn:hover {
          background: #0b7dda;
        }
        .result {
          margin-top: 20px;
          padding: 15px;
          border-radius: 4px;
          background: #f8f9fa;
          line-height: 1.6;
        }
        .letter {
          font-weight: bold;
          color: #ff5722;
        }
        .match {
          color: #4CAF50;
          font-weight: bold;
        }
        .no-match {
          color: #f44336;
          font-weight: bold;
        }
        .generated-notice {
          font-size: 0.8em;
          color: #757575;
          margin-top: 5px;
        }
      </style>
      <div class="container">
        <h3>Проверка первой и последней буквы</h3>
        
        <div class="input-group">
          <input 
            type="text" 
            placeholder="Введите строку или сгенерируйте случайную"
          >
        </div>
        
        <div class="controls">
          <button id="check-btn">Проверить</button>
          <button id="generate-btn">Сгенерировать</button>
        </div>
        
        <div class="result">Введите строку или сгенерируйте случайную</div>
      </div>
    `;
  }

  setupEventListeners() {
    const input = this.shadowRoot.querySelector('input');
    const checkBtn = this.shadowRoot.querySelector('#check-btn');
    const generateBtn = this.shadowRoot.querySelector('#generate-btn');
    
    input.addEventListener('input', (e) => this.handleInput(e));
    checkBtn.addEventListener('click', () => {
      this.state.result = this.checkFirstLastLetter(this.state.inputString);
      this.updateUI();
    });
    generateBtn.addEventListener('click', () => this.generateRandomString());
  }
}

customElements.define('string-checker', StringChecker);