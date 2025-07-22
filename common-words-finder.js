class CommonWordsFinder extends HTMLElement {
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
          --error-color: #d63031;
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
        
        textarea {
          width: 100%;
          padding: 12px;
          border: 1px solid var(--border-color);
          border-radius: 8px;
          font-size: 16px;
          transition: all 0.3s ease;
          box-sizing: border-box;
          resize: vertical;
          min-height: 80px;
        }
        
        textarea:focus {
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
        
        .error {
          border-left-color: var(--error-color);
        }
        
        .result-title {
          font-weight: 600;
          margin-bottom: 12px;
        }
        
        .success .result-title {
          color: var(--success-color);
        }
        
        .error .result-title {
          color: var(--error-color);
        }
        
        .common-word {
          background-color: #ffeaa7;
          padding: 2px 6px;
          border-radius: 4px;
          margin-right: 6px;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .error-message {
          color: var(--error-color);
          font-size: 14px;
          margin-top: 5px;
          display: none;
        }
      </style>
      <div class="container">
        <h2>Поиск самых длинных общих слов</h2>
        <div class="input-group">
          <label for="sentence1">Первое предложение:</label>
          <textarea id="sentence1" placeholder="Введите первое предложение"></textarea>
          <div class="error-message" id="error1">Поле не может быть пустым</div>
        </div>
        
        <div class="input-group">
          <label for="sentence2">Второе предложение:</label>
          <textarea id="sentence2" placeholder="Введите второе предложение"></textarea>
          <div class="error-message" id="error2">Поле не может быть пустым</div>
        </div>
        
        <button id="findBtn">Найти общие слова</button>
        
        <div class="result" id="output">
          <div class="result-title">Результат</div>
          <div id="resultText">Здесь будут показаны самые длинные общие слова</div>
        </div>
      </div>
    `;
  }

  connectedCallback() {
    this.shadowRoot.querySelector('#findBtn')
      .addEventListener('click', () => this.findCommonWords());
  }

  getWords(sentence) {
    // Удаляем знаки препинания и приводим к нижнему регистру
    return sentence.toLowerCase()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 0);
  }

  findCommonWords() {
    const sentence1 = this.shadowRoot.querySelector('#sentence1').value.trim();
    const sentence2 = this.shadowRoot.querySelector('#sentence2').value.trim();
    const output = this.shadowRoot.querySelector('#output');
    const resultText = this.shadowRoot.querySelector('#resultText');
    const error1 = this.shadowRoot.querySelector('#error1');
    const error2 = this.shadowRoot.querySelector('#error2');

    // Сброс стилей
    error1.style.display = 'none';
    error2.style.display = 'none';
    output.classList.remove('success', 'error');

    // Валидация
    let isValid = true;
    if (!sentence1) {
      error1.style.display = 'block';
      isValid = false;
    }
    if (!sentence2) {
      error2.style.display = 'block';
      isValid = false;
    }

    if (!isValid) {
      resultText.textContent = 'Пожалуйста, заполните оба поля';
      output.classList.add('error');
      return;
    }

    // Получаем слова из предложений
    const words1 = this.getWords(sentence1);
    const words2 = this.getWords(sentence2);

    // Находим общие слова
    const commonWords = [...new Set(words1.filter(word => words2.includes(word)))];
    
    if (commonWords.length === 0) {
      resultText.textContent = 'Нет общих слов в предложениях';
      output.classList.add('error');
      return;
    }

    // Находим максимальную длину
    const maxLength = Math.max(...commonWords.map(word => word.length));
    
    // Фильтруем самые длинные слова
    const longestWords = commonWords.filter(word => word.length === maxLength);
    
    // Форматируем вывод
    if (longestWords.length === 1) {
      resultText.innerHTML = `Самое длинное общее слово: <span class="common-word">${longestWords[0]}</span>`;
    } else {
      resultText.innerHTML = `Самые длинные общие слова: ${longestWords.map(word => 
        `<span class="common-word">${word}</span>`
      ).join('')}`;
    }
    
    output.classList.add('success');
    this.shadowRoot.querySelector('.result-title').textContent = 'Результат поиска';
  }
}

customElements.define('common-words-finder', CommonWordsFinder);