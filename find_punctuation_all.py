import json
import re

# 심화 난이도 파일 읽기
data = json.load(open('data/quiz-bank-advanced.json', 'r', encoding='utf-8'))

# 문장부호 패턴 정의
punctuation_pattern = r'[.,!?;:\-·]'

# 읽기 문제에서 문장부호 포함된 문제 찾기
reading_with_punct = []
for q in data.get('reading', []):
    question = q.get('question', '')
    if re.search(punctuation_pattern, question):
        reading_with_punct.append(q)

# 쓰기 문제에서 문장부호 포함된 문제 찾기
writing_with_punct = []
for q in data.get('writing', []):
    question = q.get('question', '')
    if re.search(punctuation_pattern, question):
        writing_with_punct.append(q)

print("=" * 80)
print("📌 심화 난이도 - 문장부호 포함 문제 전체 목록")
print("=" * 80)

print(f"\n【읽기 퀴즈】 총 {len(reading_with_punct)}문항\n")
for i, q in enumerate(reading_with_punct, 1):
    clause = q.get('clause', '')
    category = q.get('category', '')
    question = q.get('question', '')
    print(f"{i:3d}. {question:30s} | {clause:15s} | {category}")

print(f"\n{'=' * 80}")
print(f"\n【쓰기 퀴즈】 총 {len(writing_with_punct)}문항\n")
for i, q in enumerate(writing_with_punct, 1):
    clause = q.get('clause', '')
    category = q.get('category', '')
    question = q.get('question', '')
    print(f"{i:3d}. {question:30s} | {clause:15s} | {category}")

print(f"\n{'=' * 80}")
print(f"\n【총계】 읽기 {len(reading_with_punct)}문항 + 쓰기 {len(writing_with_punct)}문항 = {len(reading_with_punct) + len(writing_with_punct)}문항")
print("=" * 80)

# 조항별 분류
print(f"\n【조항별 분류】\n")
clause_reading = {}
for q in reading_with_punct:
    clause = q.get('clause', '알 수 없음')
    if clause not in clause_reading:
        clause_reading[clause] = []
    clause_reading[clause].append(q['question'])

clause_writing = {}
for q in writing_with_punct:
    clause = q.get('clause', '알 수 없음')
    if clause not in clause_writing:
        clause_writing[clause] = []
    clause_writing[clause].append(q['question'])

print("📖 읽기:")
for clause in sorted(clause_reading.keys()):
    print(f"\n  {clause} ({len(clause_reading[clause])}문항):")
    for i, q in enumerate(clause_reading[clause], 1):
        print(f"    {i:2d}. {q}")

print("\n✍️ 쓰기:")
for clause in sorted(clause_writing.keys()):
    print(f"\n  {clause} ({len(clause_writing[clause])}문항):")
    for i, q in enumerate(clause_writing[clause], 1):
        print(f"    {i:2d}. {q}")

print("\n" + "=" * 80)
