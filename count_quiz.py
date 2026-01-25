import json

data = json.load(open('data/quiz-bank-advanced.json', 'r', encoding='utf-8'))
reading = len(data.get('reading', []))
writing = len(data.get('writing', []))
total = reading + writing

print(f'읽기 퀴즈: {reading}개')
print(f'쓰기 퀴즈: {writing}개')
print(f'총합: {total}개')
print(f'total 필드: {data.get("total", "N/A")}')
