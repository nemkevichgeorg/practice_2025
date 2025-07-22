class CubicEquationSolver extends HTMLElement {
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
          max-width: 500px;
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
        
        .equation {
          text-align: center;
          font-size: 18px;
          margin: 20px 0;
          font-family: 'Times New Roman', serif;
        }
        
        .input-group {
          display: flex;
          align-items: center;
          margin-bottom: 15px;
        }
        
        .input-group label {
          width: 30px;
          text-align: center;
          font-weight: 500;
          color: var(--text-color);
        }
        
        input {
          flex: 1;
          padding: 10px 12px;
          border: 1px solid var(--border-color);
          border-radius: 6px;
          font-size: 16px;
          transition: all 0.3s ease;
        }
        
        input:focus {
          outline: none;
          border-color: var(--primary-color);
          box-shadow: 0 0 0 2px rgba(108, 92, 231, 0.2);
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
          margin-top: 15px;
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
        
        .root {
          margin: 8px 0;
          padding-left: 15px;
          border-left: 3px solid #a29bfe;
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
        <h2>Решатель кубических уравнений</h2>
        <div class="equation">ax³ + bx² + cx + d = 0</div>
        
        <div class="input-group">
          <label>a:</label>
          <input type="number" id="a" step="any" placeholder="Введите коэффициент">
        </div>
        
        <div class="input-group">
          <label>b:</label>
          <input type="number" id="b" step="any" placeholder="Введите коэффициент">
        </div>
        
        <div class="input-group">
          <label>c:</label>
          <input type="number" id="c" step="any" placeholder="Введите коэффициент">
        </div>
        
        <div class="input-group">
          <label>d:</label>
          <input type="number" id="d" step="any" placeholder="Введите коэффициент">
        </div>
        
        <button id="solveBtn">Решить уравнение</button>
        
        <div class="result" id="output">
          <div class="result-title">Решение</div>
          <div id="resultText">Введите коэффициенты и нажмите "Решить уравнение"</div>
        </div>
      </div>
    `;
  }

  connectedCallback() {
    this.shadowRoot.querySelector('#solveBtn')
      .addEventListener('click', () => this.solveEquation());
  }

  solveEquation() {
    const a = parseFloat(this.shadowRoot.querySelector('#a').value);
    const b = parseFloat(this.shadowRoot.querySelector('#b').value);
    const c = parseFloat(this.shadowRoot.querySelector('#c').value);
    const d = parseFloat(this.shadowRoot.querySelector('#d').value);
    const output = this.shadowRoot.querySelector('#output');
    const resultText = this.shadowRoot.querySelector('#resultText');

    // Сброс стилей
    output.classList.remove('success', 'error');

    // Проверка на валидность ввода
    if (isNaN(a) || isNaN(b) || isNaN(c) || isNaN(d)) {
      resultText.textContent = 'Пожалуйста, введите все коэффициенты';
      output.classList.add('error');
      return;
    }

    // Решение кубического уравнения
    const roots = this.solveCubic(a, b, c, d);

    // Форматирование результата
    if (roots.length === 0) {
      resultText.innerHTML = 'Действительных корней не найдено';
      output.classList.add('error');
    } else {
      let resultHTML = '';
      roots.forEach((root, index) => {
        resultHTML += `
          <div class="root">
            Корень ${index + 1}: <strong>${root.toFixed(4)}</strong>
          </div>
        `;
      });
      resultText.innerHTML = resultHTML;
      output.classList.add('success');
    }
  }

  solveCubic(a, b, c, d) {
    // Приведение уравнения к виду x³ + px² + qx + r = 0
    const p = b / a;
    const q = c / a;
    const r = d / a;

    // Вычисление дискриминанта
    const Q = (p*p - 3*q) / 9;
    const R = (2*p*p*p - 9*p*q + 27*r) / 54;
    const D = Q*Q*Q - R*R;

    const roots = [];

    if (D >= 0) {
      // Три действительных корня
      const theta = Math.acos(R / Math.sqrt(Q*Q*Q));
      const sqrtQ = Math.sqrt(Q);
      
      roots.push(
        -2 * sqrtQ * Math.cos(theta/3) - p/3,
        -2 * sqrtQ * Math.cos((theta + 2*Math.PI)/3) - p/3,
        -2 * sqrtQ * Math.cos((theta - 2*Math.PI)/3) - p/3
      );
    } else {
      // Один действительный корень
      const A = -Math.sign(R) * Math.cbrt(Math.abs(R) + Math.sqrt(-D));
      const B = (A !== 0) ? Q/A : 0;
      
      const realRoot = (A + B) - p/3;
      roots.push(realRoot);
    }

    // Сортируем корни по возрастанию
    return roots.sort((x, y) => x - y);
  }
}

customElements.define('cubic-solver', CubicEquationSolver);