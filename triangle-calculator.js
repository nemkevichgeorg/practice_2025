class TriangleAreaCalculator extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.state = {
      a: '',
      b: '',
      c: '',
      d: '',
      results: []
    };
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  generateRandomLengths() {
    this.state.a = Math.floor(Math.random() * 20) + 1;
    this.state.b = Math.floor(Math.random() * 20) + 1;
    this.state.c = Math.floor(Math.random() * 20) + 1;
    this.state.d = Math.floor(Math.random() * 20) + 1;
    this.state.results = [];
    this.updateInputs();
    this.updateResults();
  }

  canFormTriangle(a, b, c) {
    return a + b > c && a + c > b && b + c > a;
  }

  calculateArea(a, b, c) {
    const p = (a + b + c) / 2;
    return Math.sqrt(p * (p - a) * (p - b) * (p - c));
  }

  checkAllTriangles() {
    const lengths = [
      parseFloat(this.state.a),
      parseFloat(this.state.b),
      parseFloat(this.state.c),
      parseFloat(this.state.d)
    ];

    // Проверяем все комбинации из 3 отрезков
    const combinations = [
      [0, 1, 2], [0, 1, 3], [0, 2, 3], [1, 2, 3]
    ];

    this.state.results = [];

    combinations.forEach(combo => {
      const [i, j, k] = combo;
      const a = lengths[i];
      const b = lengths[j];
      const c = lengths[k];

      if (this.canFormTriangle(a, b, c)) {
        const area = this.calculateArea(a, b, c);
        this.state.results.push({
          sides: [a, b, c],
          area: area
        });
      }
    });

    this.updateResults();
  }

  handleInput(e) {
    this.state[e.target.name] = e.target.value;
    this.state.results = [];
    this.updateResults();
  }

  updateInputs() {
    ['a', 'b', 'c', 'd'].forEach(name => {
      const input = this.shadowRoot.querySelector(`[name="${name}"]`);
      if (input) input.value = this.state[name];
    });
  }

  updateResults() {
    const resultEl = this.shadowRoot.querySelector('.results');
    
    if (!resultEl) return;

    if (this.state.results.length === 0) {
      resultEl.innerHTML = '<div class="placeholder">Нет треугольников или введите длины</div>';
      return;
    }

    resultEl.innerHTML = `
      <div class="result-header">Найдено треугольников: ${this.state.results.length}</div>
      ${this.state.results.map((result, index) => `
        <div class="result-item">
          <strong>Треугольник ${index + 1}:</strong><br>
          Стороны: ${result.sides.join(', ')}<br>
          Площадь: ${result.area.toFixed(2)}
        </div>
      `).join('')}
    `;
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        .container {
          font-family: Arial, sans-serif;
          padding: 15px;
          border: 1px solid #ddd;
          border-radius: 8px;
          max-width: 500px;
          margin: 0 auto;
          background: white;
        }
        h3 {
          margin-top: 0;
          text-align: center;
          color: #333;
        }
        .input-group {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-bottom: 15px;
        }
        input {
          width: 100%;
          padding: 8px;
          border: 1px solid #ccc;
          border-radius: 4px;
          box-sizing: border-box;
        }
        .buttons {
          display: flex;
          gap: 10px;
          margin-bottom: 15px;
        }
        button {
          flex: 1;
          padding: 10px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .check {
          background: #4CAF50;
          color: white;
        }
        .generate {
          background: #2196F3;
          color: white;
        }
        .results {
          padding: 10px;
          border-top: 1px solid #eee;
          min-height: 100px;
        }
        .placeholder {
          color: #999;
          text-align: center;
          padding: 20px 0;
        }
        .result-item {
          margin-bottom: 10px;
          padding: 10px;
          background: #f5f5f5;
          border-radius: 4px;
        }
      </style>
      <div class="container">
        <h3>Проверка треугольников</h3>
        
        <div class="input-group">
          <input type="number" name="a" placeholder="Длина A" min="1">
          <input type="number" name="b" placeholder="Длина B" min="1">
          <input type="number" name="c" placeholder="Длина C" min="1">
          <input type="number" name="d" placeholder="Длина D" min="1">
        </div>
        
        <div class="buttons">
          <button class="check">Проверить</button>
          <button class="generate">Случайные</button>
        </div>
        
        <div class="results">
          <div class="placeholder">Введите длины 4 отрезков</div>
        </div>
      </div>
    `;

    this.updateInputs();
  }

  setupEventListeners() {
    this.shadowRoot.querySelectorAll('input').forEach(input => {
      input.addEventListener('input', (e) => this.handleInput(e));
    });

    this.shadowRoot.querySelector('.check').addEventListener('click', () => {
      this.checkAllTriangles();
    });

    this.shadowRoot.querySelector('.generate').addEventListener('click', () => {
      this.generateRandomLengths();
    });
  }
}

customElements.define('triangle-calculator', TriangleAreaCalculator);