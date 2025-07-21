class MatrixDeterminant extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: Arial, sans-serif;
          max-width: 400px;
          padding: 20px;
          border: 2px solid #ccc;
          border-radius: 12px;
          background: #f9f9f9;
        }

        h2 {
          margin-top: 0;
        }

        select, button {
          margin: 10px 0;
          padding: 5px 10px;
          font-size: 1rem;
        }

        .matrix {
          display: grid;
          gap: 5px;
          margin: 10px 0;
        }

        input[type="number"] {
          width: 50px;
          padding: 5px;
          text-align: center;
        }

        .result {
          margin-top: 10px;
          font-weight: bold;
        }
      </style>

      <h2>Определитель матрицы</h2>
      <label>Размер матрицы: 
        <select id="matrix-size">
          <option value="2">2×2</option>
          <option value="3">3×3</option>
        </select>
      </label>

      <div id="matrix-inputs" class="matrix"></div>

      <button id="calc-btn">Вычислить определитель</button>
      <div class="result" id="result"></div>
    `;

    this.sizeSelector = this.shadowRoot.getElementById('matrix-size');
    this.matrixContainer = this.shadowRoot.getElementById('matrix-inputs');
    this.resultEl = this.shadowRoot.getElementById('result');

    this.sizeSelector.addEventListener('change', () => this.renderMatrix());
    this.shadowRoot.getElementById('calc-btn')
      .addEventListener('click', () => this.calculateDeterminant());

    this.renderMatrix(); // Начальный рендер
  }

  renderMatrix() {
    const size = parseInt(this.sizeSelector.value);
    this.matrixContainer.innerHTML = '';
    this.matrixContainer.style.gridTemplateColumns = `repeat(${size}, 1fr)`;

    for (let i = 0; i < size * size; i++) {
      const input = document.createElement('input');
      input.type = 'number';
      input.value = '0';
      this.matrixContainer.appendChild(input);
    }
  }

  calculateDeterminant() {
    const size = parseInt(this.sizeSelector.value);
    const inputs = this.matrixContainer.querySelectorAll('input');
    const values = Array.from(inputs).map(input => Number(input.value));

    let det = 0;

    if (size === 2) {
      const [a, b, c, d] = values;
      det = a * d - b * c;
    } else if (size === 3) {
      const [a, b, c, d, e, f, g, h, i] = values;
      det = a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g);
    }

    this.resultEl.textContent = `Определитель: ${det}`;
  }
}

customElements.define('matrix-determinant', MatrixDeterminant);
