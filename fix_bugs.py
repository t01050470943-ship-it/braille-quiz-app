"""
BrailleTranslator.js 버그 및 누락 사항 수정
"""

# 수정할 내용:
# 1. Line 22: '선택' -> 'ㅈ' 수정 (오타)
# 2. ㅒ, ㅖ 모음 추가

import re

filepath = r'C:\Users\FORYOUCOM\Desktop\점자 학습\src\engine\BrailleTranslator.js'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. '선택' 오타 수정
content = content.replace("'선택': [4, 6],", "'ㅈ': [4, 6],")

# 2. ㅒ, ㅖ 모음 추가
old_complex = """        this.complexVowels = {
            'ㅐ': [1, 2, 3, 5],
            'ㅔ': [1, 3, 4, 5],
            'ㅚ': [1, 3, 4, 5, 6],
            'ㅘ': [[1, 3, 6], [1, 2, 6]],      // ㅗ+ㅏ
            'ㅙ': [[1, 3, 6], [1, 2, 3, 5]],  // ㅗ+ㅐ
            'ㅝ': [[1, 4, 6], [2, 3, 4]],      // ㅜ+ㅓ
            'ㅞ': [[1, 4, 6], [1, 2, 3, 5]],  // ㅜ+ㅔ
            'ㅟ': [[1, 4, 6], [1, 3, 5]],      // ㅜ+ㅣ
            'ㅢ': [2, 4, 5, 6]
        };"""

new_complex = """        this.complexVowels = {
            'ㅐ': [1, 2, 3, 5],
            'ㅔ': [1, 3, 4, 5],
            'ㅚ': [1, 3, 4, 5, 6],
            'ㅒ': [[3, 4, 5], [1, 2, 3, 5]],  // ㅑ+ㅐ
            'ㅖ': [[1, 5, 6], [1, 3, 4, 5]],  // ㅕ+ㅔ
            'ㅘ': [[1, 3, 6], [1, 2, 6]],      // ㅗ+ㅏ
            'ㅙ': [[1, 3, 6], [1, 2, 3, 5]],  // ㅗ+ㅐ
            'ㅝ': [[1, 4, 6], [2, 3, 4]],      // ㅜ+ㅓ
            'ㅞ': [[1, 4, 6], [1, 2, 3, 5]],  // ㅜ+ㅔ
            'ㅟ': [[1, 4, 6], [1, 3, 5]],      // ㅜ+ㅣ
            'ㅢ': [2, 4, 5, 6]
        };"""

content = content.replace(old_complex, new_complex)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print('✅ Fixed:')
print('  - Line 22: "선택" -> "ㅈ"')
print('  - Added ㅒ: [[3,4,5], [1,2,3,5]]')
print('  - Added ㅖ: [[1,5,6], [1,3,4,5]]')
