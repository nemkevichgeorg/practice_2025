class SentenceBuilder extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          --primary-color: #6c5ce7;
          --hover-color: #5649c0;
          --border-color: #dfe6e9;
          --text-color: #2d3436;
          --light-bg: #f5f6fa;
          --success-color: #00b894;
        }
        
        .container {
          max-width: 600px;
          margin: 20px auto;
          padding: 25px;
          border-radius: 12px;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
          background: white;
        }
        
        h2 {
          color: var(--primary-color);
          text-align: center;
          margin-bottom: 25px;
          font-weight: 600;
        }
        
        .input-group {
          margin-bottom: 20px;
        }
        
        label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: var(--text-color);
        }
        
        textarea, input {
          width: 100%;
          padding: 12px;
          border: 1px solid var(--border-color);
          border-radius: 8px;
          font-size: 16px;
          transition: all 0.3s ease;
          box-sizing: border-box;
          resize: vertical;
          min-height: 60px;
        }
        
        textarea:focus, input:focus {
          outline: none;
          border-color: var(--primary-color);
          box-shadow: 0 0 0 3px rgba(108, 92, 231, 0.2);
        }
        
        button {
          width: 100%;
          padding: 14px;
          background-color: var(--primary-color);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 10px;
        }
        
        button:hover {
          background-color: var(--hover-color);
          transform: translateY(-2px);
        }
        
        button:active {
          transform: translateY(0);
        }
        
        .result {
          margin-top: 25px;
          padding: 20px;
          background-color: var(--light-bg);
          border-radius: 8px;
          color: var(--text-color);
          line-height: 1.6;
          border-left: 4px solid var(--primary-color);
          animation: fadeIn 0.5s ease;
        }
        
        .success {
          border-left-color: var(--success-color);
        }
        
        .result-title {
          font-weight: 600;
          margin-bottom: 12px;
          color: var(--primary-color);
        }
        
        .success .result-title {
          color: var(--success-color);
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .error-message {
          color: #d63031;
          font-size: 14px;
          margin-top: 5px;
          display: none;
        }
      </style>
      <div class="container">
        <h2>Составитель предложений</h2>
        <div class="input-group">
          <label for="part1">Первая часть предложения:</label>
          <textarea id="part1" placeholder="Введите начало предложения"></textarea>
          <div class="error-message" id="error1">Поле не может быть пустым</div>
        </div>
        
        <div class="input-group">
          <label for="part2">Вторая часть предложения:</label>
          <textarea id="part2" placeholder="Введите продолжение предложения"></textarea>
          <div class="error-message" id="error2">Поле не может быть пустым</div>
        </div>
        
        <button id="buildBtn">Составить предложение</button>
        
        <div class="result" id="output">
          <div class="result-title">Результат</div>
          <div id="resultText">Здесь появится составленное предложение</div>
        </div>
      </div>
    `;
  }

  connectedCallback() {
    this.shadowRoot.querySelector('#buildBtn')
      .addEventListener('click', () => this.buildSentence());
  }

  buildSentence() {
    const part1 = this.shadowRoot.querySelector('#part1').value.trim();
    const part2 = this.shadowRoot.querySelector('#part2').value.trim();
    const output = this.shadowRoot.querySelector('#output');
    const resultText = this.shadowRoot.querySelector('#resultText');
    const error1 = this.shadowRoot.querySelector('#error1');
    const error2 = this.shadowRoot.querySelector('#error2');

    // Сброс стилей ошибок
    error1.style.display = 'none';
    error2.style.display = 'none';
    output.classList.remove('success');

    // Валидация
    let isValid = true;
    if (!part1) {
      error1.style.display = 'block';
      isValid = false;
    }
    if (!part2) {
      error2.style.display = 'block';
      isValid = false;
    }

    if (!isValid) {
      resultText.textContent = 'Исправьте ошибки в полях ввода';
      return;
    }

    // Составление предложения
    const sentence = `${part1} ${part2}`;
    resultText.textContent = sentence;
    output.classList.add('success');
    this.shadowRoot.querySelector('.result-title').textContent = 'Готовое предложение';
  }
}

customElements.define('sentence-builder', SentenceBuilder);