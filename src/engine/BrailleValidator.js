/**
 * BrailleValidator.js
 * 
 * 점자 검증 엔진
 * 규정 준수 여부 확인 및 오류 메시지 생성
 */

class BrailleValidator {
    constructor(translator) {
        this.translator = translator;
    }

    /**
     * 점역 결과 검증
     * @param {string} original - 원본 텍스트
     * @param {Array} brailleDots - 변환된 점자 dots 배열
     * @returns {Object} {valid: boolean, errors: [], relatedClause: string}
     */
    validate(original, brailleDots) {
        const errors = [];

        // 기본 검증: translator로 재변환하여 일치 여부 확인
        const expectedDots = this.translator.translateToBraille(original);

        if (JSON.stringify(expectedDots) !== JSON.stringify(brailleDots)) {
            errors.push({
                type: 'MISMATCH',
                message: '변환 결과가 규정과 일치하지 않습니다',
                expected: expectedDots,
                actual: brailleDots
            });
        }

        return {
            valid: errors.length === 0,
            errors: errors,
            relatedClause: this.identifyClause(brailleDots)
        };
    }

    /**
     * 정답과 사용자 답안 비교
     * @param {Array} correctDots - 정답 dots 배열
     * @param {Array} userDots - 사용자 입력 dots 배열
     * @returns {Object} 검증 결과 및 피드백
     */
    compareAnswers(correctDots, userDots) {
        const isCorrect = this.deepCompare(correctDots, userDots);

        if (!isCorrect) {
            const differences = this.findDifferences(correctDots, userDots);
            const relatedClause = this.identifyClause(correctDots);

            return {
                isCorrect: false,
                correctDots,
                userDots,
                differences,
                feedback: this.generateFeedback(differences, relatedClause),
                relatedClause
            };
        }

        return {
            isCorrect: true,
            correctDots,
            userDots,
            feedback: '정답입니다! 🎉'
        };
    }

    /**
     * 깊은 비교 (배열의 배열)
     */
    deepCompare(arr1, arr2) {
        if (arr1.length !== arr2.length) return false;

        for (let i = 0; i < arr1.length; i++) {
            const dots1 = Array.isArray(arr1[i]) ? arr1[i].sort() : [arr1[i]];
            const dots2 = Array.isArray(arr2[i]) ? arr2[i].sort() : [arr2[i]];

            if (JSON.stringify(dots1) !== JSON.stringify(dots2)) {
                return false;
            }
        }

        return true;
    }

    /**
     * 차이점 찾기
     */
    findDifferences(correctDots, userDots) {
        const diffs = [];
        const maxLen = Math.max(correctDots.length, userDots.length);

        for (let i = 0; i < maxLen; i++) {
            const correct = correctDots[i];
            const user = userDots[i];

            if (JSON.stringify(correct) !== JSON.stringify(user)) {
                diffs.push({
                    position: i,
                    correct: correct || null,
                    user: user || null
                });
            }
        }

        return diffs;
    }

    /**
     * 피드백 생성
     */
    generateFeedback(differences, clause) {
        if (differences.length === 0) {
            return '정답입니다!';
        }

        const diffCount = differences.length;
        let feedback = `${diffCount}개의 점형이 다릅니다. `;

        if (clause) {
            feedback += `${clause} 규정을 다시 확인해보세요.`;
        }

        return feedback;
    }

    /**
     * 조항 식별 (휴리스틱)
     */
    identifyClause(brailleDots) {
        if (!brailleDots || brailleDots.length === 0) {
            return null;
        }

        // 단순 휴리스틱: 첫 번째 점형으로 추측
        const firstDots = brailleDots[0];
        const dotsStr = JSON.stringify(firstDots);

        // 수표
        if (dotsStr === JSON.stringify([3, 4, 5, 6])) {
            return '제40항';
        }

        // 된소리표
        if (dotsStr === JSON.stringify([6])) {
            return '제2항';
        }

        // 기본 조항 (제1항, 제6항)
        return '제1항~제7항';
    }

    /**
     * 조항 번호로 관련 규정 가져오기
     * @param {string} clauseNumber - 조항 번호 (예: "제1항")
     * @returns {Object} 조항 정보
     */
    getClauseInfo(clauseNumber) {
        // StudyMode의 rulesData 참조
        // 실제 구현에서는 별도 데이터 소스 필요
        const rulesMap = {
            '제1항': {
                number: '제1항',
                title: '첫소리로 쓰인 자음자',
                description: '기본 자음자 14개가 첫소리로 쓰일 때에는 규정된 점형으로 적는다.'
            },
            '제2항': {
                number: '제2항',
                title: '된소리',
                description: '된소리 글자가 첫소리로 쓰일 때에는 된소리표 6점을 앞에 적는다.'
            },
            '제13항': {
                number: '제13항',
                title: '가~하 약자',
                description: '특정 글자들은 약자를 사용하여 적는다.'
            },
            '제40항': {
                number: '제40항',
                title: '숫자',
                description: '숫자는 수표를 앞세워 적는다.'
            }
        };

        return rulesMap[clauseNumber] || {
            number: clauseNumber,
            title: '규정 정보 없음',
            description: ''
        };
    }
}

export default BrailleValidator;
