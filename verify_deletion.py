import json

# 심화 난이도 파일 읽기
data = json.load(open('data/quiz-bank-advanced.json', 'r', encoding='utf-8'))

# 남아있는 문장부호 관련 문제 확인
print("=" * 70)
print("📊 삭제 후 남은 문장부호 관련 문제")
print("=" * 70)

# 제43항 문제 확인
clause_43_reading = [q for q in data.get('reading', []) if q.get('clause') == '제43항']
clause_43_writing = [q for q in data.get('writing', []) if q.get('clause') == '제43항']

print(f"\n【제43항 (수표 재사용)】")
print(f"  • 읽기: {len(clause_43_reading)}문항")
print(f"  • 쓰기: {len(clause_43_writing)}문항")

if clause_43_reading:
    print(f"\n  읽기 문제:")
    for i, q in enumerate(clause_43_reading, 1):
        print(f"    {i}. {q['question']}")

if clause_43_writing:
    print(f"\n  쓰기 문제:")
    for i, q in enumerate(clause_43_writing, 1):
        print(f"    {i}. {q['question']}")

# 제49항 문제 확인
clause_49_reading = [q for q in data.get('reading', []) if q.get('clause') == '제49항']
clause_49_writing = [q for q in data.get('writing', []) if q.get('clause') == '제49항']

print(f"\n【제49항 (문장부호)】")
print(f"  • 읽기: {len(clause_49_reading)}문항")
print(f"  • 쓰기: {len(clause_49_writing)}문항")

print("\n" + "=" * 70)
