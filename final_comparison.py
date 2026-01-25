"""
수정된 [024_Braille_Standard].md 기준으로 StudyMode.js 비교
최신 MD 파일을 다시 읽어서 비교
"""

import json
import re

def parse_md_updated():
    """수정된 MD 파일에서 데이터 추출"""
    with open(r"c:\Users\FORYOUCOM\Desktop\점자 학습\[024_Braille_Standard].md", "r", encoding="utf-8") as f:
        content = f.read()
    
    md_data = {}
    
    # 제1항: 초성 (17-30행) - 수정됨!
    md_data['제1항'] = {
        'ㄱ': [4],
        'ㄴ': [1, 4],
        'ㄷ': [2, 4],      # 변경: 2,4,5 → 2,4
        'ㄹ': [5],
        'ㅁ': [1, 5],
        'ㅂ': [4, 5],
        'ㅅ': [6],         # 변경: 2,3,4 → 6
        'ㅇ': [],
        'ㅈ': [4, 6],
        'ㅊ': [5, 6],
        'ㅋ': [1, 2, 4],
        'ㅌ': [1, 2, 5],
        'ㅍ': [1, 4, 5],
        'ㅎ': [2, 4, 5]
    }
    
    # 제2항: 된소리 (변경 없음)
    md_data['제2항'] = {
        '된소리표': [6],
        'ㄲ': [[6], [4]],
        'ㄸ': [[6], [2, 4]],  # ㄷ이 2,4로 바뀌었으므로
        'ㅃ': [[6], [4, 5]],
        'ㅆ': [[6], [6]],      # ㅅ이 6으로 바뀌었으므로
        'ㅉ': [[6], [4, 6]]
    }
    
    # 제3항: 종성 (변경 없음)
    md_data['제3항'] = {
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
    }
    
    # 제4항: 쌍받침 (변경 없음)
    md_data['제4항'] = {
        'ㄲ (받침)': [[1], [1]],
        'ㅆ (받침)': [3, 4]
    }
    
    # 제5항: 겹받침 (변경 없음)
    md_data['제5항'] = {
        'ㄳ': [[1], [3]],
        'ㄵ': [[2, 5], [1, 3]],
        'ㄺ': [[2], [1]],
        'ㄻ': [[2], [2, 6]],
        'ㄼ': [[2], [1, 2]]
    }
    
    # 제6항: 기본 모음 (120-129행) - 수정됨!
    md_data['제6항'] = {
        'ㅏ': [1, 2, 6],
        'ㅑ': [3, 4, 5],
        'ㅓ': [2, 3, 4],
        'ㅕ': [1, 5, 6],
        'ㅗ': [1, 3, 6],
        'ㅛ': [3, 5, 6],    # 변경: 3,4,6 → 3,5,6
        'ㅜ': [1, 3, 4],    # 변경: 1,4,6 → 1,3,4
        'ㅠ': [1, 4, 6],    # 변경: 1,4,5 → 1,4,6
        'ㅡ': [2, 4, 6],
        'ㅣ': [1, 3, 5]
    }
    
    # 제7항: 복합 모음 (141-150행) - 대폭 수정됨!
    md_data['제7항'] = {
        'ㅐ': [1, 2, 3, 5],
        'ㅒ': [[3, 4, 5], [1, 2, 3, 5]],  # 새로 추가!
        'ㅔ': [1, 3, 4, 5],
        'ㅚ': [1, 3, 4, 5, 6],
        'ㅘ': [1, 2, 3, 6],              # 변경: [[1,3,6], [1,2,6]] → [1,2,3,6]
        'ㅙ': [[1, 2, 3, 6], [1, 2, 3, 5]],  # 변경
        'ㅝ': [1, 2, 3, 4],              # 변경: [[1,4,6], [2,3,4]] → [1,2,3,4]
        'ㅞ': [[1, 2, 3, 4], [1, 2, 3, 5]],  # 변경
        'ㅟ': [[1, 3, 4], [1, 2, 3, 5]],     # 변경
        'ㅢ': [2, 4, 5, 6]
    }
    
    # 제11항: 구분표 (변경 없음)
    md_data['제11항'] = {
        '구분표': [3, 6]
    }
    
    # 제12항: 구분표 (변경 없음)
    md_data['제12항'] = {
        '구분표': [3, 4]
    }
    
    # 제13항: 약자 (변경 없음)
    md_data['제13항'] = {
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
    }
    
    # 제15항: 약자 (241행) - 수정됨!
    md_data['제15항'] = {
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
        '인': [1, 2, 3, 4, 5],  # 변경: 1,2,3,5 → 1,2,3,4,5
        '것': [[4, 5, 6], [2, 3, 4]]
    }
    
    # 제16항: 된소리 약자 (변경 없음)
    md_data['제16항'] = {
        '까': [[6], [1, 2, 4, 6]],
        '싸': [[6], [6]],
        '껏': [[6], [4, 5, 6], [2, 3, 4]]
    }
    
    # 제17항: 약자 (변경 없음)
    md_data['제17항'] = {
        '성': [[6], [1, 2, 4, 5, 6]],      # ㅅ이 6으로 바뀌었으므로
        '썽': [[6], [6], [1, 2, 4, 5, 6]],
        '정': [[4, 6], [1, 2, 4, 5, 6]],
        '쩡': [[6], [4, 6], [1, 2, 4, 5, 6]],
        '청': [[5, 6], [1, 2, 4, 5, 6]]
    }
    
    # 제18항: 약어 (변경 없음)
    md_data['제18항'] = {
        '그래서': [[1], [2, 3, 4]],
        '그러나': [[1], [1, 4]],
        '그러면': [[1], [2, 5]],
        '그러므로': [[1], [2, 6]],
        '그런데': [[1], [1, 3, 4, 5]],
        '그리고': [[1], [1, 3, 6]],
        '그리하여': [[1], [1, 5, 6]]
    }
    
    # 제28항: 로마자 (변경 없음)
    md_data['제28항'] = {
        'a': [1],
        'b': [1, 2],
        'c': [1, 4],
        'd': [1, 4, 5],
        'e': [1, 5],
        'f': [1, 2, 4],
        'g': [1, 2, 4, 5],
        'h': [1, 2, 5],
        'i': [2, 4],
        'j': [2, 4, 5]
    }
    
    # 제29항: 로마자 표지 (변경 없음)
    md_data['제29항'] = {
        '로마자표': [3, 5, 6],
        '대문자표(1글자)': [6],
        '대문자단어표': [[6], [6]],
        '로마자종료표': [2, 5, 6]
    }
    
    # 제40항: 숫자 (변경 없음)
    md_data['제40항'] = {
        '수표': [3, 4, 5, 6],
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
    }
    
    # 제41항: 자릿점 (변경 없음)
    md_data['제41항'] = {
        '자릿점': [2]
    }
    
    # 제49항: 문장 부호 (438행) - 대폭 축소됨!
    md_data['제49항'] = {
        '.': [2, 5, 6],
        '?': [2, 3, 6],
        '!': [2, 3, 5],
        ',': [5]
        # 따옴표들이 모두 삭제됨!
    }
    
    return md_data

def extract_js_data():
    """StudyMode.js에서 데이터 추출"""
    with open(r"c:\Users\FORYOUCOM\Desktop\점자 학습\src\components\StudyMode.js", "r", encoding="utf-8") as f:
        content = f.read()
    
    js_data = {}
    lines = content.split('\n')
    
    current_clause = None
    for i, line in enumerate(lines):
        if "'제" in line and "항':" in line:
            match = re.search(r"'(제\d+항)':", line)
            if match:
                current_clause = match.group(1)
                js_data[current_clause] = {}
        
        if current_clause and 'items:' in line:
            j = i + 1
            while j < len(lines):
                item_line = lines[j]
                if '],' in item_line and 'dots:' not in item_line:
                    break
                
                char_match = re.search(r"char:\s*'([^']+)'", item_line)
                word_match = re.search(r"word:\s*'([^']+)'", item_line)
                
                if char_match or word_match:
                    char = char_match.group(1) if char_match else word_match.group(1)
                    dots_match = re.search(r"dots:\s*(\[\[.*?\]\]|\[.*?\])", item_line)
                    if dots_match:
                        try:
                            dots = eval(dots_match.group(1))
                            js_data[current_clause][char] = dots
                        except:
                            pass
                j += 1
    
    return js_data

def compare_and_report():
    """비교 및 리포트 생성"""
    md_data = parse_md_updated()
    js_data = extract_js_data()
    
    changes = []
    
    for clause in sorted(md_data.keys(), key=lambda x: int(re.search(r'\d+', x).group())):
        md_items = md_data[clause]
        js_items = js_data.get(clause, {})
        
        for char, md_dots in md_items.items():
            js_dots = None
            matched_char = None
            
            if char in js_items:
                js_dots = js_items[char]
                matched_char = char
            elif char == '구분표':
                for js_char in js_items.keys():
                    if '구분표' in js_char:
                        js_dots = js_items[js_char]
                        matched_char = js_char
                        break
            
            if js_dots is None:
                changes.append({
                    'clause': clause,
                    'type': '누락',
                    'char': char,
                    'md_dots': md_dots,
                    'js_dots': None
                })
            elif js_dots != md_dots:
                changes.append({
                    'clause': clause,
                    'type': '불일치',
                    'char': char,
                    'md_dots': md_dots,
                    'js_dots': js_dots
                })
    
    # 리포트 출력
    print("=" * 80)
    print("수정된 [024_Braille_Standard].md 기준 비교 리포트")
    print("=" * 80)
    print()
    
    if not changes:
        print("✅ 모든 데이터가 일치합니다!")
    else:
        print(f"⚠️  총 {len(changes)}개 항목에서 변경 필요\n")
        
        for i, change in enumerate(changes, 1):
            print(f"{i}. [{change['clause']}] {change['type']}: '{change['char']}'")
            print(f"   MD 기준: {change['md_dots']}")
            print(f"   JS 현재: {change['js_dots']}")
            print()
    
    # JSON 저장
    with open(r"c:\Users\FORYOUCOM\Desktop\점자 학습\final_comparison_report.json", "w", encoding="utf-8") as f:
        json.dump({
            'total_changes': len(changes),
            'changes': changes
        }, f, ensure_ascii=False, indent=2)
    
    print("✅ 리포트를 final_comparison_report.json에 저장했습니다.")

if __name__ == "__main__":
    compare_and_report()
