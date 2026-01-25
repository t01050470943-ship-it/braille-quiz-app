"""
점자 규정 데이터 상세 비교 스크립트 v2
StudyMode.js와 braille_reference.json을 직접 비교하여 불일치 찾기
"""

import json
import re

def load_reference_data():
    """참조 데이터 로드"""
    with open(r"c:\Users\FORYOUCOM\Desktop\점자 학습\braille_reference.json", "r", encoding="utf-8") as f:
        return json.load(f)

def extract_js_item_dots(line):
    """JS 라인에서 dots 배열 추출"""
    # { char: 'ㄱ', dots: [4], name: '기역' }
    match = re.search(r"dots:\s*(\[\[.*?\]\]|\[.*?\])", line)
    if not match:
        return None
    
    dots_str = match.group(1)
    try:
        # Python eval로 배열 파싱 (안전한 입력이므로 사용)
        dots = eval(dots_str)
        return dots
    except:
        return None

def compare_all():
    """전체 비교 수행"""
    ref_data = load_reference_data()
    
    # StudyMode.js 라인별로 읽기
    with open(r"c:\Users\FORYOUCOM\Desktop\점자 학습\src\components\StudyMode.js", "r", encoding="utf-8") as f:
        js_lines = f.readlines()
    
    print("=" * 80)
    print("점자 규정 데이터 전수 비교 리포트 (상세)")
    print("=" * 80)
    print()
    
    mismatches = []
    total_compared = 0
    
    # 라인 번호 매핑 (대략적)
    clause_line_ranges = {
        '제1항': (35, 48),     # 초성
        '제2항': (64, 69),     # 된소리
        '제3항': (77, 90),     # 종성
        '제4항': (98, 99),     # 쌍받침
        '제5항': (107, 111),   # 겹받침
        '제6항': (119, 128),   # 기본 모음
        '제7항': (136, 144),   # 복합 모음
        '제11항': (152, 152),  # 구분표(3,6)
        '제12항': (160, 160),  # 구분표(3,4)
        '제13항': (173, 183),  # 약자 (가~하)
        '제15항': (205, 219),  # 약자 (억~것)
        '제16항': (235, 237),  # 된소리 약자
        '제17항': (245, 249),  # 약자 (성~청)
        '제18항': (257, 263),  # 약어
        '제28항': (287, 296),  # 로마자
        '제29항': (311, 314),  # 로마자 표지
        '제40항': (332, 342),  # 숫자
        '제41항': (350, 351),  # 자릿점
        '제49항': (388, 395),  # 문장 부호
    }
    
    for clause, (start_line, end_line) in clause_line_ranges.items():
        if clause not in ref_data:
            continue
        
        print(f"\n### {clause} 검증 ###")
        ref_items = ref_data[clause]
        
        # JS 파일에서 해당 범위 추출
        matching_items = {}
        for line_no in range(start_line - 1, min(end_line, len(js_lines))):
            line = js_lines[line_no]
            
            # char 또는 word 추출
            char_match = re.search(r"char:\s*'([^']+)'", line)
            word_match = re.search(r"word:\s*'([^']+)'", line)
            
            char_or_word = None
            if char_match:
                char_or_word = char_match.group(1)
            elif word_match:
                char_or_word = word_match.group(1)
            
            if char_or_word:
                dots = extract_js_item_dots(line)
                if dots is not None:
                    matching_items[char_or_word] = dots
        
        # 비교
        for char, ref_dots in ref_items.items():
            total_compared += 1
            
            if char in matching_items:
                js_dots = matching_items[char]
                if js_dots != ref_dots:
                    print(f"  ❌ 불일치: {char}")
                    print(f"     MD:  {ref_dots}")
                    print(f"     JS:  {js_dots}")
                    mismatches.append({
                        'clause': clause,
                        'char': char,
                        'md_dots': ref_dots,
                        'js_dots': js_dots
                    })
                else:
                    print(f"  ✓ 일치: {char} = {ref_dots}")
            else:
                print(f"  ⚠️  JS에서 찾을 수 없음: {char}")
                mismatches.append({
                    'clause': clause,
                    'char': char,
                    'md_dots': ref_dots,
                    'js_dots': None
                })
    
    print("\n" + "=" * 80)
    print(f"비교 완료: 총 {total_compared}개 항목")
    print(f"불일치 발견: {len(mismatches)}개")
    print("=" * 80)
    
    if mismatches:
        print("\n### 수정이 필요한 항목 목록 ###\n")
        for i, m in enumerate(mismatches, 1):
            print(f"{i}. [{m['clause']}] {m['char']}")
            print(f"   현재(JS): {m['js_dots']}")
            print(f"   올바름(MD): {m['md_dots']}")
            print()
    
    # 결과를 JSON으로 저장
    with open(r"c:\Users\FORYOUCOM\Desktop\점자 학습\comparison_report.json", "w", encoding="utf-8") as f:
        json.dump({
            'total_compared': total_compared,
            'mismatches': mismatches
        }, f, ensure_ascii=False, indent=2)
    
    print("✓ 비교 리포트를 comparison_report.json에 저장했습니다.")

if __name__ == "__main__":
    compare_all()
