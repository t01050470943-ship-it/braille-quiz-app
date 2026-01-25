"""
대문자 구절 처리 단순 구현
- 영어 단어 처리 시 전체 텍스트에서 연속된 대문자 단어 개수 확인
- 3개 이상이면 첫 단어에 [6,6,6], 마지막 단어 뒤에 [6,3]
"""

import re

filepath = r'C:\Users\FORYOUCOM\Desktop\점자 학습\src\engine\BrailleTranslator.js'

with open(filepath, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# translateToBraille 함수 시작 찾기
for i, line in enumerate(lines):
    if 'translateToBraille(text) {' in line:
        print(f'Found translateToBraille at line {i+1}')
        break

# 영어 처리 부분 찾기
for i, line in enumerate(lines):
    if '// 4. 영어 알파벳 처리' in line:
        print(f'Found English section at line {i+1}')
        english_start = i
        break

# 함수 시작 부분에 대문자 구절 사전 분석 추가
# translateToBraille 시작 직후에 추가
insert_pos = None
for i, line in enumerate(lines):
    if 'translateToBraille(text) {' in line:
        # 다음 줄의 result 선언 다음에 추가
        for j in range(i+1, min(i+10, len(lines))):
            if 'const result = []' in lines[j]:
                insert_pos = j + 1
                break
        break

if insert_pos:
    # 대문자 구절 감지 코드 추가
    passage_code = '''
        // 대문자 구절 사전 분석 (제29항)
        const capitalPassages = [];
        const allCapWordsPattern = /[A-Z]+ [A-Z]+ [A-Z]+[A-Z ]*/g;
        let match;
        while ((match = allCapWordsPattern.exec(text)) !== null) {
            const passage = match[0];
            const wordCount = passage.split(' ').length;
            if (wordCount >= 3) {
                capitalPassages.push({
                    start: match.index,
                    end: match.index + passage.length,
                    passage: passage
                });
            }
        }

'''
    lines.insert(insert_pos, passage_code)
    print(f'✅ Inserted passage detection at line {insert_pos+1}')
else:
    print('❌ Could not find insert position')
    exit(1)

with open(filepath, 'w', encoding='utf-8') as f:
    f.writelines(lines)

print('✅ Step 1 완료: 대문자 구절 사전 분석 코드 추가')
print('다음: 영어 처리 로직에서 사용')
