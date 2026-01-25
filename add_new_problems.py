import json

# 새로운 문제 읽기
new_problems = json.load(open('new_problems_25.json', 'r', encoding='utf-8'))

# 심화 난이도 파일 읽기
data = json.load(open('data/quiz-bank-advanced.json', 'r', encoding='utf-8'))

print("=" * 70)
print("➕ 심화 난이도에 새 문제 추가")
print("=" * 70)

print(f"\n【추가 전】")
print(f"  • 읽기: {len(data['reading'])}문항")
print(f"  • 쓰기: {len(data['writing'])}문항")
print(f"  • 합계: {data.get('total', 0)}문항")

# 읽기 문제에 추가
data['reading'].extend(new_problems['reading'])

print(f"\n【추가 후】")
print(f"  • 읽기: {len(data['reading'])}문항 (+{len(new_problems['reading'])})")
print(f"  • 쓰기: {len(data['writing'])}문항")

# total 업데이트
new_total = len(data['reading']) + len(data['writing'])
data['total'] = new_total

print(f"  • 합계: {new_total}문항")

print(f"\n【추가된 문제 카테고리별】")
categories = {}
for q in new_problems['reading']:
    cat = q.get('category', '알 수 없음')
    categories[cat] = categories.get(cat, 0) + 1

for cat, count in categories.items():
    print(f"  • {cat}: {count}문항")

# 파일 저장
with open('data/quiz-bank-advanced.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"\n【파일 저장】")
print(f"  • quiz-bank-advanced.json ✅")

print("\n" + "=" * 70)
print("✅ 25문항 추가 완료!")
print("=" * 70)
