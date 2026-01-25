/**
 * BrailleTranslator.js
 * 
 * 2024 개정 한국 점자 규정 기반 점역 엔진
 * 참조: [024_Braille_Standard].md
 * 
 * 한글 ↔ 점자 양방향 변환
 */

class BrailleTranslator {
    constructor() {
        // 제1항: 첫소리로 쓰인 자음자 (초성)
        this.initialConsonants = {
            'ㄱ': [4],
            'ㄴ': [1, 4],
            'ㄷ': [2, 4, 5],
            'ㄹ': [5],
            'ㅁ': [1, 5],
            'ㅂ': [4, 5],
            'ㅅ': [2, 3, 4],
            'ㅇ': [],  // 표기 안 함
            '선택': [4, 6],
            'ㅊ': [5, 6],
            'ㅋ': [1, 2, 4],
            'ㅌ': [1, 2, 5],
            'ㅍ': [1, 4, 5],
            'ㅎ': [2, 4, 5]
        };

        // 제2항: 된소리 표기
        this.tenseMark = [6];  // 된소리표

        // 제3항: 받침으로 쓰인 자음자 (종성)
        this.finalConsonants = {
            'ㄱ': [1],
            'ㄴ': [2, 5],
            'ㄷ': [3, 5],
            'ㄹ': [2],
            'ㅁ': [2, 6],
            'ㅂ': [1, 2],
            'ㅅ': [3],
            'ㅇ': [2, 3, 5, 6],
            'ㅈ': [1, 3],
            'ㅊ': [2, 3],
            'ㅋ': [2, 3, 5],
            'ㅌ': [2, 3, 6],
            'ㅍ': [2, 5, 6],
            'ㅎ': [3, 5, 6]
        };

        // 제4항: 쌍받침
        this.twinFinals = {
            'ㄲ': [[1], [1]],
            'ㅆ': [3, 4]  // 약자
        };

        // 제5항: 겹받침
        this.clusterFinals = {
            'ㄳ': [[1], [3]],
            'ㄵ': [[2, 5], [1, 3]],
            'ㄺ': [[2], [1]],
            'ㄻ': [[2], [2, 6]],
            'ㄼ': [[2], [1, 2]]
        };

        // 제6항: 기본 모음자
        this.basicVowels = {
            'ㅏ': [1, 2, 6],
            'ㅑ': [3, 4, 5],
            'ㅓ': [2, 3, 4],
            'ㅕ': [1, 5, 6],
            'ㅗ': [1, 3, 6],
            'ㅛ': [3, 4, 6],
            'ㅜ': [1, 4, 6],
            'ㅠ': [1, 4, 5],
            'ㅡ': [2, 4, 6],
            'ㅣ': [1, 3, 5]
        };

        // 제7항: 복합 모음
        this.complexVowels = {
            'ㅐ': [1, 2, 3, 5],
            'ㅔ': [1, 3, 4, 5],
            'ㅚ': [1, 3, 4, 5, 6],
            'ㅘ': [[1, 3, 6], [1, 2, 6]],      // ㅗ+ㅏ
            'ㅙ': [[1, 3, 6], [1, 2, 3, 5]],  // ㅗ+ㅐ
            'ㅝ': [[1, 4, 6], [2, 3, 4]],      // ㅜ+ㅓ
            'ㅞ': [[1, 4, 6], [1, 2, 3, 5]],  // ㅜ+ㅔ
            'ㅟ': [[1, 4, 6], [1, 3, 5]],      // ㅜ+ㅣ
            'ㅢ': [2, 4, 5, 6]
        };

        // 제11항: 모음자 "예" 구분표
        this.yeSeparator = [3, 6];  // ⠖

        // 제12항: 모음자 "애" 구분표
        this.aeSeparator = [3, 4];  // ⠌

        // 제13항: 약자 (가~하)
        this.abbreviations = {
            '가': [1, 2, 4, 6],
            '나': [1, 4],
            '다': [2, 4],
            '마': [1, 5],
            '바': [4, 5],
            '사': [6],
            '자': [4, 6],
            '카': [1, 2, 4],
            '타': [1, 2, 5],
            '파': [1, 4, 5],
            '하': [2, 4, 5]
        };

        // 제15항: 약자 (억~것)
        this.abbreviations2 = {
            '억': [1, 4, 5, 6],
            '언': [2, 3, 4, 5, 6],
            '얼': [2, 3, 4, 5],
            '연': [1, 6],
            '열': [1, 2, 5, 6],
            '영': [1, 2, 4, 5, 6],
            '옥': [1, 3, 4, 6],
            '온': [1, 2, 3, 5, 6],
            '옹': [1, 2, 3, 4, 5, 6],
            '운': [1, 2, 4, 5],
            '울': [1, 2, 3, 4, 6],
            '은': [1, 3, 5, 6],
            '을': [2, 3, 4, 6],
            '인': [1, 2, 3, 5],
            '것': [[4, 5, 6], [2, 3, 4]]
        };

        // 제17항: 약자 (성~청)
        this.seongAbbreviations = {
            '성': [[2, 3, 4], [1, 2, 4, 5, 6]],      // ㅅ + 영
            '썽': [[6], [2, 3, 4], [1, 2, 4, 5, 6]], // ㅆ + 영
            '정': [[4, 6], [1, 2, 4, 5, 6]],         // ㅈ + 영
            '쩡': [[6], [4, 6], [1, 2, 4, 5, 6]],    // ㅉ + 영
            '청': [[5, 6], [1, 2, 4, 5, 6]]          // ㅊ + 영
        };

        // 제18항: 약어 (접속사)
        this.contractions = {
            '그래서': [[1], [2, 3, 4]],
            '그러나': [[1], [1, 4]],
            '그러면': [[1], [2, 5]],
            '그러므로': [[1], [2, 6]],
            '그런데': [[1], [1, 3, 4, 5]],
            '그리고': [[1], [1, 3, 6]],
            '그리하여': [[1], [1, 5, 6]]
        };

        // 제40항: 숫자 수표 및 숫자
        this.numberIndicator = [3, 4, 5, 6];  // ⠼
        this.numbers = {
            '1': [1],
            '2': [1, 2],
            '3': [1, 4],
            '4': [1, 4, 5],
            '5': [1, 5],
            '6': [1, 2, 4],
            '7': [1, 2, 4, 5],
            '8': [1, 2, 5],
            '9': [2, 4],
            '0': [2, 4, 5]
        };

        // 제49항: 문장 부호
        this.punctuation = {
            '.': [2, 5, 6],
            '?': [2, 3, 6],
            '!': [2, 3, 5],
            ',': [5],
            '·': [4, 5, 6],
            ':': [2, 5],
            '~': [[5], [3, 6]],
            '-': [3, 6]
        };

        // 로마자 표시자 (제29항)
        this.foreignWordIndicator = [3, 5, 6];
        this.foreignWordTerminator = [2, 5, 6];

        // 영어 알파벳 (제28항)
        this.englishLetters = {
            'a': [1], 'b': [1, 2], 'c': [1, 4], 'd': [1, 4, 5],
            'e': [1, 5], 'f': [1, 2, 4], 'g': [1, 2, 4, 5],
            'h': [1, 2, 5], 'i': [2, 4], 'j': [2, 4, 5],
            'k': [1, 3], 'l': [1, 2, 3], 'm': [1, 3, 4],
            'n': [1, 3, 4, 5], 'o': [1, 3, 5], 'p': [1, 2, 3, 4],
            'q': [1, 2, 3, 4, 5], 'r': [1, 2, 3, 5], 's': [2, 3, 4],
            't': [2, 3, 4, 5], 'u': [1, 3, 6], 'v': [1, 2, 3, 6],
            'w': [2, 4, 5, 6], 'x': [1, 3, 4, 6], 'y': [1, 3, 4, 5, 6],
            'z': [1, 3, 5, 6]
        };

        // 대문자 표시 (제29항)
        this.capitalIndicator = [6];
        this.capitalWordIndicator = [6, 6];
        this.capitalPassageIndicator = [6, 6, 6];
        this.capitalTerminator = [6, 3];
    }

    /**
     * 한글 텍스트를 점자로 변환
     * @param {string} text - 변환할 한글 텍스트
     * @returns {Array} 점자 dots 배열의 배열
     */
    translateToBraille(text) {
        const result = [];

        if (!text || text.length === 0) {
            return result;
        }

        // 대문자 구절 사전 분석 (제29항 - 3단어 이상 연속 대문자)
        const capitalPassages = [];
        const passagePattern = /[A-Z]+ [A-Z]+ [A-Z]+[A-Z ]*/g;
        let match;
        while ((match = passagePattern.exec(text)) !== null) {
            const words = match[0].trim().split(/\s+/);
            if (words.length >= 3 && words.every(w => /^[A-Z]+$/.test(w))) {
                capitalPassages.push({
                    start: match.index,
                    end: match.index + match[0].length,
                    text: match[0]
                });
            }
        }

        // 텍스트를 한 글자씩 처리
        for (let i = 0; i < text.length; i++) {
            const char = text[i];

            // 1. 공백 처리
            if (char === ' ') {
                continue; // 점자에서는 띄어쓰기를 별도 표시하지 않음
            }

            // 2. 숫자 처리 (제40항, 제41항, 제43항, 제44항)
            if (/[0-9]/.test(char)) {
                // 숫자 시작 시 수표 추가
                if (i === 0 || !/[0-9,]/.test(text[i - 1])) {
                    result.push(this.numberIndicator);
                }

                // 제41항: 자릿점 (쉼표) 처리
                if (char === ',') {
                    result.push([2]);  // 자릿점은 2점
                } else {
                    result.push(this.numbers[char]);
                }

                continue;
            }

            // 제41항: 숫자 사이의 쉼표(자릿점) 처리
            if (char === ',' && i > 0 && i < text.length - 1 &&
                /[0-9]/.test(text[i - 1]) && /[0-9]/.test(text[i + 1])) {
                result.push([2]);  // 자릿점 2점
                continue;
            }

            // 제43항: 특수 기호 뒤 수표 재사용
            // 가운뎃점(·), 쌍점(:), 붙임표(-), 물결표(~) 등은 punctuation에서 처리되므로
            // 여기서는 별도 처리 불필요 (다음 숫자에서 자동 수표 추가됨)

            // 3. 문장부호 처리 (제49항)
            if (this.punctuation[char]) {
                const dots = this.punctuation[char];
                if (Array.isArray(dots[0])) {
                    result.push(...dots);
                } else {
                    result.push(dots);
                }
                continue;
            }

            // 4. 영어 알파벳 처리 (제28항, 제29항)
            if (/[a-zA-Z]/.test(char)) {
                const lowerChar = char.toLowerCase();
                const isUpperCase = (char !== lowerChar);

                // 영어 단어 시작 시 처리
                if (i === 0 || !/[a-zA-Z]/.test(text[i - 1])) {
                    result.push(this.foreignWordIndicator);

                    // 대문자 구절 확인
                    const inPassage = capitalPassages.find(p => i >= p.start && i < p.end);
                    if (inPassage && i === inPassage.start) {
                        // 구절 시작: [6,6,6]
                        result.push(this.capitalPassageIndicator);
                    } else if (!inPassage) {
                        // 구절이 아닌 경우: 단어 전체 대문자 확인
                        const wordMatch = text.substring(i).match(/^[a-zA-Z]+/);
                        if (wordMatch) {
                            const word = wordMatch[0];
                            const upperCount = (word.match(/[A-Z]/g) || []).length;

                            // 단어 전체가 대문자 (2글자 이상)
                            if (upperCount === word.length && upperCount > 1) {
                                result.push(this.capitalWordIndicator);  // [6, 6]
                            }
                        }
                    }
                }

                // 개별 대문자 표시 (단어 전체 대문자나 구절이 아닌 경우만)
                if (isUpperCase) {
                    // 현재 위치가 속한 단어 확인
                    let wordStart = i;
                    while (wordStart > 0 && /[a-zA-Z]/.test(text[wordStart - 1])) {
                        wordStart--;
                    }
                    const wordMatch = text.substring(wordStart).match(/^[a-zA-Z]+/);
                    const word = wordMatch ? wordMatch[0] : char;
                    const upperCount = (word.match(/[A-Z]/g) || []).length;
                    const isWordAllCaps = (upperCount === word.length && upperCount > 1);

                    // 구절에 속하지 않고, 단어 전체 대문자도 아니면 개별 [6] 추가
                    const inPassage = capitalPassages.some(p => i >= p.start && i < p.end);
                    if (!isWordAllCaps && !inPassage) {
                        result.push(this.capitalIndicator);  // [6]
                    }
                }

                // 영어 알파벳 점자 변환
                if (this.englishLetters[lowerChar]) {
                    result.push(this.englishLetters[lowerChar]);
                } else {
                    console.warn('지원하지 않는 영어 문자:', char);
                }

                // 영어 단어 끝에 종료자 추가
                if (i === text.length - 1 || !/[a-zA-Z]/.test(text[i + 1])) {
                    result.push(this.foreignWordTerminator);

                    // 대문자 구절 종료 확인
                    const inPassage = capitalPassages.find(p => i >= p.start && i < p.end);
                    if (inPassage && i >= inPassage.end - 1) {
                        result.push(this.capitalTerminator);  // [6, 3]
                    }
                }

                continue;
            }

            // 5. 한글 처리
            if (/[가-힣]/.test(char)) {
                this.processKorean(char, text, i, result);
                continue;
            }

            // 6. 기타 문자는 무시 (또는 경고)
            console.warn('지원하지 않는 문자:', char);
        }

        return result;
    }

    /**
     * 한글 문자를 점자로 변환
     * @private
     */
    processKorean(char, text, index, result) {
        // 1. 약어 체크 (제18항: 접속사)
        for (const [word, dots] of Object.entries(this.contractions)) {
            if (text.substring(index, index + word.length) === word) {
                // 약어 앞에 다른 글자가 있으면 약어 사용 불가
                if (index > 0 && /[가-힣]/.test(text[index - 1])) {
                    break;
                }
                result.push(...dots);
                // 인덱스를 건너뛰어야 하지만, for 루프에서 처리 중이므로 플래그 반환
                return word.length - 1;
            }
        }

        // 2. 약자 체크 (제13항, 제15항)
        // 제13항: 가~하
        if (this.abbreviations[char]) {
            // 다음 글자가 모음이면 약자 사용 불가 (제14항)
            const nextChar = text[index + 1];
            if (nextChar && /[ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ]/.test(nextChar)) {
                // 약자 사용 불가, 일반 변환
            } else {
                result.push(this.abbreviations[char]);
                return 0;
            }
        }

        // 제15항: 억~것
        if (this.abbreviations2[char]) {
            const dots = this.abbreviations2[char];
            if (Array.isArray(dots[0])) {
                result.push(...dots);
            } else {
                result.push(dots);
            }
            return 0;
        }

        // 제17항: 성~청
        if (this.seongAbbreviations[char]) {
            result.push(...this.seongAbbreviations[char]);
            return 0;
        }

        // 3. 일반 자모 분해 및 변환
        const jamo = this.decompose(char);
        if (!jamo) {
            console.warn('자모 분해 실패:', char);
            return 0;
        }

        const { initial, medial, final } = jamo;

        // 3-1. 된소리 처리 (제2항)
        const tenseInitials = ['ㄲ', 'ㄸ', 'ㅃ', 'ㅆ', 'ㅉ'];
        if (tenseInitials.includes(initial)) {
            result.push(this.tenseMark); // 된소리표
            // 된소리의 기본 자음
            const baseConsonant = {
                'ㄲ': 'ㄱ', 'ㄸ': 'ㄷ', 'ㅃ': 'ㅂ',
                'ㅆ': 'ㅅ', 'ㅉ': 'ㅈ'
            }[initial];
            result.push(this.initialConsonants[baseConsonant]);
        } else if (initial !== 'ㅇ') {
            // ㅇ은 표기하지 않음 (제1항 다만1)
            result.push(this.initialConsonants[initial]);
        }

        // 3-2. 모음 처리 (제6항, 제7항, 제11항, 제12항)
        if (this.complexVowels[medial]) {
            const vDots = this.complexVowels[medial];
            if (Array.isArray(vDots[0])) {
                // 복합 모음 (ㅘ, ㅙ, ㅝ, ㅞ, ㅟ)
                result.push(...vDots);
            } else {
                // 단일 복합 모음 (ㅐ, ㅔ, ㅚ, ㅢ)
                result.push(vDots);
            }
        } else if (this.basicVowels[medial]) {
            result.push(this.basicVowels[medial]);
        }

        // 제11항: 모음자 '예' 구분표
        const nextChar = text[index + 1];
        if (nextChar) {
            const nextJamo = this.decompose(nextChar);
            if (nextJamo && nextJamo.initial === 'ㅇ' && nextJamo.medial === 'ㅖ') {
                result.push(this.yeSeparator);
            }
        }

        // 3-3. 종성 처리 (제3항, 제4항, 제5항)
        if (final) {
            // 제4항: 쌍받침
            if (this.twinFinals[final]) {
                const fDots = this.twinFinals[final];
                if (Array.isArray(fDots[0])) {
                    result.push(...fDots);
                } else {
                    result.push(fDots);
                }
            }
            // 제5항: 겹받침
            else if (this.clusterFinals[final]) {
                result.push(...this.clusterFinals[final]);
            }
            // 일반 종성
            else if (this.finalConsonants[final]) {
                result.push(this.finalConsonants[final]);
            }
        }

        return 0;
    }

    /**
     * 점자를 한글 텍스트로 변환
     * @param {Array} dotsArray - 점자 dots 배열
     * @returns {string} 한글 텍스트
     */
    translateToKorean(dotsArray) {
        let result = '';

        if (!dotsArray || dotsArray.length === 0) {
            return result;
        }

        let i = 0;
        while (i < dotsArray.length) {
            const dots = dotsArray[i];
            const dotsStr = JSON.stringify(dots);

            // 1. 수표 체크
            if (dotsStr === JSON.stringify(this.numberIndicator)) {
                i++;
                // 숫자 읽기
                while (i < dotsArray.length) {
                    const numDotsStr = JSON.stringify(dotsArray[i]);
                    const num = Object.keys(this.numbers).find(
                        k => JSON.stringify(this.numbers[k]) === numDotsStr
                    );
                    if (num) {
                        result += num;
                        i++;
                    } else {
                        break;
                    }
                }
                continue;
            }

            // 2. 문장부호 체크
            const punct = Object.keys(this.punctuation).find(k => {
                const pDots = this.punctuation[k];
                if (Array.isArray(pDots[0])) {
                    return JSON.stringify(pDots[0]) === dotsStr;
                }
                return JSON.stringify(pDots) === dotsStr;
            });
            if (punct) {
                result += punct;
                i++;
                continue;
            }

            // 3. 약어 체크
            const contraction = Object.keys(this.contractions).find(k => {
                const cDots = this.contractions[k];
                if (dotsArray.length > i + cDots.length - 1) {
                    return cDots.every((d, idx) =>
                        JSON.stringify(d) === JSON.stringify(dotsArray[i + idx])
                    );
                }
                return false;
            });
            if (contraction) {
                result += contraction;
                i += this.contractions[contraction].length;
                continue;
            }

            // 4. 약자 체크 (제13항, 제15항)
            const abbr = Object.keys(this.abbreviations).find(
                k => JSON.stringify(this.abbreviations[k]) === dotsStr
            );
            if (abbr) {
                result += abbr;
                i++;
                continue;
            }

            const abbr2 = Object.keys(this.abbreviations2).find(k => {
                const aDots = this.abbreviations2[k];
                if (Array.isArray(aDots[0])) {
                    return aDots.every((d, idx) =>
                        JSON.stringify(d) === JSON.stringify(dotsArray[i + idx])
                    );
                }
                return JSON.stringify(aDots) === dotsStr;
            });
            if (abbr2) {
                result += abbr2;
                const len = Array.isArray(this.abbreviations2[abbr2][0])
                    ? this.abbreviations2[abbr2].length : 1;
                i += len;
                continue;
            }

            // 5. 일반 자모 조합 (단순 구현)
            // 실제로는 복잡한 자모 조합 로직 필요
            // 현재는 기본 매핑만 지원
            result += '[점자]';
            i++;
        }

        return result;
    }

    /**
     * 한글 음절을 자모로 분해
     * @param {string} syllable - 한글 음절 (1글자)
     * @returns {Object} {initial, medial, final}
     */
    decompose(syllable) {
        const code = syllable.charCodeAt(0) - 0xAC00;
        if (code < 0 || code > 11171) return null;

        const initialIndex = Math.floor(code / 588);
        const medialIndex = Math.floor((code % 588) / 28);
        const finalIndex = code % 28;

        const initials = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
        const medials = ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'];
        const finals = ['', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];

        return {
            initial: initials[initialIndex],
            medial: medials[medialIndex],
            final: finals[finalIndex]
        };
    }
}

export default BrailleTranslator;
