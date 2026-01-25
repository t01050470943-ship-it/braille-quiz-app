import json

# 파일 로드
with open('data/quiz-bank-advanced.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# 문장부호만 있는 문제 찾기 (특수문자만으로 구성)
punctuation_only = []
for idx, q in enumerate(data.get('reading', [])):
    question = q.get('question', '').strip()
    # 한글, 영문, 숫자가 없고 특수문자나 공백만 있는 경우
    if question and not any(c.isalnum() or '\uac00' <= c <= '\ud7a3' for c in question):
        punctuation_only.append({
            'index': idx,
            'id': q.get('id'),
            'question': question,
            'category': q.get('category')
        })

print(f"총 {len(punctuation_only)}개의 문장부호 단독 문제 발견:\n")
for p in punctuation_only:
    print(f"  [{p['id']}] '{p['question']}' (카테고리: {p['category']})")
