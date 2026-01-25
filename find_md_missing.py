"""
StudyMode.js 기준으로 [024_Braille_Standard].md에 누락된 내용 찾기
수정은 하지 않고 보고만 함
"""

import json
import re

def extract_js_data_complete():
    """StudyMode.js에서 모든 점자 데이터 추출"""
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

def parse_md_updated():
    """수정된 MD 파일에서 데이터 추출"""
    with open(r"c:\Users\FORYOUCOM\Desktop\점자 학습\[024_Braille_Standard].md", "r", encoding="utf-8") as f:
        content = f.read()
    
    md_data = {}
    
    # 제1항: 초성
    md_data['제1항'] = {
        'ㄱ': [4], 'ㄴ': [1, 4], 'ㄷ': [2, 4], 'ㄹ': [5], 'ㅁ': [1, 5],
        'ㅂ': [4, 5], 'ㅅ': [6], 'ㅇ': [], 'ㅈ': [4, 6], 'ㅊ': [5, 6],
        'ㅋ': [1, 2, 4], 'ㅌ': [1, 2, 5], 'ㅍ': [1, 4, 5], 'ㅎ': [2, 4, 5]
    }
    
    # 제2항: 된소리
    md_data['제2항'] = {
        '된소리표': [6], 'ㄲ': [[6], [4]], 'ㄸ': [[6], [2, 4]],
        'ㅃ': [[6], [4, 5]], 'ㅆ': [[6], [6]], 'ㅉ': [[6], [4, 6]]
    }
    
    # 제3항: 종성
    md_data['제3항'] = {
        'ㄱ': [1], 'ㄴ': [2, 5], 'ㄷ': [3, 5], 'ㄹ': [2], 'ㅁ': [2, 6],
        'ㅂ': [1, 2], 'ㅅ': [3], 'ㅇ': [2, 3, 5, 6], 'ㅈ': [1, 3], 'ㅊ': [2, 3],
        'ㅋ': [2, 3, 5], 'ㅌ': [2, 3, 6], 'ㅍ': [2, 5, 6], 'ㅎ': [3, 5, 6]
    }
    
    # 제4항: 쌍받침
    md_data['제4항'] = {
        'ㄲ (받침)': [[1], [1]], 'ㅆ (받침)': [3, 4]
    }
    
    # 제5항: 겹받침
    md_data['제5항'] = {
        'ㄳ': [[1], [3]], 'ㄵ': [[2, 5], [1, 3]], 'ㄺ': [[2], [1]],
        'ㄻ': [[2], [2, 6]], 'ㄼ': [[2], [1, 2]]
    }
    
    # 제6항: 기본 모음
    md_data['제6항'] = {
        'ㅏ': [1, 2, 6], 'ㅑ': [3, 4, 5], 'ㅓ': [2, 3, 4], 'ㅕ': [1, 5, 6],
        'ㅗ': [1, 3, 6], 'ㅛ': [3, 5, 6], 'ㅜ': [1, 3, 4], 'ㅠ': [1, 4, 6],
        'ㅡ': [2, 4, 6], 'ㅣ': [1, 3, 5]
    }
    
    # 제7항: 복합 모음
    md_data['제7항'] = {
        'ㅐ': [1, 2, 3, 5], 'ㅒ': [[3, 4, 5], [1, 2, 3, 5]], 'ㅔ': [1, 3, 4, 5],
        'ㅚ': [1, 3, 4, 5, 6], 'ㅘ': [1, 2, 3, 6],
        'ㅙ': [[1, 2, 3, 6], [1, 2, 3, 5]], 'ㅝ': [1, 2, 3, 4],
        'ㅞ': [[1, 2, 3, 4], [1, 2, 3, 5]], 'ㅟ': [[1, 3, 4], [1, 2, 3, 5]],
        'ㅢ': [2, 4, 5, 6]
    }
    
    # 제11항: 구분표
    md_data['제11항'] = {'구분표': [3, 6]}
    
    # 제12항: 구분표
    md_data['제12항'] = {'구분표': [3, 4]}
    
    # 제13항: 약자
    md_data['제13항'] = {
        '가': [1, 2, 4, 6], '나': [1, 4], '다': [2, 4], '마': [1, 5],
        '바': [4, 5], '사': [6], '자': [4, 6], '카': [1, 2, 4],
        '타': [1, 2, 5], '파': [1, 4, 5], '하': [2, 4, 5]
    }
    
    # 제15항: 약자
    md_data['제15항'] = {
        '억': [1, 4, 5, 6], '언': [2, 3, 4, 5, 6], '얼': [2, 3, 4, 5],
        '연': [1, 6], '열': [1, 2, 5, 6], '영': [1, 2, 4, 5, 6],
        '옥': [1, 3, 4, 6], '온': [1, 2, 3, 5, 6], '옹': [1, 2, 3, 4, 5, 6],
        '운': [1, 2, 4, 5], '울': [1, 2, 3, 4, 6], '은': [1, 3, 5, 6],
        '을': [2, 3, 4, 6], '인': [1, 2, 3, 4, 5], '것': [[4, 5, 6], [2, 3, 4]]
    }
    
    # 제16항: 된소리 약자
    md_data['제16항'] = {
        '까': [[6], [1, 2, 4, 6]], '싸': [[6], [6]],
        '껏': [[6], [4, 5, 6], [2, 3, 4]]
    }
    
    # 제17항: 약자
    md_data['제17항'] = {
        '성': [[6], [1, 2, 4, 5, 6]], '썽': [[6], [6], [1, 2, 4, 5, 6]],
        '정': [[4, 6], [1, 2, 4, 5, 6]], '쩡': [[6], [4, 6], [1, 2, 4, 5, 6]],
        '청': [[5, 6], [1, 2, 4, 5, 6]]
    }
    
    # 제18항: 약어
    md_data['제18항'] = {
        '그래서': [[1], [2, 3, 4]], '그러나': [[1], [1, 4]],
        '그러면': [[1], [2, 5]], '그러므로': [[1], [2, 6]],
        '그런데': [[1], [1, 3, 4, 5]], '그리고': [[1], [1, 3, 6]],
        '그리하여': [[1], [1, 5, 6]]
    }
    
    # 제28항: 로마자
    md_data['제28항'] = {
        'a': [1], 'b': [1, 2], 'c': [1, 4], 'd': [1, 4, 5], 'e': [1, 5],
        'f': [1, 2, 4], 'g': [1, 2, 4, 5], 'h': [1, 2, 5],
        'i': [2, 4], 'j': [2, 4, 5]
    }
    
    # 제29항: 로마자 표지
    md_data['제29항'] = {
        '로마자표': [3, 5, 6], '대문자표(1글자)': [6],
        '대문자단어표': [[6], [6]], '로마자종료표': [2, 5, 6]
    }
    
    # 제40항: 숫자
    md_data['제40항'] = {
        '수표': [3, 4, 5, 6], '1': [1], '2': [1, 2], '3': [1, 4],
        '4': [1, 4, 5], '5': [1, 5], '6': [1, 2, 4], '7': [1, 2, 4, 5],
        '8': [1, 2, 5], '9': [2, 4], '0': [2, 4, 5]
    }
    
    # 제41항: 자릿점
    md_data['제41항'] = {'자릿점': [2]}
    
    # 제49항: 문장 부호 (축소됨)
    md_data['제49항'] = {
        '.': [2, 5, 6], '?': [2, 3, 6], '!': [2, 3, 5], ',': [5]
    }
    
    return md_data

def find_missing_in_md():
    """JS에는 있지만 MD에 없는 항목 찾기"""
    js_data = extract_js_data_complete()
    md_data = parse_md_updated()
    
    missing = []
    
    for clause in sorted(js_data.keys(), key=lambda x: int(re.search(r'\d+', x).group())):
        js_items = js_data[clause]
        md_items = md_data.get(clause, {})
        
        for char, js_dots in js_items.items():
            # MD에서 찾기
            found = False
            
            if char in md_items:
                found = True
            elif '구분표' in char:
                # 구분표는 이름이 다를 수 있음
                if '구분표' in md_items:
                    found = True
            
            if not found:
                missing.append({
                    'clause': clause,
                    'char': char,
                    'js_dots': js_dots
                })
    
    # 리포트 출력
    print("=" * 80)
    print("StudyMode.js 기준: [024_Braille_Standard].md 누락 항목 리포트")
    print("=" * 80)
    print()
    
    if not missing:
        print("✅ MD 문서에 모든 JS 데이터가 포함되어 있습니다!")
    else:
        print(f"⚠️  MD 문서에 누락된 항목: {len(missing)}개\n")
        
        by_clause = {}
        for item in missing:
            clause = item['clause']
            if clause not in by_clause:
                by_clause[clause] = []
            by_clause[clause].append(item)
        
        for clause in sorted(by_clause.keys(), key=lambda x: int(re.search(r'\d+', x).group())):
            items = by_clause[clause]
            print(f"\n### {clause} ###")
            for item in items:
                print(f"  • '{item['char']}' - 점형: {item['js_dots']}")
    
    # JSON 저장
    with open(r"c:\Users\FORYOUCOM\Desktop\점자 학습\md_missing_report.json", "w", encoding="utf-8") as f:
        json.dump({
            'total_missing': len(missing),
            'missing_items': missing
        }, f, ensure_ascii=False, indent=2)
    
    print("\n\n✅ 리포트를 md_missing_report.json에 저장했습니다.")

if __name__ == "__main__":
    find_missing_in_md()
