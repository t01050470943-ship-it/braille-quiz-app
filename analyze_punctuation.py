import json

# 심화 난이도 파일 읽기
data = json.load(open('data/quiz-bank-advanced.json', 'r', encoding='utf-8'))

# 제49항(문장부호) 문항 필터링
reading_punctuation = [q for q in data.get('reading', []) if q.get('clause') == '제49항']
writing_punctuation = [q for q in data.get('writing', []) if q.get('clause') == '제49항']

print("=" * 70)
print("📌 심화 난이도 - 제49항 문장부호 문제 전수조사")
print("=" * 70)

print(f"\n【읽기 퀴즈】- 총 {len(reading_punctuation)}문항\n")
for i, q in enumerate(reading_punctuation, 1):
    print(f"{i:2d}. ID: {q['id']:15s} | 문제: {q['question']:20s} | 카테고리: {q.get('category', '')}")

print(f"\n【쓰기 퀴즈】- 총 {len(writing_punctuation)}문항\n")
for i, q in enumerate(writing_punctuation, 1):
    print(f"{i:2d}. ID: {q['id']:15s} | 문제: {q['question']:20s} | 카테고리: {q.get('category', '')}")

print("\n" + "=" * 70)
print(f"【총계】 읽기 {len(reading_punctuation)}문항 + 쓰기 {len(writing_punctuation)}문항 = {len(reading_punctuation) + len(writing_punctuation)}문항")
print("=" * 70)

# 전체 심화 문제 조항별 통계
print("\n【심화 난이도 전체 조항별 통계】\n")
reading_clauses = {}
for q in data.get('reading', []):
    clause = q.get('clause', '알 수 없음')
    reading_clauses[clause] = reading_clauses.get(clause, 0) + 1

writing_clauses = {}
for q in data.get('writing', []):
    clause = q.get('clause', '알 수 없음')
    writing_clauses[clause] = writing_clauses.get(clause, 0) + 1

print("📖 읽기:")
for clause in sorted(reading_clauses.keys()):
    print(f"  {clause}: {reading_clauses[clause]:3d}문항")

print("\n✍️ 쓰기:")
for clause in sorted(writing_clauses.keys()):
    print(f"  {clause}: {writing_clauses[clause]:3d}문항")

print("\n" + "=" * 70)
