/**
 * ReadingQuiz.js
 * 
 * F02: 읽기 퀴즈 (점자 → 한글)
 * - 난이도 선택 (기초/기본/어려움)
 * - 문제 수 선택 (3/5/7/10개)
 * - 점형 렌더링
 * - 답안 검증 및 상세 피드백
 */

import BrailleUtils from '../engine/BrailleUtils.js';
import BrailleTranslator from '../engine/BrailleTranslator.js';
import QuizEngine from '../quiz/QuizEngine.js';

class ReadingQuiz {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      throw new Error(`컨테이너를 찾을 수 없습니다: ${containerId}`);
    }

    this.quizEngine = new QuizEngine();
    this.translator = new BrailleTranslator();
    this.session = null;
    this.currentQuestion = null;

    this.init();
  }

  init() {
    this.renderSetup();
  }

  renderSetup() {
    this.container.innerHTML = `
      <div class="reading-quiz">
        <nav class="quiz-nav">
          <button class="nav-home-btn" onclick="window.location.reload()">🏠 홈으로</button>
        </nav>

        <div class="quiz-header">
          <h2><span class="emoji">👁️</span> 읽기 퀴즈</h2>
          <p class="quiz-subtitle">점자 → 한글</p>
        </div>

        <div class="quiz-setup">
          <div class="setup-section">
            <h3>난이도 선택</h3>
            <div class="difficulty-buttons">
              <button class="difficulty-btn" data-level="basic">기초</button>
              <button class="difficulty-btn" data-level="standard">기본</button>
              <button class="difficulty-btn active" data-level="advanced">어려움</button>
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

    // 한글을 점자로 변환
    const word = this.currentQuestion.question;
    const brailleCells = this.renderBrailleCells(word);

    this.container.innerHTML = `
      <div class="reading-quiz">
        <div class="quiz-nav">
          <button class="nav-home-btn">🏠 홈으로</button>
        </div>
        <div class="quiz-header">
          <h2>👁️ 읽기 퀴즈</h2>
          <p class="quiz-progress">${this.session.currentIndex + 1} / ${this.session.questions.length}</p>
        </div>

        <div class="question-container">
          <p class="instruction">다음 점자를 읽고 한글로 입력하세요</p>
          
          <div class="braille-display">
            ${brailleCells}
          </div>

          <div class="answer-input">
            <input type="text" id="answer-input" placeholder="답을 입력하세요" />
            <button class="submit-btn">제출</button>
          </div>
        </div>
      </div>

      ${this.getStyles()}
    `;

    this.attachQuestionListeners();
  }

  /**
   * 한글을 점자 셀로 렌더링 (카드형)
   */
  renderBrailleCells(text) {
    // BrailleTranslator를 사용하여 텍스트를 점자로 변환
    const dotsArray = this.translator.translateToBraille(text);

    // 디버깅 로그
    console.log('Rendering Braille for text:', text);
    console.log('Dots array:', dotsArray);

    // dotsArray가 유효하지 않은 경우
    if (!dotsArray || !Array.isArray(dotsArray) || dotsArray.length === 0) {
      console.error('Invalid dots array:', dotsArray);
      return `
        <div class="braille-cells-container">
          <p style="color: red;">점자 변환 오류</p>
        </div>
      `;
    }

    return `
      <div class="braille-cells-container">
        ${dotsArray.map(dots => this.renderBrailleCard(dots)).join('')}
      </div>
    `;
  }

  /**
   * 개별 점자 카드 렌더링
   */
  renderBrailleCard(dots) {
    // dots가 유효하지 않은 경우
    if (!Array.isArray(dots)) {
      console.error('Invalid dots:', dots);
      dots = [];
    }

    // 2x3 그리드로 점 배치
    // 점 번호: 1-4
    //         2-5
    //         3-6
    const grid = [
      [1, 4],
      [2, 5],
      [3, 6]
    ];

    return `
      <div class="braille-card">
        <div class="braille-grid">
          ${grid.map(row =>
      row.map(dotNum => {
        const isActive = dots.includes(dotNum);
        return `<div class="dot ${isActive ? 'active' : ''}"></div>`;
      }).join('')
    ).join('')}
        </div>
      </div>
    `;
  }



  attachQuestionListeners() {
    const submitBtn = this.container.querySelector('.submit-btn');
    const answerInput = this.container.querySelector('#answer-input');
    const homeBtn = this.container.querySelector('.nav-home-btn');

    submitBtn.addEventListener('click', () => {
      const userAnswer = answerInput.value.trim();
      this.checkAnswer(userAnswer);
    });

    answerInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const userAnswer = answerInput.value.trim();
        this.checkAnswer(userAnswer);
      }
    });

    homeBtn.addEventListener('click', () => {
      window.location.reload();
    });
    answerInput.focus();
  }

  checkAnswer(userAnswer) {
    const correctAnswer = this.currentQuestion.answer;
    const isCorrect = userAnswer === correctAnswer;

    this.session.answers.push({
      question: this.currentQuestion,
      userAnswer,
      isCorrect
    });

    if (isCorrect) {
      this.session.correctCount++;
    }

    this.showFeedback(isCorrect, userAnswer, correctAnswer);
  }

  showFeedback(isCorrect, userAnswer, correctAnswer) {
    const feedbackHtml = `
      <div class="feedback-overlay">
        <div class="feedback-card ${isCorrect ? 'correct' : 'incorrect'}">
          <div class="feedback-header">
            <span class="feedback-icon">${isCorrect ? '✅' : '❌'}</span>
            <h3 class="feedback-title">${isCorrect ? '정답입니다!' : '오답입니다'}</h3>
          </div>
          
          ${!isCorrect ? `
            <div class="feedback-body">
              <div class="feedback-item">
                <span class="item-label">정답</span>
                <span class="item-value correct-answer">${correctAnswer}</span>
              </div>
              <div class="feedback-item">
                <span class="item-label">입력한 답</span>
                <span class="item-value user-answer">${userAnswer}</span>
              </div>
              <div class="feedback-hint">
                <span class="hint-icon">💡</span>
                <div class="hint-content">
                  <strong>관련 조항</strong>
                  <p>${this.currentQuestion.clause} - ${this.currentQuestion.hint}</p>
                </div>
              </div>
            </div>
          ` : ''}

          <button class="next-btn">다음 문제</button>
        </div>
      </div>
    `;

    const overlay = document.createElement('div');
    overlay.innerHTML = feedbackHtml;
    this.container.appendChild(overlay.firstElementChild);

    this.container.querySelector('.next-btn').addEventListener('click', () => {
      this.session.currentIndex++;
      this.container.querySelector('.feedback-overlay').remove();
      this.renderQuestion();
    });
  }

  renderResults() {
    this.session.endTime = Date.now();
    const duration = Math.floor((this.session.endTime - this.session.startTime) / 1000);
    const accuracy = Math.round((this.session.correctCount / this.session.questions.length) * 100);

    this.container.innerHTML = `
      <div class="reading-quiz">
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
        .reading-quiz {
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
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          color: #334155;
          cursor: pointer;
          transition: all 0.2s;
          font-weight: 500;
          text-align: center;
        }

        .difficulty-btn:hover, .count-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .difficulty-btn.active, .count-btn.active {
          background: linear-gradient(145deg, #6366f1, #8b5cf6);
          border-color: #6366f1;
          color: white;
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

        .instruction {
          text-align: center;
          color: #334155;
          margin-bottom: 2rem;
          font-size: 1.1rem;
        }

        .braille-display {
          background: rgba(255, 255, 255, 0.4);
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 2rem;
          min-height: 150px;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .braille-cells-container {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          justify-content: center;
          max-width: 1200px;
          margin: 0 auto;
        }

        .braille-card {
          background: white;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          padding: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          transition: all 0.2s;
        }

        .braille-card:hover {
          border-color: #10b981;
          box-shadow: 0 4px 6px rgba(16, 185, 129, 0.2);
        }

        .braille-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          grid-template-rows: repeat(3, 1fr);
          gap: 6px;
          width: 34px;
          height: 51px;
        }

        .braille-grid .dot {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          transition: all 0.2s;
        }

        .braille-grid .dot.active {
          background: #10b981;
          box-shadow: 0 0 8px rgba(16, 185, 129, 0.5);
        }

        .braille-grid .dot:not(.active) {
          border: 2px solid #e2e8f0;
          background: transparent;
        }
        .answer-input {
          display: flex;
          gap: 1rem;
        }

        #answer-input {
          flex: 1;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.6);
          border: 1px solid rgba(163, 177, 198, 0.3);
          border-radius: 8px;
          color: #1e293b;
          font-size: 1.1rem;
        }

        #answer-input:focus {
          outline: none;
          border-color: var(--primary-color);
        }

        .submit-btn {
          padding: 1rem 2.5rem;
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

        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
        }

        .submit-btn:active {
          transform: translateY(0);
        }

        .feedback-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.2s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .feedback-card {
          background: white;
          border-radius: 16px;
          padding: 2rem;
          max-width: 500px;
          width: 90%;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          animation: slideUp 0.3s ease-out;
        }

        @keyframes slideUp {
          from {
            transform: translateY(30px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .feedback-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .feedback-icon {
          font-size: 2.5rem;
        }

        .feedback-title {
          font-size: 1.5rem;
          margin: 0;
          color: #1e293b;
        }

        .feedback-card.correct .feedback-title {
          color: #10b981;
        }

        .feedback-card.incorrect .feedback-title {
          color: #ef4444;
        }

        .feedback-body {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .feedback-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background: #f8fafc;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
        }

        .item-label {
          font-weight: 600;
          color: #64748b;
          font-size: 0.9rem;
        }

        .item-value {
          font-weight: 600;
          font-size: 1.1rem;
        }

        .correct-answer {
          color: #10b981;
        }

        .user-answer {
          color: #ef4444;
        }

        .feedback-hint {
          display: flex;
          gap: 1rem;
          padding: 1rem;
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          border-radius: 8px;
          border: 2px solid #fbbf24;
        }

        .hint-icon {
          font-size: 1.5rem;
        }

        .hint-content {
          flex: 1;
        }

        .hint-content strong {
          display: block;
          color: #92400e;
          margin-bottom: 0.5rem;
        }

        .hint-content p {
          margin: 0;
          color: #78350f;
          line-height: 1.5;
        }

        .next-btn {
          width: 100%;
          padding: 1rem;
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

        .next-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
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

export default ReadingQuiz;
