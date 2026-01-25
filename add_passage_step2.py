"""
Step 2: 영어 단어 시작 시 대문자 구절 체크
"""

import re

filepath = r'C:\Users\FORYOUCOM\Desktop\점자 학습\src\engine\BrailleTranslator.js'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 영어 처리 부분에서 단어 시작 로직 수정
old_pattern = """                if (i === 0 || !/[a-zA-Z]/.test(text[i - 1])) {
                    result.push(this.foreignWordIndicator);

                    // 단어 전체 추출 및 대문자 패턴 분석"""

new_pattern = """                if (i === 0 || !/[a-zA-Z]/.test(text[i - 1])) {
                    result.push(this.foreignWordIndicator);

                    // 대문자 구절 확인
                    const inPassage = capitalPassages.some(p => i >= p.start && i < p.end);
                    if (inPassage) {
                        const passage = capitalPassages.find(p => i >= p.start && i < p.end);
                        if (i === passage.start) {
                            // 구절 시작
                            result.push(this.capitalPassageIndicator);  // [6, 6, 6]
                        }
                    }

                    // 단어 전체 추출 및 대문자 패턴 분석 (구절이 아닌 경우)
                    if (!inPassage)"""

if old_pattern in content:
    content = content.replace(old_pattern, new_pattern)
    print('✅ Added passage start detection')
else:
    print('❌ Pattern not found')
    exit(1)

# 영어 단어 끝에 구절 종료 체크
old_end = """                // 영어 단어 끝에 종료자 추가
                if (i === text.length - 1 || !/[a-zA-Z]/.test(text[i + 1])) {
                    result.push(this.foreignWordTerminator);
                }"""

new_end = """                // 영어 단어 끝에 종료자 추가
                if (i === text.length - 1 || !/[a-zA-Z]/.test(text[i + 1])) {
                    result.push(this.foreignWordTerminator);
                    
                    // 대문자 구절 종료 확인
                    const inPassage = capitalPassages.some(p => i >= p.start && i < p.end);
                    if (inPassage) {
                        const passage = capitalPassages.find(p => i >= p.start && i < p.end);
                        // 구절의 마지막 문자인지 확인
                        if (i === passage.end - 1 || (i < passage.end && !/[a-zA-Z]/.test(text[i + 1]))) {
                            result.push(this.capitalTerminator);  // [6, 3]
                        }
                    }
                }"""

if old_end in content:
    content = content.replace(old_end, new_end)
    print('✅ Added passage end detection')
else:
    print('❌ End pattern not found')
    exit(1)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print('\n✅ Step 2 완료: 영어 처리 로직에 구절 감지 추가')
