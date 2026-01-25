"""
2. 대문자 구절 처리 구현 (NEW YORK CITY 등)
"""

filepath = r'C:\Users\FORYOUCOM\Desktop\점자 학습\src\engine\BrailleTranslator.js'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# translateToBraille 함수에서 영어 처리 로직 찾기
# 대문자 구절 처리 로직 추가

old_english_start = """            // 4. 영어 알파벳 처리 (제28항, 제29항)
            if (/[a-zA-Z]/.test(char)) {
                // 영어 단어 시작 시 처리
                let isWordAllCaps = false;
                if (i === 0 || !/[a-zA-Z]/.test(text[i - 1])) {
                    result.push(this.foreignWordIndicator);
                    
                    // 단어 전체 추출 및 대문자 패턴 분석
                    const wordMatch = text.substring(i).match(/^[a-zA-Z]+/);
                    if (wordMatch) {
                        const word = wordMatch[0];
                        const upperCount = (word.match(/[A-Z]/g) || []).length;
                        
                        // 단어 전체가 대문자이거나 2글자 이상 연속 대문자
                        if (upperCount === word.length && upperCount > 1) {
                            isWordAllCaps = true;
                            result.push(this.capitalWordIndicator);  // [6, 6]
                        }
                    }
                }"""

new_english_start = """            // 4. 영어 알파벳 처리 (제28항, 제29항)
            if (/[a-zA-Z]/.test(char)) {
                // 영어 단어 시작 시 처리
                let isWordAllCaps = false;
                let isPassageStart = false;
                
                if (i === 0 || !/[a-zA-Z]/.test(text[i - 1])) {
                    result.push(this.foreignWordIndicator);
                    
                    // 대문자 구절 확인 (3단어 이상 연속 대문자)
                    const passageMatch = text.substring(i).match(/^([A-Z]+ ){2,}[A-Z]+/);
                    if (passageMatch) {
                        // 3단어 이상 대문자 구절
                        result.push(this.capitalPassageIndicator);  // [6, 6, 6]
                        isPassageStart = true;
                    } else {
                        // 단어 전체 추출 및 대문자 패턴 분석
                        const wordMatch = text.substring(i).match(/^[a-zA-Z]+/);
                        if (wordMatch) {
                            const word = wordMatch[0];
                            const upperCount = (word.match(/[A-Z]/g) || []).length;
                            
                            // 단어 전체가 대문자이거나 2글자 이상 연속 대문자
                            if (upperCount === word.length && upperCount > 1) {
                                isWordAllCaps = true;
                                result.push(this.capitalWordIndicator);  // [6, 6]
                            }
                        }
                    }
                }"""

if old_english_start in content:
    content = content.replace(old_english_start, new_english_start)
    print('✅ Step 1: Added passage start detection')
else:
    print('❌ Could not find english start pattern')
    exit(1)

# 영어 단어 끝 처리 부분에 구절 종료자 추가
old_english_end = """                // 영어 단어 끝에 종료자 추가
                if (i === text.length - 1 || !/[a-zA-Z]/.test(text[i + 1])) {
                    result.push(this.foreignWordTerminator);
                }
                
                continue;
            }"""

new_english_end = """                // 영어 단어 끝에 종료자 추가
                if (i === text.length - 1 || !/[a-zA-Z]/.test(text[i + 1])) {
                    result.push(this.foreignWordTerminator);
                    
                    // 대문자 구절 종료 확인
                    if (isPassageStart) {
                        // 다음 단어가 없거나 소문자면 구절 종료
                        const nextWordMatch = text.substring(i + 1).match(/^\s+([A-Z]+)/);
                        if (!nextWordMatch) {
                            result.push(this.capitalTerminator);  // [6, 3]
                        }
                    }
                }
                
                continue;
            }"""

if old_english_end in content:
    content = content.replace(old_english_end, new_english_end)
    print('✅ Step 2: Added passage end detection')
else:
    print('❌ Could not find english end pattern')
    exit(1)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print('\n✅ Successfully implemented capital passage markers!')
print('  - Passage start: [6,6,6] for 3+ consecutive capital words')
print('  - Passage end: [6,3] at the end of passage')
