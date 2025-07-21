class LineEndCounter extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.state = {
      fileContent: '',
      letter: this.getRandomLetter(),
      result: null
    };
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  getRandomLetter() {
    const letters = 'abcdefghijklmnopqrstuvwxyzабвгдеёжзийклмнопрстуфхцчшщъыьэюя';
    return letters[Math.floor(Math.random() * letters.length)];
  }

  countLinesEndingWith(text, letter) {
    if (!text.trim() || !letter) return 0;
    
    const lines = text.split('\n');
    const lowerLetter = letter.toLowerCase();
    
    return lines.filter(line => {
      const trimmedLine = line.trim();
      return trimmedLine.toLowerCase().endsWith(lowerLetter);
    }).length;
  }

  handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      this.state.fileContent = event.target.result;
      this.state.result = this.countLinesEndingWith(this.state.fileContent, this.state.letter);
      this.updateUI();
    };
    reader.readAsText(file);
  }

  handleLetterInput(e) {
    const value = e.target.value.slice(-1); // Берем последний введенный символ
    if (/[a-zA-Zа-яА-ЯёЁ]/.test(value)) {
      this.state.letter = value.toLowerCase();
      e.target.value = value; // Оставляем только одну букву
    } else {
      e.target.value = this.state.letter || '';
      return;
    }
    
    if (this.state.fileContent) {
      this.state.result = this.countLinesEndingWith(this.state.fileContent, this.state.letter);
      this.updateUI();
    }
  }

  generateRandomLetter() {
    this.state.letter = this.getRandomLetter();
    const letterInput = this.shadowRoot.querySelector('input[name="letter"]');
    letterInput.value = this.state.letter;
    
    if (this.state.fileContent) {
      this.state.result = this.countLinesEndingWith(this.state.fileContent, this.state.letter);
      this.updateUI();
    }
  }

  updateUI() {
    const resultEl = this.shadowRoot.querySelector('.result');
    const fileNameEl = this.shadowRoot.querySelector('.file-name');
    const fileInput = this.shadowRoot.querySelector('input[type="file"]');
    
    if (fileInput.files.length > 0) {
      fileNameEl.textContent = fileInput.files[0].name;
    } else {
      fileNameEl.textContent = 'Файл не выбран';
    }
    
    if (!this.state.fileContent) {
      resultEl.innerHTML = '<div class="placeholder">Загрузите текстовый файл</div>';
    } else {
      const lineCount = this.state.fileContent.split('\n').length;
      resultEl.innerHTML = `
        <div class="result-content">
          <div class="file-stats">
            Всего строк: ${lineCount}<br>
            Строк оканчивается на <span class="highlight-letter">"${this.state.letter}"</span>: 
            <strong>${this.state.result}</strong>
          </div>
        </div>
      `;
    }
  }

  findExampleLines() {
    const lines = this.state.fileContent.split('\n');
    const lowerLetter = this.state.letter.toLowerCase();
    const examples = lines.filter(line => {
      const trimmedLine = line.trim();
      return trimmedLine.toLowerCase().endsWith(lowerLetter);
    }).slice(0, 3); // Берем первые 3 примера
    
    return examples.map(line => `"${line.trim()}"`);
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          max-width: 600px;
          margin: 0 auto;
          font-family: 'Segoe UI', Arial, sans-serif;
        }
        .container {
          padding: 20px;
          border-radius: 10px;
          background: white;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h3 {
          margin: 0 0 15px 0;
          color: #2c3e50;
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
        .file-upload {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .file-upload-btn {
          padding: 8px 12px;
          background: #f0f0f0;
          border: 1px solid #ddd;
          border-radius: 5px;
          cursor: pointer;
        }
        .file-upload-btn:hover {
          background: #e0e0e0;
        }
        .file-name {
          color: #666;
          font-size: 14px;
        }
        .letter-input {
          width: 50px;
          padding: 10px;
          font-size: 18px;
          text-align: center;
          text-transform: lowercase;
        }
        .controls {
          display: flex;
          gap: 10px;
          margin: 15px 0;
        }
        button {
          padding: 10px;
          border: none;
          border-radius: 5px;
          font-weight: bold;
          cursor: pointer;
        }
        .analyze-btn {
          background: #4CAF50;
          color: white;
          flex: 2;
        }
        .generate-btn {
          background: #2196F3;
          color: white;
          flex: 1;
        }
        .result {
          margin-top: 15px;
          padding: 15px;
          border-radius: 5px;
          background: #f8f9fa;
        }
        .placeholder {
          color: #999;
          text-align: center;
        }
        .highlight-letter {
          color: #d63384;
          font-weight: bold;
          font-size: 1.2em;
        }
        .file-stats {
          margin-bottom: 10px;
          line-height: 1.6;
        }
        .examples {
          padding: 10px;
          background: #f0f0f0;
          border-radius: 5px;
          font-family: monospace;
          font-size: 14px;
        }
      </style>
      <div class="container">
        <h3>Подсчёт строк, оканчивающихся на букву</h3>
        
        <div class="input-group">
          <label for="file">Текстовый файл (.txt):</label>
          <div class="file-upload">
            <label class="file-upload-btn">
              Выбрать файл
              <input type="file" accept=".txt" style="display: none;">
            </label>
            <span class="file-name">Файл не выбран</span>
          </div>
        </div>
        
        <div class="input-group">
          <label for="letter">Буква для поиска:</label>
          <div style="display: flex; gap: 10px;">
            <input 
              type="text" 
              name="letter" 
              class="letter-input" 
              maxlength="1" 
              value="${this.state.letter}"
            >
            <button class="generate-btn" type="button">Случайная буква</button>
          </div>
        </div>
        
        <button class="analyze-btn">Анализировать</button>
        
        <div class="result">
          <div class="placeholder">Загрузите текстовый файл</div>
        </div>
      </div>
    `;
  }

  setupEventListeners() {
    this.shadowRoot.querySelector('input[type="file"]').addEventListener('change', (e) => this.handleFileUpload(e));
    this.shadowRoot.querySelector('input[name="letter"]').addEventListener('input', (e) => this.handleLetterInput(e));
    this.shadowRoot.querySelector('.generate-btn').addEventListener('click', () => this.generateRandomLetter());
    this.shadowRoot.querySelector('.analyze-btn').addEventListener('click', () => {
      if (this.state.fileContent) {
        this.state.result = this.countLinesEndingWith(this.state.fileContent, this.state.letter);
        this.updateUI();
      }
    });
  }
}

customElements.define('line-end-counter', LineEndCounter);