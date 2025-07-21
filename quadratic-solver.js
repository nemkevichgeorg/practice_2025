class QuadraticEquationSolver extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.state = {
      a: '',
      b: '',
      c: '',
      result: null
    };
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  solveEquation(a, b, c) {
    // Приводим к числам
    a = parseFloat(a);
    b = parseFloat(b);
    c = parseFloat(c);

    // Проверка на корректность ввода
    if (isNaN(a) || isNaN(b) || isNaN(c)) {
      return { error: "Все коэффициенты должны быть числами" };
    }

    if (a === 0) {
      return { error: "Коэффициент 'a' не может быть нулём" };
    }

    const discriminant = b * b - 4 * a * c;
    
    if (discriminant > 0) {
      // Два действительных корня
      const x1 = (-b + Math.sqrt(discriminant)) / (2 * a);
      const x2 = (-b - Math.sqrt(discriminant)) / (2 * a);
      return { 
        type: 'real', 
        roots: [x1, x2], 
        discriminant 
      };
    } else if (discriminant === 0) {
      // Один действительный корень
      const x = -b / (2 * a);
      return { 
        type: 'real-single', 
        roots: [x], 
        discriminant 
      };
    } else {
      // Два комплексных корня
      const realPart = -b / (2 * a);
      const imagPart = Math.sqrt(-discriminant) / (2 * a);
      return {
        type: 'complex',
        roots: [
          { real: realPart, imag: imagPart },
          { real: realPart, imag: -imagPart }
        ],
        discriminant
      };
    }
  }

  handleInput(e) {
    const { name, value } = e.target;
    this.state[name] = value;
    this.state.result = null;
    this.updateUI();
  }

  handleSolve() {
    const { a, b, c } = this.state;
    this.state.result = this.solveEquation(a, b, c);
    this.updateUI();
  }

  updateUI() {
    const resultEl = this.shadowRoot.querySelector('.result');
    const aInput = this.shadowRoot.querySelector('input[name="a"]');
    const bInput = this.shadowRoot.querySelector('input[name="b"]');
    const cInput = this.shadowRoot.querySelector('input[name="c"]');

    aInput.value = this.state.a;
    bInput.value = this.state.b;
    cInput.value = this.state.c;

    if (!this.state.result) {
      resultEl.innerHTML = '<div class="placeholder">Введите коэффициенты уравнения</div>';
      return;
    }

    if (this.state.result.error) {
      resultEl.innerHTML = `<div class="error">${this.state.result.error}</div>`;
      return;
    }

    const { type, roots, discriminant } = this.state.result;

    let solutionHTML = `
      <div class="solution">
        <div class="discriminant">Дискриминант: D = ${discriminant.toFixed(2)}</div>
    `;

    if (type === 'real') {
      solutionHTML += `
        <div class="roots">Два действительных корня:</div>
        <div class="root">x₁ = ${roots[0].toFixed(4)}</div>
        <div class="root">x₂ = ${roots[1].toFixed(4)}</div>
      `;
    } else if (type === 'real-single') {
      solutionHTML += `
        <div class="roots">Один действительный корень:</div>
        <div class="root">x = ${roots[0].toFixed(4)}</div>
      `;
    } else {
      solutionHTML += `
        <div class="roots">Два комплексных корня:</div>
        <div class="root">x₁ = ${roots[0].real.toFixed(4)} + ${Math.abs(roots[0].imag).toFixed(4)}i</div>
        <div class="root">x₂ = ${roots[1].real.toFixed(4)} - ${Math.abs(roots[1].imag).toFixed(4)}i</div>
      `;
    }

    solutionHTML += '</div>';
    resultEl.innerHTML = solutionHTML;
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          max-width: 800px;
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
          margin: 0 0 20px 0;
          color: #2c3e50;
          text-align: center;
        }
        .equation {
          font-size: 1.2em;
          text-align: center;
          margin: 20px 0;
          font-weight: bold;
        }
        .inputs {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 10px;
          margin-bottom: 20px;
        }
        .input-group {
          display: flex;
          flex-direction: column;
        }
        label {
          margin-bottom: 5px;
          font-weight: 500;
          color: #555;
        }
        input {
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 5px;
          font-size: 16px;
          text-align: center;
        }
        input:focus {
          outline: none;
          border-color: #4CAF50;
        }
        button {
          width: 100%;
          padding: 12px;
          background: #4CAF50;
          color: white;
          border: none;
          border-radius: 5px;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          transition: background 0.3s;
        }
        button:hover {
          background: #45a049;
        }
        .result {
          margin-top: 20px;
          padding: 15px;
          border-radius: 5px;
          background: #f8f9fa;
          min-height: 100px;
        }
        .placeholder {
          color: #999;
          text-align: center;
          padding: 20px 0;
        }
        .error {
          color: #f44336;
          font-weight: 500;
          text-align: center;
        }
        .solution {
          text-align: center;
        }
        .discriminant {
          margin-bottom: 15px;
          font-weight: 500;
          color: #333;
        }
        .roots {
          font-weight: 500;
          margin-bottom: 10px;
        }
        .root {
          margin: 5px 0;
          font-family: monospace;
        }
      </style>
      <div class="container">
        <h3>Решение квадратного уравнения</h3>
        <div class="equation">ax² + bx + c = 0</div>
        
        <div class="inputs">
          <div class="input-group">
            <label for="a">Коэффициент a</label>
            <input type="number" name="a" placeholder="a" step="any">
          </div>
          <div class="input-group">
            <label for="b">Коэффициент b</label>
            <input type="number" name="b" placeholder="b" step="any">
          </div>
          <div class="input-group">
            <label for="c">Коэффициент c</label>
            <input type="number" name="c" placeholder="c" step="any">
          </div>
        </div>
        
        <button id="solve-btn">Решить уравнение</button>
        
        <div class="result">
          <div class="placeholder">Введите коэффициенты уравнения</div>
        </div>
      </div>
    `;
  }

  setupEventListeners() {
    const inputs = this.shadowRoot.querySelectorAll('input');
    const solveBtn = this.shadowRoot.querySelector('#solve-btn');
    
    inputs.forEach(input => {
      input.addEventListener('input', (e) => this.handleInput(e));
    });
    
    solveBtn.addEventListener('click', () => this.handleSolve());
  }
}

customElements.define('quadratic-solver', QuadraticEquationSolver);