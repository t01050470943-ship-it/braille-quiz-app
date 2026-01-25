/**
 * WritingQuiz.js
 * 
 * F03: 쓰기 퀴즈 (한글 → 점자)
 * - 난이도 선택
 * - 문제 수 선택 (3/5/7/10개)
 * - DotInputPad 통합
 * - 답안 검증 및 피드백
 */

import DotInputPad from './DotInputPad.js';
import QuizEngine from '../quiz/QuizEngine.js';
import BrailleUtils from '../engine/BrailleUtils.js';
import BrailleTranslator from '../engine/BrailleTranslator.js';
import BrailleValidator from '../engine/BrailleValidator.js';

class WritingQuiz {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      throw new Error(`컨테이너를 찾을 수 없습니다: ${containerId}`);
    }

    this.quizEngine = new QuizEngine();
    this.translator = new BrailleTranslator();
    this.validator = new BrailleValidator(this.translator);
    this.session = null;
    this.currentQuestion = null;
    this.dotInputPad = null;

    this.init();
  }

  init() {
    this.renderSetup();
  }

  renderSetup() {
    this.container.innerHTML = `
      <div class="writing-quiz">
        <nav class="quiz-nav">
          <button class="nav-home-btn" onclick="window.location.reload()">🏠 홈으로</button>
        </nav>

        <div class="quiz-header">
          <h2><span class="emoji">✍️</span> 쓰기 퀴즈</h2>
          <p class="quiz-subtitle">한글 → 점자</p>
        </div>

        <div class="quiz-setup">
          <div class="setup-section">
            <h3>난이도 선택</h3>
            <div class="difficulty-buttons">
              <button class="difficulty-btn" data-level="basic">기초</button>
              <button class="difficulty-btn active" data-level="standard">기본</button>
              <button class="difficulty-btn" data-level="advanced">어려움</button>
            </div>
          </div>

          <div class="setup-section">
            <h3>문제 수</h3>
            <div class="count-buttons">
              <button class="count-btn" data-count="3">3개</button>
              <button class="count-btn active" data-count="5">5개</button>
              <button class="count-btn" data-count="7">7개</button>
              <button class="count-btn" data-count="10">10개</button>
            </div>
          </div>

          <button class="start-btn">퀴즈 시작</button>
        </div>
      </div>

      ${this.getStyles()}
    `;

    this.attachSetupListeners();
  }

  attachSetupListeners() {
    this.container.querySelectorAll('.difficulty-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.container.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
      });
    });

    this.container.querySelectorAll('.count-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.container.querySelectorAll('.count-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
      });
    });

    this.container.querySelector('.start-btn').addEventListener('click', () => {
      const difficulty = this.container.querySelector('.difficulty-btn.active').dataset.level;
      const count = parseInt(this.container.querySelector('.count-btn.active').dataset.count);
      this.startQuiz(difficulty, count);
    });
  }

  async startQuiz(difficulty, count) {
    const questions = await this.quizEngine.loadQuiz(difficulty);
    const selectedQuestions = this.quizEngine.selectRandomQuestions(questions, count);
    this.session = this.quizEngine.createSession(selectedQuestions);

    this.renderQuestion();
  }

  renderQuestion() {
    if (!this.session || this.session.currentIndex >= this.session.questions.length) {
      this.renderResults();
      return;
    }

    this.currentQuestion = this.session.questions[this.session.currentIndex];

    this.container.innerHTML = `
      <div class="writing-quiz">
        <div class="quiz-nav">
          <button class="nav-home-btn">🏠 홈으로</button>
        </div>
        <div class="quiz-header">
          <h2>✍️ 쓰기 퀴즈</h2>
          <p class="quiz-progress">${this.session.currentIndex + 1} / ${this.session.questions.length}</p>
        </div>

        <div class="question-container">
          <div class="word-display">
            <p class="instruction">다음 단어를 점자로 입력하세요</p>
            <h3 class="target-word">${this.currentQuestion.question}</h3>
            <div class="hint-container" id="hint-container">
              <div class="hint-toggle" id="hint-toggle">
                <span class="hint-icon">💡</span>
                <span class="hint-prompt">힌트!</span>
              </div>
              <p class="hint-text hidden" id="hint-text">💡 ${this.currentQuestion.hint}</p>
            </div>
          </div>

          <div id="dot-input-container"></div>
        </div>
      </div>

      ${this.getStyles()}
    `;

    // DotInputPad 초기화 - DOM 렌더링 완료 후
    setTimeout(() => {
      const container = document.getElementById('dot-input-container');
      if (container) {
        this.dotInputPad = new DotInputPad('dot-input-container', {
          maxCells: 10,
          onInputComplete: (cells) => this.checkAnswer(cells)
        });
      }

      // 홈 버튼 이벤트 리스너
      const homeBtn = this.container.querySelector('.nav-home-btn');
      if (homeBtn) {
        homeBtn.addEventListener('click', () => {
          window.location.reload();
        });
      }

      // 힌트 토글 이벤트 리스너
      const hintToggle = this.container.querySelector('#hint-toggle');
      const hintText = this.container.querySelector('#hint-text');
      if (hintToggle && hintText) {
        hintToggle.addEventListener('click', () => {
          hintText.classList.toggle('hidden');
          hintToggle.style.display = 'none';
        });
      }
    }, 100);
  }

  checkAnswer(userDots) {
    // 1. 정답 생성: 문제의 answer를 점자로 변환
    const answerText = this.currentQuestion.answer || this.currentQuestion.question;
    const correctDots = this.translator.translateToBraille(answerText);

    // 2. BrailleValidator로 검증
    const validation = this.validator.compareAnswers(correctDots, userDots);

    // 3. 세션에 저장
    this.session.answers.push({
      question: this.currentQuestion,
      userDots,
      correctDots: validation.correctDots,
      isCorrect: validation.isCorrect,
      feedback: validation.feedback,
      clause: validation.relatedClause || this.currentQuestion.clause
    });

    if (validation.isCorrect) {
      this.session.correctCount++;
    }

    this.showFeedback(validation);
  }

  showFeedback(validation) {
    const { isCorrect, userDots, correctDots, feedback, clause } = validation;
    const feedbackHtml = `
      <div class="feedback-modal">
        <div class="feedback-content">
          <h3 class="${isCorrect ? 'correct' : 'incorrect'}">
            ${isCorrect ? '✅ 정답입니다!' : '❌ 오답입니다'}
          </h3>
          
          <div class="feedback-details">
            <p><strong>문제:</strong> ${this.currentQuestion.question}</p>
            
            <div class="dots-comparison">
              <div class="dots-section">
                <strong>입력한 점자:</strong>
                <div class="dots-display">
                  ${this.renderDotsPreview(userDots)}
                </div>
              </div>
              
              ${!isCorrect ? `
                <div class="dots-section">
                  <strong>정답 점자:</strong>
                  <div class="dots-display">
                    ${this.renderDotsPreview(correctDots)}
                  </div>
                </div>
              ` : ''}
            </div>
            
            ${!isCorrect ? `
              <div class="clause-info">
                <strong>📚 피드백:</strong> ${feedback}
                <br><strong>관련 조항:</strong> ${clause || this.currentQuestion.clause} - ${this.currentQuestion.hint}
              </div>
            ` : ''}
          </div>

          <button class="next-btn">다음 문제</button>
        </div>
      </div>
    `;

    const modal = document.createElement('div');
    modal.innerHTML = feedbackHtml;
    this.container.appendChild(modal.firstElementChild);

    this.container.querySelector('.next-btn').addEventListener('click', () => {
      this.session.currentIndex++;
      this.container.querySelector('.feedback-modal').remove();
      this.renderQuestion();
    });
  }

  renderDotsPreview(dotsCells) {
    if (dotsCells.length === 0) {
      return '<p style="color: #334155;">입력 없음</p>';
    }

    return dotsCells.map(dots => {
      const grid = BrailleUtils.dotsToGrid(dots);
      return `
        <div class="mini-braille-cell">
          ${grid.map(row => row.map(isActive =>
        `<div class="mini-dot ${isActive ? 'active' : 'inactive'}"></div>`
      ).join('')).join('')}
        </div>
      `;
    }).join('');
  }

  renderResults() {
    this.session.endTime = Date.now();
    const duration = Math.floor((this.session.endTime - this.session.startTime) / 1000);
    const accuracy = Math.round((this.session.correctCount / this.session.questions.length) * 100);

    this.container.innerHTML = `
      <div class="writing-quiz">
        <nav class="quiz-nav">
          <button class="nav-home-btn">🏠 홈으로</button>
        </nav>

        <div class="quiz-header">
          <h2><span class="emoji">🎉</span> 퀴즈 완료!</h2>
        </div>

        <div class="results-container">
          <div class="result-stat">
            <div class="stat-value">${this.session.correctCount} / ${this.session.questions.length}</div>
            <div class="stat-label">정답 수</div>
          </div>

          <div class="result-stat">
            <div class="stat-value">${accuracy}%</div>
            <div class="stat-label">정답률</div>
          </div>

          <div class="result-stat">
            <div class="stat-value">${duration}초</div>
            <div class="stat-label">소요 시간</div>
          </div>

          <div class="result-actions">
            <button class="retry-btn">다시 풀기</button>
          </div>
        </div>
      </div>

      ${this.getStyles()}
    `;

    this.container.querySelector('.retry-btn').addEventListener('click', () => {
      this.renderSetup();
    });

    this.container.querySelector('.nav-home-btn').addEventListener('click', () => {
      window.location.reload();
    });
  }

  getStyles() {
    return `
      <style>
        .writing-quiz {
          max-width: 900px;
          margin: 0 auto;
          padding: 2rem;
        }

        .quiz-nav {
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

        .quiz-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .quiz-header h2 {
          font-size: 2rem;
          margin-bottom: 0.5rem;
          color: #0f172a;
        }

        .quiz-header h2 .emoji {
          color: #0f172a;
        }

        .quiz-subtitle, .quiz-progress {
          color: #334155;
        }

        .quiz-setup {
          background: rgba(255, 255, 255, 0.6);
          border-radius: 12px;
          padding: 2rem;
          border: 1px solid rgba(163, 177, 198, 0.3);
        }

        .setup-section {
          margin-bottom: 2rem;
        }

        .setup-section h3 {
          color: #0f172a;
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .difficulty-buttons, .count-buttons {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .difficulty-btn, .count-btn {
          padding: 0.75rem 1.5rem;
          background: #ffffff;
          border: 1px solid rgba(163, 177, 198, 0.3);
          border-radius: 8px;
          color: #334155;
          cursor: pointer;
          transition: all 0.2s;
          font-weight: 500;
          text-align: center;
        }

        .difficulty-btn.active, .count-btn.active {
          background: linear-gradient(145deg, #6366f1, #8b5cf6);
          border-color: #6366f1;
          color: white;
        }

        .difficulty-btn:hover, .count-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .start-btn {
          width: 100%;
          padding: 1rem;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          border: none;
          border-radius: 10px;
          color: white;
          font-size: 1.1rem;
          font-weight: 600;
          text-align: center;
          cursor: pointer;
          margin-top: 1.5rem;
          transition: all 0.2s;
          box-shadow: 0 4px 6px -1px rgba(99, 102, 241, 0.2);
        }

        .start-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.3);
        }

        .start-btn:active {
          transform: translateY(0);
        }

        .question-container {
          background: rgba(255, 255, 255, 0.6);
          border-radius: 12px;
          padding: 2rem;
          border: 1px solid rgba(163, 177, 198, 0.3);
        }

        .word-display {
          text-align: center;
          margin-bottom: 2rem;
          padding: 2rem;
          background: rgba(255, 255, 255, 0.5);
          border-radius: 12px;
        }

        .instruction {
          color: #334155;
          margin-bottom: 1rem;
        }

        .target-word {
          font-size: 3rem;
          color: #6ee7b7;
          margin-bottom: 1rem;
        }

        .hint-container {
          margin-top: 1.5rem;
        }

        .hint-toggle {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.4rem 0.8rem;
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 2px 6px rgba(251, 191, 36, 0.25);
          font-size: 0.85rem;
        }

        .hint-toggle:hover {
          transform: translateY(-1px);
          box-shadow: 0 3px 8px rgba(251, 191, 36, 0.35);
        }

        .hint-toggle:active {
          transform: translateY(0);
        }

        .hint-icon {
          font-size: 1rem;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }

        .hint-prompt {
          color: #78350f;
          font-weight: 600;
          font-size: 0.8rem;
        }

        .hint-text {
          margin-top: 1rem;
          padding: 1rem 1.5rem;
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          border-left: 4px solid #f59e0b;
          border-radius: 8px;
          color: #78350f;
          font-size: 0.95rem;
          font-weight: 500;
          line-height: 1.6;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
        }

        .hint-text.hidden {
          display: none;
        }

        .feedback-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          backdrop-filter: blur(4px);
        }

        .feedback-content {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 2.5rem;
          max-width: 600px;
          width: 90%;
          max-height: 80vh;
          overflow-y: auto;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        .feedback-content h3 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
        }

        .feedback-content h3.correct {
          color: #10b981;
        }

        .feedback-content h3.incorrect {
          color: #ef4444;
        }

        .feedback-details {
          color: #0f172a;
        }

        .feedback-details p {
          color: #334155;
          font-size: 1rem;
          margin-bottom: 1rem;
        }

        .feedback-details strong {
          color: #0f172a;
          font-weight: 600;
        }

        .dots-comparison {
          margin: 1.5rem 0;
        }

        .dots-section {
          margin-bottom: 1.5rem;
        }

        .dots-section strong {
          color: #0f172a;
          font-size: 0.95rem;
          display: block;
          margin-bottom: 0.5rem;
        }

        .dots-display {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          margin-top: 0.5rem;
          padding: 1.25rem;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
        }

        .mini-braille-cell {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          grid-template-rows: repeat(3, 1fr);
          gap: 4px;
          width: 40px;
          height: 60px;
          padding: 8px;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
        }

        .mini-dot {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }

        .mini-dot.active {
          background: #6366f1;
        }

        .mini-dot.inactive {
          border: 2px solid #e2e8f0;
          background: transparent;
        }

        .clause-info {
          margin-top: 1.5rem;
          padding: 1.25rem;
          background: #fef3c7;
          border: 1px solid #fbbf24;
          border-left: 4px solid #f59e0b;
          border-radius: 8px;
          color: #78350f;
          line-height: 1.6;
        }

        .clause-info strong {
          color: #78350f;
          font-weight: 600;
        }

        .next-btn {
          width: 100%;
          padding: 1rem 1.5rem;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          border: none;
          border-radius: 10px;
          color: white;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          margin-top: 1.5rem;
          transition: all 0.2s;
          box-shadow: 0 4px 6px -1px rgba(99, 102, 241, 0.2);
        }

        .next-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.3);
        }

        .next-btn:active {
          transform: translateY(0);
        }

        .results-container {
          background: rgba(255, 255, 255, 0.8);
          border-radius: 16px;
          padding: 3rem 2rem;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }

        .result-stat {
          text-align: center;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          background: white;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .stat-value {
          font-size: 3rem;
          font-weight: 800;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 0.5rem;
        }

        .stat-label {
          color: #64748b;
          font-size: 1rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .result-actions {
          display: flex;
          gap: 1rem;
          margin-top: 2rem;
        }

        .retry-btn {
          flex: 1;
          padding: 1.2rem;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          border: none;
          border-radius: 12px;
          color: white;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
        }

        .retry-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
        }

        .retry-btn:active {
          transform: translateY(0);
        }
      </style>
    `;
  }
}

export default WritingQuiz;
