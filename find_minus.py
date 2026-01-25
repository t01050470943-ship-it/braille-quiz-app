import json

# 파일 로드
with open('data/quiz-bank-advanced.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# - 기호가 포함된 문제 찾기
problems_with_minus = []
for idx, q in enumerate(data.get('reading', [])):
    if '-' in q.get('question', ''):
        problems_with_minus.append({
            'index': idx,
            'id': q.get('id'),
            'question': q.get('question'),
            'category': q.get('category')
        })

print(f"총 {len(problems_with_minus)}개의 '-' 포함 문제 발견:\n")
for p in problems_with_minus:
    print(f"  [{p['id']}] {p['question']} (카테고리: {p['category']})")
