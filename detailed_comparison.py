"""
점자 규정 데이터 정밀 비교 스크립트
[024_Braille_Standard].md 기준으로 StudyMode.js의 변경 필요 사항 확인
"""

import json
import re

def load_reference_data():
    """참조 데이터 로드 (MD 문서 기준)"""
    with open(r"c:\Users\FORYOUCOM\Desktop\점자 학습\braille_reference.json", "r", encoding="utf-8") as f:
        return json.load(f)

def extract_js_data_complete():
    """StudyMode.js에서 모든 점자 데이터 추출 (더 정확한 버전)"""
    with open(r"c:\Users\FORYOUCOM\Desktop\점자 학습\src\components\StudyMode.js", "r", encoding="utf-8") as f:
        content = f.read()
    
    js_data = {}
    
    # 각 항목 수동 추출
    lines = content.split('\n')
    
    current_clause = None
    for i, line in enumerate(lines):
        # 항목 시작 감지
        if "'제" in line and "항':" in line:
            match = re.search(r"'(제\d+항)':", line)
            if match:
                current_clause = match.group(1)
                js_data[current_clause] = {}
        
        # items 내의 데이터 추출
        if current_clause and 'items:' in line:
            # items 배열 시작 후 데이터 수집
            j = i + 1
            while j < len(lines):
                item_line = lines[j]
                
                # items 배열 종료
                if '],' in item_line and 'dots:' not in item_line:
                    break
                
                # char 또는 word 추출
                char_match = re.search(r"char:\s*'([^']+)'", item_line)
                word_match = re.search(r"word:\s*'([^']+)'", item_line)
                
                if char_match or word_match:
                    char = char_match.group(1) if char_match else word_match.group(1)
                    
                    # dots 추출
                    dots_match = re.search(r"dots:\s*(\[\[.*?\]\]|\[.*?\])", item_line)
                    if dots_match:
                        try:
                            dots = eval(dots_match.group(1))
                            js_data[current_clause][char] = dots
                        except:
                            pass
                
                j += 1
    
    return js_data

def compare_detailed():
    """상세 비교 수행"""
    md_data = load_reference_data()
    js_data = extract_js_data_complete()
    
    print("=" * 80)
    print("점자 규정 데이터 비교 리포트")
    print("[024_Braille_Standard].md 기준")
    print("=" * 80)
    print()
    
    changes_needed = []
    
    for clause in sorted(md_data.keys(), key=lambda x: int(re.search(r'\d+', x).group())):
        md_items = md_data[clause]
        js_items = js_data.get(clause, {})
        
        print(f"\n{'='*60}")
        print(f"### {clause} ###")
        print(f"{'='*60}")
        
        clause_changes = []
        
        for char, md_dots in md_items.items():
            # JS에서 찾기 (정확한 이름 또는 변형된 이름)
            js_dots = None
            matched_char = None
            
            # 1. 정확히 일치하는 char
            if char in js_items:
                js_dots = js_items[char]
                matched_char = char
            # 2. 구분표의 경우 변형 이름 확인
            elif char == '구분표':
                for js_char in js_items.keys():
                    if '구분표' in js_char:
                        js_dots = js_items[js_char]
                        matched_char = js_char
                        break
            
            # 비교
            if js_dots is None:
                print(f"  ❌ 누락: '{char}' - MD 점형: {md_dots}")
                clause_changes.append({
                    'type': '누락',
                    'char': char,
                    'md_dots': md_dots,
                    'js_dots': None,
                    'action': f"추가 필요: {{ char: '{char}', dots: {md_dots}, name: '...' }}"
                })
            elif js_dots != md_dots:
                print(f"  ❌ 불일치: '{char}'")
                print(f"     MD 점형: {md_dots}")
                print(f"     JS 점형: {js_dots}")
                clause_changes.append({
                    'type': '불일치',
                    'char': char,
                    'md_dots': md_dots,
                    'js_dots': js_dots,
                    'action': f"수정 필요: dots를 {md_dots}로 변경"
                })
            else:
                print(f"  ✅ 일치: '{char}' = {md_dots}")
        
        if clause_changes:
            changes_needed.append({
                'clause': clause,
                'changes': clause_changes
            })
    
    # 최종 요약
    print("\n" + "=" * 80)
    print("최종 요약")
    print("=" * 80)
    
    if not changes_needed:
        print("\n✅ 모든 데이터가 일치합니다! 변경 사항 없음.\n")
    else:
        print(f"\n⚠️  총 {len(changes_needed)}개 항목에서 변경 필요\n")
        
        total_changes = sum(len(c['changes']) for c in changes_needed)
        print(f"변경 필요 항목 수: {total_changes}개\n")
        
        print("\n" + "=" * 80)
        print("변경 사항 상세")
        print("=" * 80)
        
        for item in changes_needed:
            print(f"\n### [{item['clause']}] ###")
            for i, change in enumerate(item['changes'], 1):
                print(f"\n{i}. {change['type']}: '{change['char']}'")
                print(f"   MD 기준: {change['md_dots']}")
                print(f"   JS 현재: {change['js_dots']}")
                print(f"   ▶ {change['action']}")
    
    # 결과를 JSON으로 저장
    with open(r"c:\Users\FORYOUCOM\Desktop\점자 학습\changes_needed_report.json", "w", encoding="utf-8") as f:
        json.dump({
            'total_clauses_with_changes': len(changes_needed),
            'total_changes': sum(len(c['changes']) for c in changes_needed),
            'changes': changes_needed
        }, f, ensure_ascii=False, indent=2)
    
    print("\n\n✅ 상세 리포트를 changes_needed_report.json에 저장했습니다.")

if __name__ == "__main__":
    compare_detailed()
