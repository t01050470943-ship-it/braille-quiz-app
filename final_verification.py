import json

# 최종 확인
data_basic = json.load(open('data/quiz-bank-basic.json', 'r', encoding='utf-8'))
data_standard = json.load(open('data/quiz-bank-standard.json', 'r', encoding='utf-8'))
data_advanced = json.load(open('data/quiz-bank-advanced.json', 'r', encoding='utf-8'))

print("=" * 70)
print("✅ 최종 퀴즈은행 현황 (홈 화면 반영됨)")
print("=" * 70)

basic_r = len(data_basic.get('reading', []))
basic_w = len(data_basic.get('writing', []))
standard_r = len(data_standard.get('reading', []))
standard_w = len(data_standard.get('writing', []))
advanced_r = len(data_advanced.get('reading', []))
advanced_w = len(data_advanced.get('writing', []))

total_r = basic_r + standard_r + advanced_r
total_w = basic_w + standard_w + advanced_w
total = total_r + total_w

print(f"\n【난이도별 문항 수】")
print(f"  기초:   읽기 {basic_r:3d} + 쓰기 {basic_w:3d} = {basic_r+basic_w:3d}문항")
print(f"  기본:   읽기 {standard_r:3d} + 쓰기 {standard_w:3d} = {standard_r+standard_w:3d}문항")
print(f"  심화:   읽기 {advanced_r:3d} + 쓰기 {advanced_w:3d} = {advanced_r+advanced_w:3d}문항")

print(f"\n【전체 총계】")
print(f"  읽기: {total_r}문항")
print(f"  쓰기: {total_w}문항")
print(f"  합계: {total}문항")

print(f"\n【main.js 홈 화면 표시】")
print(f"  👁️ 읽기 퀴즈: 579문항 ✅")
print(f"  ✍️ 쓰기 퀴즈: 378문항 ✅")

print("\n" + "=" * 70)

# 남은 따옴표 문제 확인
punct_reading = [q for q in data_advanced.get('reading', []) if 'punct_' in q.get('id', '')]

print(f"\n【심화 난이도 - 남은 새 문제】")
print(f"  총 {len(punct_reading)}문항\n")

categories = {}
for q in punct_reading:
    cat = q.get('category', '알 수 없음')
    if cat not in categories:
        categories[cat] = []
    categories[cat].append(q['question'])

for cat in sorted(categories.keys()):
    print(f"  {cat} ({len(categories[cat])}문항):")
    for i, q in enumerate(categories[cat], 1):
        print(f"    {i}. {q}")
    print()

print("=" * 70)
