class DivisorsFinder extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.state = {
      number: '',
      divisors: [],
      error: null
    };
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  findDivisors(num) {
    if (!num || isNaN(num) || num < 1 || !Number.isInteger(Number(num))) {
      return { error: "Введите натуральное число ≥ 1" };
    }

    num = parseInt(num);
    const divisors = [];
    
    for (let i = 1; i <= Math.sqrt(num); i++) {
      if (num % i === 0) {
        divisors.push(i);
        if (i !== num / i) {
          divisors.push(num / i);
        }
      }
    }
    
    return { divisors: divisors.sort((a, b) => a - b) };
  }

  handleInput(e) {
    this.state.number = e.target.value;
    const result = this.findDivisors(this.state.number);
    
    if (result.error) {
      this.state.error = result.error;
      this.state.divisors = [];
    } else {
      this.state.error = null;
      this.state.divisors = result.divisors;
    }
    
    this.updateUI();
  }

  updateUI() {
    const resultEl = this.shadowRoot.querySelector('.result');
    const inputEl = this.shadowRoot.querySelector('input');
    
    inputEl.value = this.state.number;
    
    if (this.state.error) {
      resultEl.innerHTML = `<div class="error">${this.state.error}</div>`;
    } else if (!this.state.number) {
      resultEl.innerHTML = '<div class="placeholder">Введите натуральное число</div>';
    } else {
      resultEl.innerHTML = `
        <div class="success">
          Делители числа ${this.state.number}:<br>
          <div class="divisors">${this.state.divisors.join(', ')}</div>
        </div>
      `;
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        .container {
          font-family: Arial, sans-serif;
          padding: 15px;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          max-width: 400px;
          margin: 0 auto;
          background: white;
        }
        h3 {
          margin-top: 0;
          color: #2c3e50;
          text-align: center;
        }
        input {
          width: 100%;
          padding: 10px;
          margin: 10px 0;
          border: 1px solid #ddd;
          border-radius: 4px;
          box-sizing: border-box;
          font-size: 16px;
        }
        .result {
          margin-top: 15px;
          padding: 10px;
          min-height: 50px;
        }
        .error {
          color: #f44336;
          text-align: center;
        }
        .placeholder {
          color: #999;
          text-align: center;
        }
        .success {
          text-align: center;
        }
        .divisors {
          margin-top: 10px;
          padding: 10px;
          background: #f5f5f5;
          border-radius: 4px;
          word-break: break-word;
        }
      </style>
      <div class="container">
        <h3>Нахождение делителей числа</h3>
        <input 
          type="number" 
          placeholder="Введите натуральное число" 
          min="1" 
          step="1"
        >
        <div class="result">
          <div class="placeholder">Введите натуральное число</div>
        </div>
      </div>
    `;
  }

  setupEventListeners() {
    this.shadowRoot.querySelector('input').addEventListener('input', (e) => {
      this.handleInput(e);
    });
  }
}

customElements.define('divisors-finder', DivisorsFinder);