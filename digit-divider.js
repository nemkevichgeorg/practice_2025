class DigitDivider extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          --primary-color: #4a6bff;
          --hover-color: #3a5bef;
          --border-color: #e1e4e8;
          --text-color: #333;
          --light-bg: #f8f9fa;
        }
        
        div {
          max-width: 400px;
          margin: 0 auto;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          background: white;
        }
        
        label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: var(--text-color);
        }
        
        input {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid var(--border-color);
          border-radius: 6px;
          font-size: 16px;
          transition: border-color 0.3s ease;
          box-sizing: border-box;
          margin-bottom: 16px;
        }
        
        input:focus {
          outline: none;
          border-color: var(--primary-color);
          box-shadow: 0 0 0 3px rgba(74, 107, 255, 0.2);
        }
        
        button {
          width: 100%;
          padding: 12px;
          background-color: var(--primary-color);
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        button:hover {
          background-color: var(--hover-color);
          transform: translateY(-1px);
        }
        
        button:active {
          transform: translateY(0);
        }
        
        .result {
          margin-top: 20px;
          padding: 15px;
          background-color: var(--light-bg);
          border-radius: 6px;
          color: var(--text-color);
          line-height: 1.5;
          border-left: 4px solid var(--primary-color);
          animation: fadeIn 0.5s ease;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .result-title {
          font-weight: 600;
          margin-bottom: 8px;
          color: var(--primary-color);
        }
      </style>
      <div>
        <label for="n">Введите натуральное число n:</label>
        <input type="number" id="n" min="1" placeholder="Например, 100">
        <button id="calcBtn">Найти числа</button>
        <div class="result" id="output"></div>
      </div>
    `;
  }

  connectedCallback() {
    this.shadowRoot.querySelector('#calcBtn')
      .addEventListener('click', () => this.calculate());
  }

  isDigitDivider(num) {
    return num.toString().split('').every(d => {
      const digit = Number(d);
      return digit !== 0 && num % digit === 0;
    });
  }

  calculate() {
    const n = parseInt(this.shadowRoot.querySelector('#n').value);
    const output = this.shadowRoot.querySelector('#output');

    if (isNaN(n) || n < 1) {
      output.innerHTML = '<div class="result-title">Ошибка</div>Введите корректное натуральное число.';
      return;
    }

    const result = [];
    for (let i = 1; i <= n; i++) {
      if (this.isDigitDivider(i)) result.push(i);
    }

    if (result.length === 0) {
      output.innerHTML = '<div class="result-title">Результат</div>Нет чисел, удовлетворяющих условию.';
    } else {
      output.innerHTML = `
        <div class="result-title">Найдено ${result.length} чисел</div>
        ${result.join(', ')}
      `;
    }
  }
}

customElements.define('digit-divider', DigitDivider);