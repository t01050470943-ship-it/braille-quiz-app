import json
import re

# 파일 로드
with open('data/quiz-bank-advanced.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# 문장부호 카테고리 문제 찾기
punctuation_problems = []
for idx, q in enumerate(data.get('reading', [])):
    category = q.get('category', '')
    if '문장부호' in category or category == '문장부호':
        punctuation_problems.append({
            'index': idx,
            'id': q.get('id'),
            'question': q.get('question', ''),
            'category': category
        })

print(f"총 {len(punctuation_problems)}개의 문장부호 카테고리 문제 발견:\n")
for p in punctuation_problems[:20]:  # 처음 20개만 출력
    print(f"  [{p['id']}] {p['question']} (카테고리: {p['category']})")

if len(punctuation_problems) > 20:
    print(f"\n... 외 {len(punctuation_problems) - 20}개 더")
