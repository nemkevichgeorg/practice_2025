class DayOfYearConverter extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.state = {
      month: '',
      day: '',
      result: null,
      useCurrentDate: false,
      error: null
    };
    this.monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  }

  connectedCallback() {
    this.updateMonthDays();
    this.render();
    this.setupEventListeners();
  }

  updateMonthDays() {
    const year = new Date().getFullYear();
    this.monthDays[1] = this.isLeapYear(year) ? 29 : 28;
  }

  isLeapYear(year) {
    return (year % 400 === 0) || (year % 100 !== 0 && year % 4 === 0);
  }

  validateDate(month, day) {
    if (!month || !day) return { valid: false, error: "Введите месяц и день" };
    if (month < 1 || month > 12) return { valid: false, error: "Неверный месяц" };
    if (day < 1 || day > this.monthDays[month - 1]) {
      return { valid: false, error: `В этом месяце только ${this.monthDays[month - 1]} дней` };
    }
    return { valid: true };
  }

  getDayOfYear(month, day) {
    const validation = this.validateDate(month, day);
    if (!validation.valid) {
      this.state.error = validation.error;
      return null;
    }

    const year = new Date().getFullYear();
    const date = new Date(year, month - 1, day);
    const start = new Date(year, 0, 0);
    const diff = date - start;
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
  }

  useCurrentDate() {
    const now = new Date();
    this.state.month = now.getMonth() + 1;
    this.state.day = now.getDate();
    this.state.useCurrentDate = true;
    this.state.error = null;
    this.state.result = this.getDayOfYear(this.state.month, this.state.day);
    this.updateUI();
  }

  handleInput(e) {
    const { name, value } = e.target;
    this.state[name] = value ? parseInt(value) : '';
    this.state.useCurrentDate = false;
    this.state.error = null;

    if (name === 'month') {
      const dayInput = this.shadowRoot.querySelector('input[name="day"]');
      dayInput.value = '';
      this.state.day = '';
    }

    if (this.state.month && this.state.day) {
      this.state.result = this.getDayOfYear(this.state.month, this.state.day);
    } else {
      this.state.result = null;
    }
    this.updateUI();
  }

  updateUI() {
    const monthInput = this.shadowRoot.querySelector('select[name="month"]');
    const dayInput = this.shadowRoot.querySelector('input[name="day"]');
    const currentDateBtn = this.shadowRoot.querySelector('#current-date-btn');
    const resultEl = this.shadowRoot.querySelector('.result');
    const errorEl = this.shadowRoot.querySelector('.error');

    // Обновляем максимальное количество дней для выбранного месяца
    if (this.state.month) {
      const maxDays = this.monthDays[this.state.month - 1];
      dayInput.max = maxDays;
      dayInput.placeholder = `1-${maxDays}`;
    }

    // Обновляем состояние кнопки текущей даты
    if (this.state.useCurrentDate) {
      currentDateBtn.textContent = 'Используется текущая дата';
      currentDateBtn.classList.add('active');
    } else {
      currentDateBtn.textContent = 'Использовать текущую дату';
      currentDateBtn.classList.remove('active');
    }

    // Отображаем ошибку или результат
    if (this.state.error) {
      errorEl.textContent = this.state.error;
      errorEl.style.display = 'block';
      resultEl.style.display = 'none';
    } else if (this.state.result !== null) {
      errorEl.style.display = 'none';
      resultEl.style.display = 'block';
      
      const now = new Date();
      const monthNames = ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня',
                         'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'];
      resultEl.innerHTML = `
        <div class="result-value">
          <strong>${this.state.day} ${monthNames[this.state.month - 1]}</strong> — это
          <span class="day-number">${this.state.result}</span>-й день
          <strong>${now.getFullYear()}</strong> года
          ${this.state.useCurrentDate ? '<div class="notice">(Текущая дата)</div>' : ''}
        </div>
      `;
    } else {
      errorEl.style.display = 'none';
      resultEl.style.display = 'block';
      resultEl.textContent = 'Введите месяц и день';
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        .container {
          font-family: 'Segoe UI', Arial, sans-serif;
          padding: 25px;
          border: 1px solid #e0e0e0;
          border-radius: 12px;
          max-width: 500px;
          margin: 20px auto;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          background: white;
        }
        h3 {
          color: #2c3e50;
          margin-top: 0;
          margin-bottom: 20px;
          padding-bottom: 12px;
          border-bottom: 1px solid #f0f0f0;
          font-size: 1.4em;
        }
        .input-group {
          margin: 18px 0;
          display: flex;
          gap: 12px;
          align-items: center;
        }
        label {
          min-width: 80px;
          font-weight: 600;
          color: #444;
        }
        select, input {
          padding: 10px 14px;
          border: 2px solid #e0e0e0;
          border-radius: 6px;
          font-size: 16px;
          transition: border-color 0.3s;
        }
        select:focus, input:focus {
          border-color: #4CAF50;
          outline: none;
        }
        select {
          flex: 1;
          min-width: 150px;
          background-color: #f9f9f9;
        }
        input {
          width: 80px;
          text-align: center;
        }
        button {
          padding: 12px 18px;
          background: #4CAF50;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 16px;
          font-weight: 600;
          transition: all 0.3s;
          width: 100%;
          margin-top: 10px;
        }
        button:hover {
          background: #45a049;
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        button.active {
          background: #2196F3;
        }
        .result {
          margin-top: 25px;
          padding: 18px;
          border-radius: 8px;
          background: #f8f9fa;
          line-height: 1.6;
          font-size: 1.1em;
        }
        .day-number {
          font-size: 1.6em;
          color: #d63384;
          font-weight: 700;
        }
        .notice {
          font-size: 0.85em;
          color: #666;
          margin-top: 8px;
          font-style: italic;
        }
        .error {
          color: #f44336;
          font-weight: 600;
          margin-top: 15px;
          padding: 10px;
          background: #ffebee;
          border-radius: 6px;
          display: none;
        }
        .month-option {
          display: flex;
          justify-content: space-between;
        }
        .days-count {
          color: #757575;
          font-size: 0.9em;
        }
      </style>
      <div class="container">
        <h3>Определение порядкового номера дня в году</h3>
        
        <div class="input-group">
          <label for="month">Месяц:</label>
          <select name="month" id="month">
            <option value="">Выберите месяц</option>
            ${this.monthDays.map((days, index) => {
              const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
                                 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
              const isFebruary = index === 1;
              const daysText = isFebruary 
                ? `${days} ${this.isLeapYear(new Date().getFullYear()) ? '(високосный)' : ''}`
                : `${days}`;
              return `
                <option value="${index + 1}">
                  <span class="month-option">
                    <span>${monthNames[index]}</span>
                    <span class="days-count">${daysText} дней</span>
                  </span>
                </option>
              `;
            }).join('')}
          </select>
        </div>
        
        <div class="input-group">
          <label for="day">День:</label>
          <input 
            type="number" 
            name="day" 
            id="day"
            min="1" 
            max="31" 
            placeholder="1-31"
          >
        </div>
        
        <button id="current-date-btn">Использовать текущую дату</button>
        
        <div class="error"></div>
        <div class="result">Введите месяц и день</div>
      </div>
    `;
  }

  setupEventListeners() {
    const monthInput = this.shadowRoot.querySelector('select[name="month"]');
    const dayInput = this.shadowRoot.querySelector('input[name="day"]');
    const currentDateBtn = this.shadowRoot.querySelector('#current-date-btn');
    
    monthInput.addEventListener('change', (e) => this.handleInput(e));
    dayInput.addEventListener('input', (e) => this.handleInput(e));
    currentDateBtn.addEventListener('click', () => this.useCurrentDate());
  }
}

customElements.define('day-converter', DayOfYearConverter);