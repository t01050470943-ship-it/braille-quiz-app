import re

# 파일 읽기
with open(r'C:\Users\FORYOUCOM\Desktop\점자 학습\src\engine\BrailleTranslator.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# 영어 처리 로직 찾기 (4번 섹션)
start_idx = None
end_idx = None

for i, line in enumerate(lines):
    if '// 4. 영어 알파벳 처리' in line:
        start_idx = i
    if start_idx is not None and 'continue;' in line and '// 5. 한글 처리' in lines[i+2] if i+2 < len(lines) else False:
        end_idx = i + 1
        break

if start_idx and end_idx:
    print(f'Found English section: lines {start_idx+1} to {end_idx+1}')
    
    # 새로운 로직
    new_logic = '''            // 4. 영어 알파벳 처리 (제28항, 제29항)
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
'''
    
    # 교체
    new_lines = lines[:start_idx] + [new_logic + '\n'] + lines[end_idx:]
    
    # 파일 저장
    with open(r'C:\Users\FORYOUCOM\Desktop\점자 학습\src\engine\BrailleTranslator.js', 'w', encoding='utf-8') as f:
        f.writelines(new_lines)
    
    print('✅ Successfully updated English processing logic!')
    print(f'Replaced lines{start_idx+1}-{end_idx+1} with new logic')
else:
    print('❌ Could not find English processing section')
