/**
 * DotInputPad.js
 * 
 * 6점 터치 입력 인터페이스
 * - 2x3 그리드 점 입력
 * - 다중 셀 지원
 * - 실시간 미리보기
 */

class DotInputPad {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      throw new Error(`컨테이너를 찾을 수 없습니다: ${containerId}`);
    }

    this.options = {
      maxCells: options.maxCells || 10,
      onInputComplete: options.onInputComplete || (() => { }),
      onInputChange: options.onInputChange || (() => { })
    };

    this.cells = [];  // 각 셀의 dots 배열
    this.currentCellIndex = 0;
    this.currentDots = [];  // 현재 셀의 활성 점들

    this.init();
  }

  /**
   * 초기화
   */
  init() {
    this.render();
    this.attachEventListeners();
  }

  /**
   * UI 렌더링
   */
  render() {
    this.container.innerHTML = `
      <div class="dot-input-pad">
        <div class="current-cell-display">
          <h4>현재 입력 중</h4>
          <div class="dot-grid" id="current-grid">
            ${this.renderDotGrid(this.currentDots)}
          </div>
        </div>

        <div class="dot-controls">
          <button class="dot-btn" data-dot="1">1</button>
          <button class="dot-btn" data-dot="4">4</button>
          <button class="dot-btn" data-dot="2">2</button>
          <button class="dot-btn" data-dot="5">5</button>
          <button class="dot-btn" data-dot="3">3</button>
          <button class="dot-btn" data-dot="6">6</button>
        </div>

        <div class="input-actions">
          <button class="action-btn next-cell-btn">다음 셀 →</button>
          <button class="action-btn clear-btn">현재 셀 지우기</button>
          <button class="action-btn backspace-btn">← 이전 셀로</button>
        </div>

        <div class="cells-preview">
          <h4>전체 입력 (${this.cells.length}/${this.options.maxCells})</h4>
          <div class="cells-container" id="cells-container">
            ${this.renderAllCells()}
          </div>
        </div>

        <div class="final-actions">
          <button class="action-btn reset-btn">전체 초기화</button>
          <button class="action-btn submit-btn">제출</button>
        </div>
      </div>

      ${this.getStyles()}
    `;
  }

  /**
   * 점 그리드 렌더링
   */
  renderDotGrid(dots) {
    const grid = [
      [false, false],  // 1, 4
      [false, false],  // 2, 5
      [false, false]   // 3, 6
    ];

    dots.forEach(dot => {
      if (dot === 1) grid[0][0] = true;
      else if (dot === 2) grid[1][0] = true;
      else if (dot === 3) grid[2][0] = true;
      else if (dot === 4) grid[0][1] = true;
      else if (dot === 5) grid[1][1] = true;
      else if (dot === 6) grid[2][1] = true;
    });

    return grid.map(row =>
      row.map(isActive =>
        `<div class="dot ${isActive ? 'active' : 'inactive'}"></div>`
      ).join('')
    ).join('');
  }

  /**
   * 전체 셀 렌더링
   */
  renderAllCells() {
    if (this.cells.length === 0) {
      return '<p class="empty-message">입력된 셀이 없습니다</p>';
    }

    return this.cells.map((dots, index) => `
      <div class="mini-cell ${index === this.currentCellIndex ? 'current' : ''}">
        <div class="mini-grid">
          ${this.renderDotGrid(dots)}
        </div>
        <div class="cell-index">${index + 1}</div>
      </div>
    `).join('');
  }

  /**
   * 이벤트 리스너 연결
   */
  attachEventListeners() {
    // 점 버튼
    this.container.querySelectorAll('.dot-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const dot = parseInt(e.target.dataset.dot);
        this.toggleDot(dot);
      });
    });

    // 다음 셀
    this.container.querySelector('.next-cell-btn').addEventListener('click', () => {
      this.addCell();
    });

    // 현재 셀 지우기
    this.container.querySelector('.clear-btn').addEventListener('click', () => {
      this.clearCurrentCell();
    });

    // 이전 셀로
    this.container.querySelector('.backspace-btn').addEventListener('click', () => {
      this.previousCell();
    });

    // 전체 초기화
    this.container.querySelector('.reset-btn').addEventListener('click', () => {
      this.reset();
    });

    // 제출
    this.container.querySelector('.submit-btn').addEventListener('click', () => {
      this.submit();
    });
  }

  /**
   * 점 토글
   */
  toggleDot(dotNumber) {
    const index = this.currentDots.indexOf(dotNumber);

    if (index > -1) {
      this.currentDots.splice(index, 1);
    } else {
      this.currentDots.push(dotNumber);
    }

    this.currentDots.sort((a, b) => a - b);
    this.updateCurrentGrid();
    this.options.onInputChange(this.cells, this.currentDots);
  }

  /**
   * 현재 그리드 업데이트
   */
  updateCurrentGrid() {
    const grid = this.container.querySelector('#current-grid');
    grid.innerHTML = this.renderDotGrid(this.currentDots);
  }

  /**
   * 셀 추가
   */
  addCell() {
    if (this.cells.length >= this.options.maxCells) {
      alert(`최대 ${this.options.maxCells}개 셀까지만 입력 가능합니다.`);
      return;
    }

    // 현재 dots를 셀에 추가
    this.cells.push([...this.currentDots]);
    this.currentDots = [];
    this.currentCellIndex = this.cells.length;

    this.updateDisplay();
    this.options.onInputChange(this.cells, this.currentDots);
  }

  /**
   * 현재 셀 지우기
   */
  clearCurrentCell() {
    this.currentDots = [];
    this.updateCurrentGrid();
    this.options.onInputChange(this.cells, this.currentDots);
  }

  /**
   * 이전 셀로 이동
   */
  previousCell() {
    if (this.cells.length === 0) return;

    // 현재 입력 중인 셀이 비어있다면 마지막 셀 제거
    if (this.currentDots.length === 0 && this.cells.length > 0) {
      this.currentDots = this.cells.pop();
      this.currentCellIndex = this.cells.length;
      this.updateDisplay();
    }
  }

  /**
   * 전체 초기화
   */
  reset() {
    this.cells = [];
    this.currentDots = [];
    this.currentCellIndex = 0;
    this.updateDisplay();
    this.options.onInputChange(this.cells, this.currentDots);
  }

  /**
   * 제출
   */
  submit() {
    // 현재 입력 중인 셀이 있다면 추가
    if (this.currentDots.length > 0) {
      this.cells.push([...this.currentDots]);
    }

    this.options.onInputComplete(this.cells);
  }

  /**
   * 디스플레이 업데이트
   */
  updateDisplay() {
    this.updateCurrentGrid();

    const cellsContainer = this.container.querySelector('#cells-container');
    cellsContainer.innerHTML = this.renderAllCells();

    const title = this.container.querySelector('.cells-preview h4');
    title.textContent = `전체 입력 (${this.cells.length}/${this.options.maxCells})`;
  }

  /**
   * 현재 입력값 가져오기
   */
  getValue() {
    const allCells = [...this.cells];
    if (this.currentDots.length > 0) {
      allCells.push([...this.currentDots]);
    }
    return allCells;
  }

  /**
   * 스타일
   */
  getStyles() {
    return `
      <style>
        .dot-input-pad {
          background: rgba(255, 255, 255, 0.6);
          border-radius: 12px;
          padding: 2rem;
          border: 1px solid rgba(163, 177, 198, 0.3);
        }

        .current-cell-display {
          text-align: center;
          margin-bottom: 2rem;
        }

        .current-cell-display h4 {
          color: #1e293b;
          margin-bottom: 1rem;
        }

        .dot-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          grid-template-rows: repeat(3, 1fr);
          gap: 12px;
          width: 120px;
          height: 180px;
          margin: 0 auto;
          padding: 20px;
          background: rgba(255, 255, 255, 0.6);
          border-radius: 12px;
        }

        .dot {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          transition: all 0.2s;
        }

        .dot.active {
          background: #000000;
          box-shadow: 0 0 20px #6366f1;
        }

        .dot.inactive {
          border: 3px solid #E0E0E0;
        }

        .dot-controls {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          max-width: 300px;
          margin: 0 auto 2rem;
        }

        .dot-btn {
          padding: 1.5rem;
          background: linear-gradient(145deg, #6d70f7, #5a5dd4);
          border: 2px solid #6366f1;
          border-radius: 50%;
          color: white;
          font-size: 1.5rem;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.2s;
        }

        .dot-btn:hover {
          background: rgba(99, 102, 241, 0.4);
          transform: scale(1.1);
        }

        .dot-btn:active {
          transform: scale(0.95);
        }

        .input-actions, .final-actions {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }

        .action-btn {
          flex: 1;
          padding: 0.75rem 1rem;
          background: #e2e8f0;
          border: 1px solid rgba(163, 177, 198, 0.4);
          border-radius: 8px;
          color: #1e293b;
          cursor: pointer;
          transition: all 0.2s;
          min-width: 120px;
        }

        .action-btn:hover {
          background: linear-gradient(145deg, #6366f1, #8b5cf6);
          border-color: #6366f1;
        }

        .next-cell-btn {
          background: rgba(16, 185, 129, 0.2);
          border-color: #10b981;
          color: #6ee7b7;
        }

        .submit-btn {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          border: none;
          color: white;
          font-weight: 600;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
        }

        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
        }

        .cells-preview {
          margin-bottom: 2rem;
        }

        .cells-preview h4 {
          color: #1e293b;
          margin-bottom: 1rem;
          text-align: center;
        }

        .cells-container {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          justify-content: center;
          min-height: 100px;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.5);
          border-radius: 8px;
        }

        .empty-message {
          color: #334155;
          text-align: center;
          width: 100%;
        }

        .mini-cell {
          text-align: center;
          padding: 0.5rem;
          background: rgba(255, 255, 255, 0.6);
          border-radius: 8px;
          border: 1px solid rgba(163, 177, 198, 0.3);
        }

        .mini-cell.current {
          border-color: #6366f1;
          background: rgba(99, 102, 241, 0.1);
        }

        .mini-grid {
          width: 40px;
          height: 60px;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          grid-template-rows: repeat(3, 1fr);
          gap: 4px;
          margin-bottom: 0.5rem;
        }

        .mini-grid .dot {
          width: 100%;
          height: 100%;
        }

        .mini-grid .dot.active {
          background: #6366f1;
        }

        .mini-grid .dot.inactive {
          border: 1px solid #E0E0E0;
        }

        .cell-index {
          font-size: 0.8rem;
          color: #334155;
        }
      </style>
    `;
  }
}

export default DotInputPad;
