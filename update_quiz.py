import json
import re

# JSON 파일 로드
with open(r'C:\Users\FORYOUCOM\Desktop\점자 학습\data\quiz-bank-advanced.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# 영어+숫자 문제 찾기 및 삭제
reading_original = data['reading']
reading_filtered = [q for q in reading_original if not re.search(r'[a-zA-Z]+[0-9]|[0-9]+[a-zA-Z]', q['question'])]

print(f'Original: {len(reading_original)} questions')
print(f'After removing mixed: {len(reading_filtered)} questions')
print(f'Removed: {len(reading_original) - len(reading_filtered)} questions')

# 순수 영어 문제 50개 생성
english_words = {
    'lowercase': [
        'book', 'happy', 'moon', 'purple', 'tea', 'welcome',
        'apple', 'banana', 'cat', 'dog', 'elephant', 'flower',
        'garden', 'house', 'island', 'jungle', 'king', 'lemon',
        'music', 'night', 'ocean', 'pencil', 'queen', 'river',
        'stars', 'tree', 'umbrella', 'violin', 'winter'
    ],
    'mixed': [
        'Hello', 'World', 'Thank', 'Love', 'Peace',
        'Nature', 'Beauty', 'Dream', 'Friend', 'Golden',
        'Magic', 'Rainbow', 'Smile', 'United', 'Victory'
    ],
    'uppercase': [
        'KOREA', 'ABC', 'SEOUL', 'NEW YORK', 'LONDON', 'TOKYO'
    ]
}

new_questions = []
current_id = 200  # 새 ID 시작

# 소문자 단어 추가
for word in english_words['lowercase']:
    new_questions.append({
        "id": f"eng_{current_id:03d}",
        "question": word,
        "answer": word,
        "braille": [],
        "dots": [],
        "clause": "제28항",
        "category": "로마자_소문자",
        "difficulty": "어려움",
        "hint": "로마자 소문자",
        "verified": True
    })
    current_id += 1

# 대문자+소문자 단어 추가
for word in english_words['mixed']:
    new_questions.append({
        "id": f"eng_{current_id:03d}",
        "question": word,
        "answer": word,
        "braille": [],
        "dots": [],
        "clause": "제29항",
        "category": "로마자_표지",
        "difficulty": "어려움",
        "hint": "로마자 표지",
        "verified": True
    })
    current_id += 1

# 대문자 단어 추가
for word in english_words['uppercase']:
    new_questions.append({
        "id": f"eng_{current_id:03d}",
        "question": word,
        "answer": word,
        "braille": [],
        "dots": [],
        "clause": "제29항",
        "category": "로마자_표지",
        "difficulty": "어려움",
        "hint": "로마자 표지",
        "verified": True
    })
    current_id += 1

print(f'Created: {len(new_questions)} new English questions')

# 영어 문제만 업데이트 (다른 문제는 유지)
data['reading'] = reading_filtered + new_questions
data['total'] = len(data['reading'])

# 파일 저장
with open(r'C:\Users\FORYOUCOM\Desktop\점자 학습\data\quiz-bank-advanced.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f'Final total: {data["total"]} questions')
print('Done!')
