class DigitFinder extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.state = { n: 0, k: 1, result: null };
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  // Найти k-ю справа цифру в числе n
  findKthDigit(n, k) {
    const numStr = Math.abs(n).toString();
    if (k > numStr.length || k < 1) return null;
    return parseInt(numStr[numStr.length - k]);
  }

  generateRandomValues() {
    this.state.n = Math.floor(Math.random() * 10000) + 1;
    this.state.k = Math.floor(Math.random() * this.state.n.toString().length) + 1;
    this.state.result = this.findKthDigit(this.state.n, this.state.k);
    this.updateUI();
  }

  handleInput(e) {
    const { name, value } = e.target;
    const numValue = parseInt(value);
    
    if (!isNaN(numValue) && numValue >= 0) {
      this.state[name] = numValue;
      
      // Автоматически ограничиваем k длиной числа
      if (name === 'n') {
        const maxK = this.state.n.toString().length;
        if (this.state.k > maxK) this.state.k = maxK;
      }
      
      this.state.result = this.findKthDigit(this.state.n, this.state.k);
    } else {
      this.state.result = null;
    }
    
    this.updateUI();
  }

  updateUI() {
    const resultEl = this.shadowRoot.querySelector('.result');
    const kInput = this.shadowRoot.querySelector('input[name="k"]');
    
    // Обновляем максимальное значение для k
    const maxK = this.state.n.toString().length;
    kInput.max = maxK;
    kInput.placeholder = `1-${maxK}`;
    
    if (this.state.result !== null) {
      resultEl.innerHTML = `
        <div class="result-value">
          В числе <strong>${this.state.n}</strong><br>
          ${this.state.k}-я цифра справа: 
          <span class="digit">${this.state.result}</span>
        </div>
      `;
    } else {
      resultEl.textContent = 'Введите корректные значения!';
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
          display: flex;
          gap: 10px;
          align-items: center;
          flex-wrap: wrap;
        }
        label {
          min-width: 80px;
          font-weight: bold;
        }
        input {
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          width: 80px;
          font-size: 16px;
        }
        button {
          padding: 8px 16px;
          background: #4CAF50;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
          transition: background 0.3s;
        }
        button:hover {
          background: #45a049;
        }
        .result {
          margin-top: 20px;
          padding: 15px;
          border-radius: 4px;
          background: #f0f8ff;
        }
        .digit {
          font-size: 1.5em;
          color: #d63384;
          font-weight: bold;
        }
        .controls {
          display: flex;
          gap: 10px;
          margin-top: 10px;
        }
      </style>
      <div class="container">
        <h3>Поиск k-й цифры справа</h3>
        
        <div class="input-group">
          <label for="n-input">Число (n):</label>
          <input 
            type="number" 
            name="n" 
            min="1" 
            placeholder="0000"
          >
        </div>
        
        <div class="input-group">
          <label for="k-input">Позиция (k):</label>
          <input 
            type="number" 
            name="k" 
            min="1" 
            max="4" 
            placeholder="1-4"
          >
        </div>
        
        <div class="controls">
          <button id="calculate-btn">Найти цифру</button>
          <button id="random-btn">Сгенерировать</button>
        </div>
        
        <div class="result">Введите значения n и k</div>
      </div>
    `;
  }

  setupEventListeners() {
    const inputs = this.shadowRoot.querySelectorAll('input');
    const calculateBtn = this.shadowRoot.querySelector('#calculate-btn');
    const randomBtn = this.shadowRoot.querySelector('#random-btn');
    
    inputs.forEach(input => {
      input.addEventListener('input', (e) => this.handleInput(e));
    });
    
    calculateBtn.addEventListener('click', () => {
      this.state.result = this.findKthDigit(this.state.n, this.state.k);
      this.updateUI();
    });
    
    randomBtn.addEventListener('click', () => this.generateRandomValues());
  }
}

customElements.define('digit-finder', DigitFinder);