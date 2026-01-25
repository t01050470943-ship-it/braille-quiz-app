"""
BrailleTranslator.js 영어 처리 로직 직접 수정
"""
import re

filepath = r'C:\Users\FORYOUCOM\Desktop\점자 학습\src\engine\BrailleTranslator.js'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 기존 영어 처리 부분 찾기는 어려우므로, translateToBraille 함수 전체를 재작성
# 먼저 함수 시작과 끝 찾기
start_marker = '    translateToBraille(text) {'
end_marker = '    /**\n     * 한글 문자를 점자로 변환'

if start_marker in content and end_marker in content:
    start_idx = content.index(start_marker)
    end_idx = content.index(end_marker)
    
    new_function = '''    translateToBraille(text) {
        const result = [];

        if (!text || text.length === 0) {
            return result;
        }

        // 텍스트를 한 글자씩 처리
        for (let i = 0; i < text.length; i++) {
            const char = text[i];

            // 1. 공백 처리
            if (char === ' ') {
                continue; // 점자에서는 띄어쓰기를 별도 표시하지 않음
            }

            // 2. 숫자 처리 (제40항)
            if (/[0-9]/.test(char)) {
                // 숫자 시작 시 수표 추가 (연속된 숫자의 경우 한 번만)
                if (i === 0 || !/[0-9]/.test(text[i - 1])) {
                    result.push(this.numberIndicator);
                }
                result.push(this.numbers[char]);
                continue;
            }

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
                // 영어 단어 시작 시 처리
                if (i === 0 || !/[a-zA-Z]/.test(text[i - 1])) {
                    result.push(this.foreignWordIndicator);
                    
                    // 대문자 패턴 분석
                    const wordMatch = text.substring(i).match(/^[a-zA-Z]+/);
                    if (wordMatch) {
                        const word = wordMatch[0];
                        const upperCount = (word.match(/[A-Z]/g) || []).length;
                        
                        // 단어 전체가 대문자이거나 2글자 이상 연속 대문자
                        if (upperCount === word.length && upperCount > 1) {
                            result.push(this.capitalWordIndicator);  // [6, 6]
                        }
                    }
                }

                const lowerChar = char.toLowerCase();
                
                // 한 글자만 대문자인 경우 6점 추가
                // (단어 전체 대문자는 이미 [6,6] 추가했으므로 개별 6점 생략)
                const wordMatch = text.substring(i).match(/^[a-zA-Z]+/);
                if (wordMatch) {
                    const word = wordMatch[0];
                    const upperCount = (word.match(/[A-Z]/g) || []).length;
                    const isWordAllCaps = (upperCount === word.length && upperCount > 1);
                    
                    if (char !== lowerChar && !isWordAllCaps) {
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

    '''
    
    new_content = content[:start_idx] + new_function + content[end_idx:]
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print('✅ Successfully updated translateToBraille function!')
else:
    print('❌ Could not find function markers')
