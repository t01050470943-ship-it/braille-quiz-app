/**
 * QuizEngine.js
 * 
 * 퀴즈 데이터 로드 및 세션 관리
 */

class QuizEngine {
    constructor() {
        this.quizzes = {
            basic: null,
            standard: null,
            advanced: null
        };
    }

    /**
     * 퀴즈 데이터 로드
     * @param {string} difficulty - 난이도 ('basic', 'standard', 'advanced')
     * @returns {Promise<Array>} 퀴즈 문제 배열
     */
    async loadQuiz(difficulty) {
        if (this.quizzes[difficulty]) {
            return this.quizzes[difficulty];
        }

        try {
            const response = await fetch(`/data/quiz-bank-${difficulty}.json`);
            const data = await response.json();
            this.quizzes[difficulty] = data.reading || [];
            return this.quizzes[difficulty];
        } catch (error) {
            console.error('퀴즈 로드 실패:', error);
            return [];
        }
    }

    /**
     * 랜덤 문제 선택
     * @param {Array} questions - 전체 문제 배열
     * @param {number} count - 선택할 문제 수
     * @returns {Array} 선택된 문제 배열
     */
    selectRandomQuestions(questions, count) {
        const shuffled = [...questions].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, count);
    }

    /**
     * 세션 데이터 생성
     * @param {Array} questions - 문제 배열
     * @returns {Object} 세션 데이터
     */
    createSession(questions) {
        return {
            questions,
            currentIndex: 0,
            answers: [],
            correctCount: 0,
            startTime: Date.now(),
            endTime: null
        };
    }
}

export default QuizEngine;
