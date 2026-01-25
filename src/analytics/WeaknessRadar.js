/**
 * WeaknessRadar.js
 * 
 * F04: 약점 분석 레이더
 * - 7개 카테고리별 정답률 추적
 * - Chart.js Radar Chart 시각화
 * - localStorage 기반 데이터 저장
 * - 맞춤형 학습 제안
 */

import Chart from 'chart.js/auto';

class WeaknessRadar {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      throw new Error(`컨테이너를 찾을 수 없습니다: ${containerId}`);
    }

    // 7개 카테고리
    this.categories = {
      '자음': { total: 0, correct: 0, color: '#ef4444' },
      '모음': { total: 0, correct: 0, color: '#f59e0b' },
      '약자': { total: 0, correct: 0, color: '#10b981' },
      '약어': { total: 0, correct: 0, color: '#06b6d4' },
      '숫자': { total: 0, correct: 0, color: '#6366f1' },
      '로마자': { total: 0, correct: 0, color: '#a855f7' },
      '부호': { total: 0, correct: 0, color: '#ec4899' }
    };

    this.chart = null;

    this.init();
  }

  /**
   * 초기화
   */
  init() {
    this.loadData();
    this.render();
  }

  /**
   * localStorage에서 데이터 로드
   */
  loadData() {
    const saved = localStorage.getItem('braille_stats');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        Object.keys(this.categories).forEach(category => {
          if (data[category]) {
            this.categories[category].total = data[category].total || 0;
            this.categories[category].correct = data[category].correct || 0;
          }
        });
      } catch (e) {
        console.error('데이터 로드 실패:', e);
      }
    }
  }

  /**
   * localStorage에 데이터 저장
   */
  saveData() {
    const data = {};
    Object.keys(this.categories).forEach(category => {
      data[category] = {
        total: this.categories[category].total,
        correct: this.categories[category].correct
      };
    });
    localStorage.setItem('braille_stats', JSON.stringify(data));
  }

  /**
   * UI 렌더링
   */
  render() {
    this.container.innerHTML = `
      <div class="weakness-radar">
        <nav class="radar-nav">
          <button class="nav-home-btn" onclick="window.location.reload()">🏠 홈으로</button>
        </nav>

        <div class="radar-header">
          <h2><span class="emoji">📊</span> 약점 분석</h2>
          <p class="radar-subtitle">카테고리별 정답률 분석</p>
        </div>

        <div class="radar-content">
          <div class="chart-container">
            <canvas id="radar-chart"></canvas>
          </div>

          <div class="stats-grid">
            ${this.renderStatsGrid()}
          </div>

          <div class="recommendations">
            ${this.renderRecommendations()}
          </div>

          <div class="data-actions">
            <a href="#" class="action-link demo-link">📊 예시 보기</a>
            <span class="action-separator">|</span>
            <a href="#" class="action-link reset-link">🔄 초기화</a>
          </div>
        </div>
      </div>

      ${this.getStyles()}
    `;

    this.renderChart();
    this.attachEventListeners();
  }

  /**
   * 통계 그리드 렌더링
   */
  renderStatsGrid() {
    return Object.entries(this.categories).map(([category, data]) => {
      const accuracy = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
      const level = this.getLevel(accuracy);

      return `
        <div class="stat-card" style="border-color: ${data.color}">
          <div class="stat-header">
            <h4>${category}</h4>
            <span class="accuracy ${level.class}">${accuracy}%</span>
          </div>
          <div class="stat-body">
            <p>${data.correct} / ${data.total} 문제</p>
            <div class="level-badge ${level.class}">${level.text}</div>
          </div>
        </div>
      `;
    }).join('');
  }

  /**
   * 정답률에 따른 레벨 반환
   */
  getLevel(accuracy) {
    if (accuracy >= 90) return { text: '우수', class: 'excellent' };
    if (accuracy >= 70) return { text: '양호', class: 'good' };
    if (accuracy >= 50) return { text: '보통', class: 'average' };
    return { text: '보완 필요', class: 'weak' };
  }

  /**
   * 맞춤형 학습 제안 렌더링
   */
  renderRecommendations() {
    const weakCategories = Object.entries(this.categories)
      .filter(([_, data]) => {
        const accuracy = data.total > 0 ? (data.correct / data.total) * 100 : 0;
        return accuracy < 70 && data.total > 0;
      })
      .sort((a, b) => {
        const accA = a[1].total > 0 ? (a[1].correct / a[1].total) : 0;
        const accB = b[1].total > 0 ? (b[1].correct / b[1].total) : 0;
        return accA - accB;
      });

    if (weakCategories.length === 0) {
      return `
        <div class="recommendation-empty">
          <p>🎉 모든 카테고리에서 우수한 성적입니다!</p>
          <p>더 많은 문제를 풀어보세요.</p>
        </div>
      `;
    }

    return `
      <h3>💡 맞춤형 학습 제안</h3>
      <div class="recommendation-list">
        ${weakCategories.map(([category, data]) => {
      const accuracy = Math.round((data.correct / data.total) * 100);
      return `
            <div class="recommendation-item">
              <span class="category-badge" style="background: ${data.color}">${category}</span>
              <span class="accuracy-text">${accuracy}%</span>
              <span class="suggestion">
                ${this.getSuggestion(category)}
              </span>
            </div>
          `;
    }).join('')}
      </div>
    `;
  }

  /**
   * 카테고리별 학습 제안
   */
  getSuggestion(category) {
    const suggestions = {
      '자음': '제1항, 제2항, 제3항을 복습하세요',
      '모음': '제6항, 제7항을 집중 학습하세요',
      '약자': '제13항~제17항 약자 규칙을 확인하세요',
      '약어': '제18항 접속사 약어를 학습하세요',
      '숫자': '제40항~제44항 숫자 표기를 연습하세요',
      '로마자': '제28항, 제29항 UEB 규칙을 학습하세요',
      '부호': '제49항 문장 부호를 복습하세요'
    };
    return suggestions[category] || '관련 조항을 복습하세요';
  }

  /**
   * Radar Chart 렌더링
   */
  renderChart() {
    const canvas = this.container.querySelector('#radar-chart');
    const ctx = canvas.getContext('2d');

    if (this.chart) {
      this.chart.destroy();
    }

    const labels = Object.keys(this.categories);
    const data = labels.map(category => {
      const cat = this.categories[category];
      return cat.total > 0 ? Math.round((cat.correct / cat.total) * 100) : 0;
    });

    this.chart = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: labels,
        datasets: [{
          label: '정답률 (%)',
          data: data,
          backgroundColor: 'rgba(99, 102, 241, 0.2)',
          borderColor: 'rgb(99, 102, 241)',
          borderWidth: 2,
          pointBackgroundColor: 'rgb(99, 102, 241)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgb(99, 102, 241)'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          r: {
            beginAtZero: true,
            max: 100,
            ticks: {
              stepSize: 20,
              color: '#334155'
            },
            grid: {
              color: 'rgba(148, 163, 184, 0.2)'
            },
            pointLabels: {
              color: '#1e293b',
              font: {
                size: 14,
                weight: 'bold'
              }
            }
          }
        },
        plugins: {
          legend: {
            labels: {
              color: '#1e293b',
              font: {
                size: 12
              }
            }
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                return context.parsed.r + '%';
              }
            }
          }
        }
      }
    });
  }

  /**
   * 이벤트 리스너 연결
   */
  attachEventListeners() {
    this.container.querySelector('.reset-link').addEventListener('click', (e) => {
      e.preventDefault();
      if (confirm('모든 통계 데이터를 초기화하시겠습니까?')) {
        this.resetData();
      }
    });

    this.container.querySelector('.demo-link').addEventListener('click', (e) => {
      e.preventDefault();
      this.generateDemoData();
    });
  }

  /**
   * 데이터 초기화
   */
  resetData() {
    Object.keys(this.categories).forEach(category => {
      this.categories[category].total = 0;
      this.categories[category].correct = 0;
    });
    this.saveData();
    this.render();
  }

  /**
   * 데모 데이터 생성
   */
  generateDemoData() {
    Object.keys(this.categories).forEach(category => {
      const total = Math.floor(Math.random() * 50) + 10;
      const correct = Math.floor(Math.random() * total);
      this.categories[category].total = total;
      this.categories[category].correct = correct;
    });
    this.saveData();
    this.render();
  }

  /**
   * 결과 기록 (외부에서 호출)
   */
  recordResult(category, isCorrect) {
    if (this.categories[category]) {
      this.categories[category].total++;
      if (isCorrect) {
        this.categories[category].correct++;
      }
      this.saveData();
    }
  }

  /**
   * 스타일
   */
  getStyles() {
    return `
      <style>
        .weakness-radar {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }

        .radar-nav {
          display: flex;
          justify-content: flex-start;
          padding: 1rem 0;
          margin-bottom: 1rem;
        }

        .nav-home-btn {
          padding: 0.5rem 1rem;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          color: #334155;
          font-size: 0.95rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .nav-home-btn:hover {
          background: #f8fafc;
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .radar-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .radar-header h2 {
          font-size: 2rem;
          margin-bottom: 0.5rem;
          color: #0f172a;
        }

        .radar-header h2 .emoji {
          color: #0f172a;
        }

        .radar-subtitle {
          color: #334155;
        }

        .radar-content {
          background: rgba(255, 255, 255, 0.6);
          border-radius: 12px;
          padding: 2rem;
          border: 1px solid rgba(163, 177, 198, 0.3);
        }

        .chart-container {
          max-width: 600px;
          margin: 0 auto 3rem;
          padding: 2rem;
          background: rgba(255, 255, 255, 0.5);
          border-radius: 12px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: rgba(255, 255, 255, 0.6);
          border: 2px solid;
          border-radius: 12px;
          padding: 1.5rem;
        }

        .stat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .stat-header h4 {
          color: #1e293b;
          font-size: 1.2rem;
        }

        .accuracy {
          font-size: 1.5rem;
          font-weight: bold;
        }

        .accuracy.excellent { color: #10b981; }
        .accuracy.good { color: #06b6d4; }
        .accuracy.average { color: #f59e0b; }
        .accuracy.weak { color: #ef4444; }

        .stat-body p {
          color: #334155;
          margin-bottom: 0.5rem;
        }

        .level-badge {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          border-radius: 6px;
          font-size: 0.9rem;
          font-weight: bold;
        }

        .level-badge.excellent {
          background: rgba(16, 185, 129, 0.2);
          color: #6ee7b7;
        }

        .level-badge.good {
          background: rgba(6, 182, 212, 0.2);
          color: #67e8f9;
        }

        .level-badge.average {
          background: rgba(245, 158, 11, 0.2);
          color: #fcd34d;
        }

        .level-badge.weak {
          background: rgba(239, 68, 68, 0.2);
          color: #fca5a5;
        }

        .recommendations {
          background: rgba(99, 102, 241, 0.1);
          border: 1px solid rgba(99, 102, 241, 0.3);
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 2rem;
        }

        .recommendations h3 {
          color: white;
          margin-bottom: 1rem;
        }

        .recommendation-empty {
          text-align: center;
          color: #10b981;
          padding: 2rem;
        }

        .recommendation-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .recommendation-item {
          display: grid;
          grid-template-columns: 80px 60px 1fr;
          gap: 1rem;
          align-items: center;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.5);
          border-radius: 8px;
        }

        .category-badge {
          padding: 0.5rem;
          border-radius: 6px;
          color: white;
          text-align: center;
          font-weight: bold;
        }

        .accuracy-text {
          color: #fbbf24;
          font-weight: bold;
        }

        .suggestion {
          color: #1e293b;
        }

        .data-actions {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 0;
          margin-top: 1rem;
        }

        .action-link {
          color: #64748b;
          text-decoration: none;
          font-size: 0.85rem;
          font-weight: 500;
          transition: all 0.2s;
          cursor: pointer;
        }

        .action-link:hover {
          color: #6366f1;
          text-decoration: underline;
        }

        .action-separator {
          color: #cbd5e1;
          font-size: 0.85rem;
        }
      </style>
    `;
  }
}

export default WeaknessRadar;
