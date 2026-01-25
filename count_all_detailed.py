import json

# 기초 난이도
basic = json.load(open('data/quiz-bank-basic.json', 'r', encoding='utf-8'))
basic_reading = len(basic.get('reading', []))
basic_writing = len(basic.get('writing', []))
basic_total = basic_reading + basic_writing

# 기본 난이도
standard = json.load(open('data/quiz-bank-standard.json', 'r', encoding='utf-8'))
standard_reading = len(standard.get('reading', []))
standard_writing = len(standard.get('writing', []))
standard_total = standard_reading + standard_writing

# 심화 난이도
advanced = json.load(open('data/quiz-bank-advanced.json', 'r', encoding='utf-8'))
advanced_reading = len(advanced.get('reading', []))
advanced_writing = len(advanced.get('writing', []))
advanced_total = advanced_reading + advanced_writing

# 총합
total_reading = basic_reading + standard_reading + advanced_reading
total_writing = basic_writing + standard_writing + advanced_writing
total = total_reading + total_writing

print("=" * 60)
print("📚 점자 마스터 2024 - 퀴즈은행 전체 현황")
print("=" * 60)
print()
print("【난이도별 상세 현황】")
print()
print(f"✅ 기초 (Basic)")
print(f"   • 읽기: {basic_reading:3d}문항")
print(f"   • 쓰기: {basic_writing:3d}문항")
print(f"   • 합계: {basic_total:3d}문항")
print()
print(f"✅ 기본 (Standard)")
print(f"   • 읽기: {standard_reading:3d}문항")
print(f"   • 쓰기: {standard_writing:3d}문항")
print(f"   • 합계: {standard_total:3d}문항")
print()
print(f"✅ 심화 (Advanced)")
print(f"   • 읽기: {advanced_reading:3d}문항")
print(f"   • 쓰기: {advanced_writing:3d}문항")
print(f"   • 합계: {advanced_total:3d}문항")
print()
print("=" * 60)
print("【전체 총계】")
print(f"   • 총 읽기 문항: {total_reading:3d}문항")
print(f"   • 총 쓰기 문항: {total_writing:3d}문항")
print(f"   • 총 문항 수:   {total:3d}문항")
print("=" * 60)
