/**
 * 점자 마스터 2024 - 메인 애플리케이션
 * 벤토 스타일 홈 화면
 */

import './style.css';
import './styles/auth-modal.css';
import BrailleTranslator from './engine/BrailleTranslator.js';
import BrailleUtils from './engine/BrailleUtils.js';
import BrailleValidator from './engine/BrailleValidator.js';
import StudyMode from './components/StudyMode.js';
import ReadingQuiz from './components/ReadingQuiz.js';
import WritingQuiz from './components/WritingQuiz.js';
import WeaknessRadar from './analytics/WeaknessRadar.js';
import ThemeManager from './theme/ThemeManager.js';
import AuthModal from './components/AuthModal.js';

console.log('점자 마스터 2024 - 시작');

// 엔진 초기화
const translator = new BrailleTranslator();
const validator = new BrailleValidator(translator);
const themeManager = new ThemeManager();

// 전역 객체로 등록
window.translator = translator;
window.validator = validator;
window.utils = BrailleUtils;
window.themeManager = themeManager;

console.log('✅ 엔진 로드 완료');

// 현재 모드
let currentMode = 'home';
let studyMode = null;

// 홈 화면 렌더링
function renderHome() {
  currentMode = 'home';
  document.querySelector('#app').innerHTML = `
    <div class="container">
      <!-- 다크 모드 토글 버튼 -->
      <button class="theme-toggle" id="theme-toggle" title="다크 모드 토글">
        <span class="theme-icon">${themeManager.isDarkMode() ? '☀️' : '🌙'}</span>
      </button>

      <!-- 헤더 -->
      <div class="home-header">
        <div class="header-icon">📚</div>
        <h1 class="header-title">
          <span class="gradient-text">점자 마스터 2024</span>
        </h1>
        <p class="header-subtitle">특수교육 임용 핵심 규정판</p>
        <div class="badge badge-success">2024.3.1 시행 규정</div>
      </div>

      <!-- 기능 카드 그리드 -->
      <div class="feature-grid">
        <div class="feature-card" id="card-study">
          <div class="feature-icon">📖</div>
          <h3 class="feature-title">학습 모드</h3>
          <p class="feature-desc">제1항~제49항 중 핵심 조항 선별 학습</p>
          <div class="feature-footer">
            <span class="badge badge-primary">22개 조항</span>
          </div>
        </div>

        <div class="feature-card" id="card-reading">
          <div class="feature-icon">👁️</div>
          <h3 class="feature-title">읽기 퀴즈</h3>
          <p class="feature-desc">점자를 한글로 읽기 연습</p>
          <div class="feature-footer">
            <span class="badge badge-primary">579문항</span>
          </div>
        </div>

        <div class="feature-card" id="card-writing">
          <div class="feature-icon">✍️</div>
          <h3 class="feature-title">쓰기 퀴즈</h3>
          <p class="feature-desc">6점 점자판으로 쓰기 연습</p>
          <div class="feature-footer">
            <span class="badge badge-primary">378문항</span>
          </div>
        </div>

        <div class="feature-card" id="card-radar">
          <div class="feature-icon">📊</div>
          <h3 class="feature-title">약점 분석</h3>
          <p class="feature-desc">카테고리별 정답률 시각화</p>
          <div class="feature-footer">
            <span class="badge badge-success">Chart.js</span>
          </div>
        </div>
      </div>
    </div>

    <style>
      .theme-toggle {
        position: fixed;
        top: 2rem;
        right: 2rem;
        width: 3.5rem;
        height: 3.5rem;
        border-radius: 50%;
        background: var(--bg-card);
        border: 2px solid var(--border-color);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: var(--shadow-md);
      }

      .theme-toggle:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
      }

      .theme-icon {
        animation: rotate-in 0.3s ease;
      }

      @keyframes rotate-in {
        from { transform: rotate(-180deg); opacity: 0; }
        to { transform: rotate(0); opacity: 1; }
      }

      .home-header {
        text-align: center;
        margin-bottom: var(--spacing-2xl);
      }

      .header-icon {
        font-size: 4rem;
        margin-bottom: var(--spacing-md);
        animation: float 3s ease-in-out infinite;
      }

      @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }

      .header-title {
        font-size: 3rem;
        font-weight: 800;
        margin-bottom: var(--spacing-sm);
      }

      .header-subtitle {
        font-size: 1.25rem;
        color: var(--text-secondary);
        margin-bottom: var(--spacing-lg);
      }

      .feature-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: var(--spacing-xl);
        margin-top: var(--spacing-2xl);
      }

      .feature-card {
        background: var(--card-bg);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-2xl);
        padding: var(--spacing-2xl);
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: var(--shadow-sm);
      }

      .feature-card:hover {
        transform: translateY(-8px);
        box-shadow: var(--shadow-xl);
        border-color: var(--accent-primary);
      }

      .feature-icon {
        font-size: 3rem;
        margin-bottom: var(--spacing-lg);
      }

      .feature-title {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--text-primary);
        margin-bottom: var(--spacing-sm);
      }

      .feature-desc {
        color: var(--text-secondary);
        margin-bottom: var(--spacing-lg);
        font-size: 1rem;
      }

      .feature-footer {
        display: flex;
        justify-content: flex-start;
        gap: var(--spacing-sm);
      }

      @media (max-width: 768px) {
        .feature-grid {
          grid-template-columns: 1fr;
        }

        .header-title {
          font-size: 2rem;
        }
      }
    </style>
  `;

  // 카드 클릭 이벤트
  document.getElementById('card-study').addEventListener('click', renderStudyMode);
  document.getElementById('card-reading').addEventListener('click', renderReadingQuiz);
  document.getElementById('card-writing').addEventListener('click', renderWritingQuiz);
  document.getElementById('card-radar').addEventListener('click', renderWeaknessRadar);

  // 테마 토글 버튼 이벤트
  const themeToggleBtn = document.getElementById('theme-toggle');
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      themeManager.toggleTheme();
      const icon = themeToggleBtn.querySelector('.theme-icon');
      icon.textContent = themeManager.isDarkMode() ? '☀️' : '🌙';
    });
  }
}

// 학습 모드 렌더링
function renderStudyMode() {
  currentMode = 'study';
  document.querySelector('#app').innerHTML = '<div id="study-container"></div>';
  studyMode = new StudyMode('study-container');
}

// 읽기 퀴즈 렌더링
function renderReadingQuiz() {
  currentMode = 'reading';
  document.querySelector('#app').innerHTML = '<div id="reading-container"></div>';
  new ReadingQuiz('reading-container');
}

// 쓰기 퀴즈 렌더링
function renderWritingQuiz() {
  currentMode = 'writing';
  document.querySelector('#app').innerHTML = '<div id="writing-container"></div>';
  new WritingQuiz('writing-container');
}

// 약점 분석 렌더링
function renderWeaknessRadar() {
  currentMode = 'radar';
  document.querySelector('#app').innerHTML = '<div id="radar-container"></div>';
  new WeaknessRadar('radar-container');
}

// 인증 모달 초기화
const authModal = new AuthModal('#app', () => {
  // 인증 성공 시 메인 앱 렌더링
  renderHome();
});

// 앱 시작
authModal.init();
