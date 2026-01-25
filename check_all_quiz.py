import json

# 기초 난이도
basic = json.load(open('data/quiz-bank-basic.json', 'r', encoding='utf-8'))
basic_count = len(basic.get('questions', []))

# 기본 난이도
standard = json.load(open('data/quiz-bank-standard.json', 'r', encoding='utf-8'))
standard_count = len(standard.get('questions', []))

# 심화 난이도
advanced = json.load(open('data/quiz-bank-advanced.json', 'r', encoding='utf-8'))
advanced_reading = len(advanced.get('reading', []))
advanced_writing = len(advanced.get('writing', []))
advanced_count = advanced_reading + advanced_writing

# 총합
total = basic_count + standard_count + advanced_count

print("=" * 50)
print("📊 점자 마스터 2024 - 문제은행 현황")
print("=" * 50)
print(f"\n【난이도별 문항 수】")
print(f"  • 기초 (Basic):    {basic_count:3d}문항")
print(f"  • 기본 (Standard): {standard_count:3d}문항")
print(f"  • 심화 (Advanced): {advanced_count:3d}문항 (읽기 {advanced_reading}, 쓰기 {advanced_writing})")
print(f"\n【총 문항 수】: {total}문항")
print("=" * 50)

# Auto 파일 확인
basic_auto = json.load(open('data/quiz-bank-basic-auto.json', 'r', encoding='utf-8'))
basic_auto_count = len(basic_auto.get('questions', []))

standard_auto = json.load(open('data/quiz-bank-standard-auto.json', 'r', encoding='utf-8'))
standard_auto_count = len(standard_auto.get('questions', []))

advanced_auto = json.load(open('data/quiz-bank-advanced-auto.json', 'r', encoding='utf-8'))
advanced_auto_reading = len(advanced_auto.get('reading', []))
advanced_auto_writing = len(advanced_auto.get('writing', []))
advanced_auto_count = advanced_auto_reading + advanced_auto_writing

auto_total = basic_auto_count + standard_auto_count + advanced_auto_count

print(f"\n【자동 생성 문항 (Auto)】")
print(f"  • 기초-Auto:    {basic_auto_count:3d}문항")
print(f"  • 기본-Auto:    {standard_auto_count:3d}문항")
print(f"  • 심화-Auto:    {advanced_auto_count:3d}문항 (읽기 {advanced_auto_reading}, 쓰기 {advanced_auto_writing})")
print(f"\n【Auto 총 문항 수】: {auto_total}문항")
print("=" * 50)
print(f"\n【전체 문항 수 (수동+자동)】: {total + auto_total}문항")
print("=" * 50)
