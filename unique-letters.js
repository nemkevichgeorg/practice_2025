class UniqueLetters extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.state = {
      text: '',
      result: [],
      generated: false
    };
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  // Получить уникальные буквы в алфавитном порядке
  getUniqueLetters(text) {
    const letters = text.toLowerCase()
      .split('')
      .filter(char => char.match(/[а-яa-z]/)); // Только буквы
    
    const unique = [...new Set(letters)]; // Уникальные буквы
    return unique.sort(); // Сортировка по алфавиту
  }

  // Генерация случайного текста
  generateRandomText() {
    const words = [
      "Съешь", "ещё", "этих", "мягких", "французских", "булок", 
      "да", "выпей", "чаю", "The", "quick", "brown", "fox"
    ];
    const randomText = [];
    
    for (let i = 0; i < 8; i++) {
      randomText.push(words[Math.floor(Math.random() * words.length)]);
    }
    
    this.state.text = randomText.join(' ');
    this.state.generated = true;
    this.state.result = this.getUniqueLetters(this.state.text);
    this.updateUI();
  }

  handleInput(e) {
    this.state.text = e.target.value;
    this.state.generated = false;
    this.state.result = this.getUniqueLetters(this.state.text);
    this.updateUI();
  }

  updateUI() {
    const textarea = this.shadowRoot.querySelector('textarea');
    const resultEl = this.shadowRoot.querySelector('.result');
    
    textarea.value = this.state.text;
    
    if (this.state.text.length === 0) {
      resultEl.innerHTML = '<div class="placeholder">Введите текст или сгенерируйте случайный</div>';
    } else {
      resultEl.innerHTML = `
        <div class="result-header">
          Уникальные буквы (${this.state.result.length}):
        </div>
        <div class="letters-container">
          ${this.state.result.map(letter => `
            <span class="letter">${letter}</span>
          `).join('')}
        </div>
      `;
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
          max-width: 700px;
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
        textarea {
          width: 90%;
          min-height: 100px;
          padding: 15px;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          font-size: 16px;
          resize: vertical;
          margin-bottom: 15px;
          transition: border-color 0.3s;
        }
        textarea:focus {
          border-color: #4CAF50;
          outline: none;
        }
        .controls {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
        }
        button {
          padding: 12px 20px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 16px;
          font-weight: 600;
          transition: all 0.3s;
          flex: 1;
        }
        #analyze-btn {
          background: #4CAF50;
          color: white;
        }
        #analyze-btn:hover {
          background: #45a049;
          transform: translateY(-2px);
        }
        #generate-btn {
          background: #2196F3;
          color: white;
        }
        #generate-btn:hover {
          background: #0b7dda;
          transform: translateY(-2px);
        }
        .result {
          min-height: 80px;
          padding: 20px;
          border-radius: 8px;
          background: #f8f9fa;
          margin-top: 15px;
        }
        .result-header {
          font-weight: 600;
          margin-bottom: 15px;
          color: #333;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .generated-badge {
          background: #e3f2fd;
          color: #0b7dda;
          padding: 3px 8px;
          border-radius: 12px;
          font-size: 0.8em;
          font-weight: normal;
        }
        .letters-container {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .letter {
          display: inline-block;
          width: 32px;
          height: 32px;
          line-height: 32px;
          text-align: center;
          background: #4CAF50;
          color: white;
          border-radius: 50%;
          font-weight: bold;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .placeholder {
          color: #000000ff;
          padding: 20px;
        }
      </style>
      <div class="container">
        <h3>Уникальные буквы в тексте</h3>
        
        <textarea placeholder="Введите или сгенерируйте текст"></textarea>
        
        <div class="controls">
          <button id="analyze-btn">Анализировать</button>
          <button id="generate-btn">Сгенерировать текст</button>
        </div>
        
        <div class="result">
          <div class="placeholder">Введите текст или сгенерируйте случайный</div>
        </div>
      </div>
    `;
  }

  setupEventListeners() {
    const textarea = this.shadowRoot.querySelector('textarea');
    const analyzeBtn = this.shadowRoot.querySelector('#analyze-btn');
    const generateBtn = this.shadowRoot.querySelector('#generate-btn');
    
    textarea.addEventListener('input', (e) => this.handleInput(e));
    analyzeBtn.addEventListener('click', () => {
      this.state.result = this.getUniqueLetters(this.state.text);
      this.updateUI();
    });
    generateBtn.addEventListener('click', () => this.generateRandomText());
  }
}

customElements.define('unique-letters', UniqueLetters);