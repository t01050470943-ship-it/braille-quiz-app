import json

# 파일 로드
with open('data/quiz-bank-advanced.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# 삭제할 ID 목록
ids_to_remove = ['auto_042', 'auto_044']

# reading 배열에서 삭제
original_count = len(data.get('reading', []))
data['reading'] = [q for q in data.get('reading', []) if q.get('id') not in ids_to_remove]
new_count = len(data['reading'])

# total 필드 업데이트
data['total'] = new_count

# 저장
with open('data/quiz-bank-advanced.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"삭제 완료: {original_count}개 → {new_count}개 ({original_count - new_count}개 삭제)")
print(f"삭제된 ID: {', '.join(ids_to_remove)}")
