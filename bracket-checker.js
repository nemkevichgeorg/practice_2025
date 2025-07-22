class SimpleBracketChecker extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: Arial, sans-serif;
          max-width: 500px;
          margin: 20px auto;
          padding: 20px;
          border: 1px solid #ddd;
          border-radius: 8px;
        }
        
        h2 {
          color: #333;
          text-align: center;
          margin-top: 0;
        }
        
        .file-input-wrapper {
          margin: 15px 0;
          text-align: center;
        }
        
        .file-input {
          display: none;
        }
        
        .file-button {
          display: inline-block;
          padding: 10px 15px;
          background-color: #4285f4;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
        }
        
        .file-button:hover {
          background-color: #3367d6;
        }
        
        .file-name {
          margin-top: 10px;
          font-size: 14px;
          color: #666;
        }
        
        .check-button {
          width: 100%;
          padding: 10px;
          background-color: #34a853;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
          margin-top: 10px;
        }
        
        .check-button:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }
        
        .result {
          margin-top: 20px;
          padding: 15px;
          border-radius: 4px;
          background-color: #f8f9fa;
        }
        
        .success {
          color: #34a853;
          border-left: 4px solid #34a853;
        }
        
        .error {
          color: #ea4335;
          border-left: 4px solid #ea4335;
        }
      </style>
      <div>
        <h2>Проверка баланса скобок</h2>
        
        <div class="file-input-wrapper">
          <label class="file-button">
            Выберите файл (.txt)
            <input type="file" class="file-input" accept=".txt">
          </label>
          <div class="file-name" id="fileName">Файл не выбран</div>
        </div>
        
        <button class="check-button" disabled id="checkBtn">Проверить скобки</button>
        
        <div class="result" id="result">
          Загрузите текстовый файл для проверки
        </div>
      </div>
    `;
    
    this.file = null;
  }

  connectedCallback() {
    const fileInput = this.shadowRoot.querySelector('.file-input');
    const checkBtn = this.shadowRoot.querySelector('#checkBtn');
    const fileName = this.shadowRoot.querySelector('#fileName');

    fileInput.addEventListener('change', (e) => {
      if (e.target.files.length) {
        const file = e.target.files[0];
        if (!file.name.endsWith('.txt')) {
          alert('Пожалуйста, выберите файл с расширением .txt');
          return;
        }
        this.file = file;
        fileName.textContent = file.name;
        checkBtn.disabled = false;
      }
    });

    checkBtn.addEventListener('click', () => this.checkBrackets());
  }

  async checkBrackets() {
    if (!this.file) return;

    const resultDiv = this.shadowRoot.querySelector('#result');
    resultDiv.textContent = 'Проверка...';
    resultDiv.className = 'result';

    try {
      const fileContent = await this.readFile(this.file);
      const checkResult = this.checkBalance(fileContent);

      if (checkResult.balanced) {
        resultDiv.textContent = '✓ Все скобки сбалансированы';
        resultDiv.classList.add('success');
      } else {
        resultDiv.textContent = `✗ Ошибка: ${checkResult.error}`;
        resultDiv.classList.add('error');
      }
    } catch (error) {
      resultDiv.textContent = 'Ошибка при чтении файла';
      resultDiv.classList.add('error');
    }
  }

  readFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(new Error('Ошибка чтения файла'));
      reader.readAsText(file);
    });
  }

  checkBalance(text) {
    const stack = [];
    const pairs = { '(': ')', '[': ']', '{': '}', '<': '>' };

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (pairs[char]) {
        stack.push({ char, pos: i });
      } else if (Object.values(pairs).includes(char)) {
        if (!stack.length) {
          return {
            balanced: false,
            error: `Неожиданная закрывающая скобка "${char}" на позиции ${i}`
          };
        }
        const last = stack.pop();
        if (pairs[last.char] !== char) {
          return {
            balanced: false,
            error: `Ожидалась "${pairs[last.char]}", но найдена "${char}" на позиции ${i}`
          };
        }
      }
    }

    if (stack.length) {
      const last = stack.pop();
      return {
        balanced: false,
        error: `Не закрыта скобка "${last.char}" на позиции ${last.pos}`
      };
    }

    return { balanced: true };
  }
}

customElements.define('bracket-checker', SimpleBracketChecker);