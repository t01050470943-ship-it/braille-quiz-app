import json

# 파일 읽기
basic = json.load(open('data/quiz-bank-basic.json', 'r', encoding='utf-8'))
standard = json.load(open('data/quiz-bank-standard.json', 'r', encoding='utf-8'))

print("=" * 70)
print("🔄 약자 문제 이동 작업 - 기초 → 기본")
print("=" * 70)

# 1. 기초에서 제13항 약자 문제 추출
yakja_questions = [q for q in basic.get('reading', []) if q.get('clause') == '제13항']
other_questions = [q for q in basic.get('reading', []) if q.get('clause') != '제13항']

print(f"\n【1단계】 기초 파일에서 제13항 약자 문제 추출")
print(f"  • 약자 문제: {len(yakja_questions)}문항")
print(f"  • 나머지: {len(other_questions)}문항")

print(f"\n  추출된 약자 문제:")
for i, q in enumerate(yakja_questions, 1):
    print(f"    {i:2d}. {q['question']}")

# 2. 기본에 약자 문제 추가
print(f"\n【2단계】 기본 파일에 약자 문제 추가")
print(f"  • 기존 기본 읽기 문항: {len(standard.get('reading', []))}문항")

# reading 배열에 약자 문제 추가
standard['reading'].extend(yakja_questions)

print(f"  • 추가 후: {len(standard.get('reading', []))}문항 (+{len(yakja_questions)})")

# 3. 기초에서 약자 문제 제거
print(f"\n【3단계】 기초 파일에서 약자 문제 제거")
print(f"  • 기존 기초 읽기 문항: {len(basic.get('reading', []))}문항")

basic['reading'] = other_questions

print(f"  • 제거 후: {len(basic.get('reading', []))}문항 (-{len(yakja_questions)})")

# 4. total 필드 업데이트
basic_total = len(basic.get('reading', [])) + len(basic.get('writing', []))
standard_total = len(standard.get('reading', [])) + len(standard.get('writing', []))

basic['total'] = basic_total
standard['total'] = standard_total

print(f"\n【4단계】 total 필드 업데이트")
print(f"  • 기초 total: {basic['total']}")
print(f"  • 기본 total: {standard['total']}")

# 5. 파일 저장
with open('data/quiz-bank-basic.json', 'w', encoding='utf-8') as f:
    json.dump(basic, f, ensure_ascii=False, indent=2)

with open('data/quiz-bank-standard.json', 'w', encoding='utf-8') as f:
    json.dump(standard, f, ensure_ascii=False, indent=2)

print(f"\n【5단계】 파일 저장 완료")
print(f"  • quiz-bank-basic.json ✅")
print(f"  • quiz-bank-standard.json ✅")

print("\n" + "=" * 70)
print("✅ 작업 완료!")
print("=" * 70)
