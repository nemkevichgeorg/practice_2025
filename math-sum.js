class MathSumCalculator extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.state = { N: 0, result: null };
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  calculateSum(N) {
    let S = 0;
    for (let k = 1; k <= N; k++) {
      let innerSum = 0;
      for (let i = 1; i <= k; i++) {
        innerSum += (k - i ** 2);
      }
      S += k ** 3 * innerSum;
    }
    return S;
  }

  generateRandomN() {
    this.state.N = Math.floor(Math.random() * 20) + 1;
    this.state.result = this.calculateSum(this.state.N);
    this.updateUI();
  }

  handleInput(e) {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1) {
      this.state.N = value;
      this.state.result = this.calculateSum(this.state.N);
    } else {
      this.state.result = null;
    }
    this.updateUI();
  }

  updateUI() {
    const resultEl = this.shadowRoot.querySelector('.result');
    if (this.state.result !== null) {
      resultEl.innerHTML = `
        <div class="result-value">
          Результат (N = ${this.state.N}): 
          <span class="formula">S = ${this.state.result}</span>
        </div>
      `;
    } else {
      resultEl.textContent = 'Введите корректное N!';
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
        .formula-container {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 6px;
          margin: 15px 0;
          font-size: 1.1em;
          line-height: 1.6;
        }
        .sum {
          font-style: normal;
          position: relative;
        }
        .sum .top {
          position: absolute;
          top: -0.8em;
          left: 0;
          right: 0;
          font-size: 0.7em;
          text-align: center;
        }
        .sum .bottom {
          position: absolute;
          bottom: -1.2em;
          left: 0;
          right: 0;
          font-size: 0.7em;
          text-align: center;
        }
        .sum .symbol {
          font-size: 1.2em;
        }
        input {
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          width: 100px;
          margin-right: 10px;
          font-size: 16px;
        }
        button {
          padding: 10px 15px;
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
        .input-group {
          margin: 20px 0;
        }
        .result {
          margin-top: 20px;
          padding: 12px;
          border-radius: 4px;
          background: #f0f8ff;
          font-weight: bold;
        }
        .result-value {
          color: #2c3e50;
        }
        .formula {
          color: #d63384;
          font-family: "Courier New", monospace;
        }
      </style>
      <div class="container">
        <h3>Вычисление суммы S</h3>
        
        <div class="formula-container">
          Формула: 
          <span class="formula">
            S = <span class="sum">
              <span class="symbol">Σ</span>
              <span class="bottom">k=1</span>
              <span class="top">N</span>
            </span>
            [ k³ · 
            <span class="sum">
              <span class="symbol">Σ</span>
              <span class="bottom">i=1</span>
              <span class="top">k</span>
            </span>
            (k - i²) ]
          </span>
        </div>
        
        <div class="input-group">
          <input type="number" min="1" placeholder="Введите N">
          <button id="random-btn">Сгенерировать N</button>
        </div>
        
        <div class="result">Введите значение N</div>
      </div>
    `;
  }

  setupEventListeners() {
    const input = this.shadowRoot.querySelector('input');
    const randomBtn = this.shadowRoot.querySelector('#random-btn');
    
    input.addEventListener('input', (e) => this.handleInput(e));
    randomBtn.addEventListener('click', () => this.generateRandomN());
  }
}

customElements.define('math-sum-calculator', MathSumCalculator);