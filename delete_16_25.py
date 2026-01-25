import json

# 심화 난이도 파일 읽기
data = json.load(open('data/quiz-bank-advanced.json', 'r', encoding='utf-8'))

# 삭제할 문제 ID (16~25번)
problems_to_delete_ids = [
    'punct_016', 'punct_017', 'punct_018', 'punct_019', 'punct_020',  # 약어
    'punct_021', 'punct_022', 'punct_023', 'punct_024', 'punct_025'   # 복합부호
]

print("=" * 70)
print("🗑️  새로 추가한 문제 중 16~25번 삭제")
print("=" * 70)

# 삭제 전 확인
original_reading = len(data['reading'])

# 삭제할 문제 찾기
to_delete = []
for q in data['reading']:
    if q.get('id') in problems_to_delete_ids:
        to_delete.append(q)

print(f"\n【삭제 전】")
print(f"  • 읽기: {original_reading}문항")

print(f"\n【삭제 대상】 {len(to_delete)}문항")
for i, q in enumerate(to_delete, 1):
    print(f"  {i:2d}. {q['question']:35s} - {q.get('category', '')}")

# 삭제 실행
data['reading'] = [q for q in data['reading'] if q.get('id') not in problems_to_delete_ids]

print(f"\n【삭제 후】")
print(f"  • 읽기: {len(data['reading'])}문항")
print(f"  • 삭제됨: {len(to_delete)}문항")

# total 업데이트
new_total = len(data['reading']) + len(data['writing'])
data['total'] = new_total

print(f"  • 새 total: {new_total}")

# 파일 저장
with open('data/quiz-bank-advanced.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"\n【파일 저장】")
print(f"  • quiz-bank-advanced.json ✅")

print("\n" + "=" * 70)
print(f"✅ {len(to_delete)}문항 삭제 완료!")
print("=" * 70)
