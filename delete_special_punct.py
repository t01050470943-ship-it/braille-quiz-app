import json

# 심화 난이도 파일 읽기
data = json.load(open('data/quiz-bank-advanced.json', 'r', encoding='utf-8'))

# 삭제할 문제 목록
problems_to_delete = [
    '99.9%',
    '3·1 운동',
    '2:1',
    '3:2',
    '10:5',
    '1-2',
    '5-3',
    '6-2=4'
]

print("=" * 70)
print("🗑️  심화 난이도 - 특수 부호 문제 삭제 작업")
print("=" * 70)

# 읽기 문제 처리
original_reading = len(data.get('reading', []))
reading_before = data['reading'].copy()

# 삭제할 문제 찾기
reading_to_remove = []
for q in data['reading']:
    if q['question'] in problems_to_delete:
        reading_to_remove.append(q)

# 삭제 실행
data['reading'] = [q for q in data['reading'] if q['question'] not in problems_to_delete]

print(f"\n【읽기 퀴즈】")
print(f"  • 삭제 전: {original_reading}문항")
print(f"  • 삭제됨: {len(reading_to_remove)}문항")
print(f"  • 삭제 후: {len(data['reading'])}문항")

if reading_to_remove:
    print(f"\n  삭제된 문제:")
    for i, q in enumerate(reading_to_remove, 1):
        print(f"    {i}. {q['question']:20s} - {q.get('clause', '')}")

# 쓰기 문제 처리
original_writing = len(data.get('writing', []))
writing_before = data['writing'].copy()

# 삭제할 문제 찾기
writing_to_remove = []
for q in data['writing']:
    if q['question'] in problems_to_delete:
        writing_to_remove.append(q)

# 삭제 실행
data['writing'] = [q for q in data['writing'] if q['question'] not in problems_to_delete]

print(f"\n【쓰기 퀴즈】")
print(f"  • 삭제 전: {original_writing}문항")
print(f"  • 삭제됨: {len(writing_to_remove)}문항")
print(f"  • 삭제 후: {len(data['writing'])}문항")

if writing_to_remove:
    print(f"\n  삭제된 문제:")
    for i, q in enumerate(writing_to_remove, 1):
        print(f"    {i}. {q['question']:20s} - {q.get('clause', '')}")

# total 필드 업데이트
new_total = len(data['reading']) + len(data['writing'])
old_total = data.get('total', 0)
data['total'] = new_total

print(f"\n【total 필드 업데이트】")
print(f"  • 이전: {old_total}")
print(f"  • 현재: {new_total}")
print(f"  • 변화: -{old_total - new_total}")

# 파일 저장
with open('data/quiz-bank-advanced.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"\n【파일 저장】")
print(f"  • quiz-bank-advanced.json ✅")

print("\n" + "=" * 70)
print(f"✅ 삭제 완료! 총 {len(reading_to_remove) + len(writing_to_remove)}문항 제거됨")
print("=" * 70)
