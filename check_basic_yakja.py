import json

# 기초 난이도 파일 읽기
data = json.load(open('data/quiz-bank-basic.json', 'r', encoding='utf-8'))

# 제13항(약자) 문항만 필터링
yakja_questions = [q for q in data.get('reading', []) if q.get('clause') == '제13항']

print("=" * 60)
print("📝 기초 난이도 - 제13항 약자 문항 목록")
print("=" * 60)
print(f"\n총 {len(yakja_questions)}문항\n")

for i, q in enumerate(yakja_questions, 1):
    print(f"{i:2d}. {q['question']:10s} - {q.get('category', '')} - {q.get('hint', '')}")

print("\n" + "=" * 60)

# 조항별 통계
print("\n【기초 난이도 조항별 통계】\n")
clauses = {}
for q in data.get('reading', []):
    clause = q.get('clause', '알 수 없음')
    clauses[clause] = clauses.get(clause, 0) + 1

for clause in sorted(clauses.keys()):
    print(f"  {clause}: {clauses[clause]:3d}문항")

print("\n" + "=" * 60)
