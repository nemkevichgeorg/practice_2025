class LuckyYearFinder extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.state = {
      month: '',
      day: '',
      result: null
    };
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  calculateDigitSum(number) {
    return number.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
  }

  findLuckyYear() {
    const { month, day } = this.state;
    
    // Проверка ввода
    if (!month || !day) {
      this.state.result = { error: "Введите месяц и день рождения" };
      this.updateUI();
      return;
    }

    const monthSum = this.calculateDigitSum(month) % 10;
    const daySum = this.calculateDigitSum(day) % 10;
    const currentYear = new Date().getFullYear();
    
    // Ищем ближайший счастливый год
    for (let year = currentYear; year <= currentYear + 100; year++) {
      const yearSum = this.calculateDigitSum(year) % 10;
      
      if (yearSum === monthSum || yearSum === daySum) {
        this.state.result = {
          year,
          yearSum,
          matchType: yearSum === monthSum && yearSum === daySum ? "и с месяцем, и с днём" :
                     yearSum === monthSum ? "с месяцем" : "с днём"
        };
        this.updateUI();
        return;
      }
    }
    
    this.state.result = { error: "Не удалось найти счастливый год" };
    this.updateUI();
  }

  handleInput(e) {
    const { name, value } = e.target;
    this.state[name] = value;
    this.state.result = null;
  }

  updateUI() {
    const resultEl = this.shadowRoot.querySelector('.result');
    
    if (this.state.result?.error) {
      resultEl.innerHTML = `<div class="error">${this.state.result.error}</div>`;
      return;
    }
    
    if (this.state.result) {
      const { year, yearSum, matchType } = this.state.result;
      resultEl.innerHTML = `
        <div class="success">
          Ближайший счастливый год: <strong>${year}</strong><br>
          Сумма цифр года: ${yearSum} (совпадает ${matchType})<br>
          <small>Год считается счастливым, если остаток от деления суммы его цифр на 10 
          совпадает с аналогичным остатком для месяца или дня рождения</small>
        </div>
      `;
    } else {
      resultEl.innerHTML = '<div class="placeholder">Введите месяц и день рождения</div>';
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: Arial, sans-serif;
        }
        .container {
          padding: 15px;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          background: white;
          max-width: 400px;
          margin: 0 auto;
        }
        h3 {
          margin-top: 0;
          color: #2c3e50;
          text-align: center;
        }
        .input-group {
          margin-bottom: 15px;
        }
        label {
          display: block;
          margin-bottom: 5px;
          font-weight: 500;
          color: #555;
        }
        input {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          box-sizing: border-box;
        }
        button {
          width: 100%;
          padding: 10px;
          background: #4CAF50;
          color: white;
          border: none;
          border-radius: 4px;
          font-weight: bold;
          cursor: pointer;
          margin-top: 10px;
        }
        button:hover {
          background: #45a049;
        }
        .result {
          margin-top: 15px;
          padding: 10px;
          min-height: 80px;
        }
        .error {
          color: #f44336;
          text-align: center;
        }
        .success {
          color: #2c3e50;
          text-align: center;
        }
        .placeholder {
          color: #999;
          text-align: center;
        }
        small {
          display: block;
          margin-top: 10px;
          font-size: 0.8em;
          color: #666;
        }
      </style>
      <div class="container">
        <h3>Найти ближайший счастливый год</h3>
        
        <div class="input-group">
          <label for="month">Месяц рождения (1-12):</label>
          <input 
            type="number" 
            id="month" 
            name="month" 
            min="1" 
            max="12" 
            placeholder="Например, 5"
          >
        </div>
        
        <div class="input-group">
          <label for="day">День рождения (1-31):</label>
          <input 
            type="number" 
            id="day" 
            name="day" 
            min="1" 
            max="31" 
            placeholder="Например, 15"
          >
        </div>
        
        <button @click="findLuckyYear">Найти счастливый год</button>
        
        <div class="result">
          <div class="placeholder">Введите месяц и день рождения</div>
        </div>
      </div>
    `;
  }

  setupEventListeners() {
    this.shadowRoot.querySelectorAll('input').forEach(input => {
      input.addEventListener('input', (e) => this.handleInput(e));
    });
    
    this.shadowRoot.querySelector('button').addEventListener('click', () => {
      this.findLuckyYear();
    });
  }
}

customElements.define('lucky-year-finder', LuckyYearFinder);