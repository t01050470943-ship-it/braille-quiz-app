import json

# 새로운 문제 25개 생성
new_problems = {
    "reading": [
        # 큰따옴표 - 인용문 (8문항)
        {
            "id": "punct_001",
            "question": "\"안녕하세요\"",
            "answer": "\"안녕하세요\"",
            "braille": [],
            "dots": [],
            "clause": "제49항",
            "category": "큰따옴표_인용",
            "difficulty": "어려움",
            "hint": "큰따옴표로 감싼 인용문",
            "verified": False
        },
        {
            "id": "punct_002",
            "question": "\"감사합니다\"",
            "answer": "\"감사합니다\"",
            "braille": [],
            "dots": [],
            "clause": "제49항",
            "category": "큰따옴표_인용",
            "difficulty": "어려움",
            "hint": "큰따옴표로 감싼 인용문",
            "verified": False
        },
        {
            "id": "punct_003",
            "question": "그는 \"네\"라고 대답했다.",
            "answer": "그는 \"네\"라고 대답했다.",
            "braille": [],
            "dots": [],
            "clause": "제49항",
            "category": "큰따옴표_인용",
            "difficulty": "어려움",
            "hint": "문장 속 인용문",
            "verified": False
        },
        {
            "id": "punct_004",
            "question": "\"정말요?\" 물었다.",
            "answer": "\"정말요?\" 물었다.",
            "braille": [],
            "dots": [],
            "clause": "제49항",
            "category": "큰따옴표_인용",
            "difficulty": "어려움",
            "hint": "인용문+물음표",
            "verified": False
        },
        {
            "id": "punct_005",
            "question": "\"좋습니다!\"",
            "answer": "\"좋습니다!\"",
            "braille": [],
            "dots": [],
            "clause": "제49항",
            "category": "큰따옴표_인용",
            "difficulty": "어려움",
            "hint": "인용문+느낌표",
            "verified": False
        },
        {
            "id": "punct_006",
            "question": "선생님은 \"공부하세요\"라고 말했다.",
            "answer": "선생님은 \"공부하세요\"라고 말했다.",
            "braille": [],
            "dots": [],
            "clause": "제49항",
            "category": "큰따옴표_인용",
            "difficulty": "어려움",
            "hint": "긴 문장 속 인용문",
            "verified": False
        },
        {
            "id": "punct_007",
            "question": "\"어디 가니?\"",
            "answer": "\"어디 가니?\"",
            "braille": [],
            "dots": [],
            "clause": "제49항",
            "category": "큰따옴표_인용",
            "difficulty": "어려움",
            "hint": "인용문 물음표",
            "verified": False
        },
        {
            "id": "punct_008",
            "question": "\"책을 읽어라\"",
            "answer": "\"책을 읽어라\"",
            "braille": [],
            "dots": [],
            "clause": "제49항",
            "category": "큰따옴표_인용",
            "difficulty": "어려움",
            "hint": "명령문 인용",
            "verified": False
        },
        # 작은따옴표 - 준말/강조 (7문항)
        {
            "id": "punct_009",
            "question": "'석탑'",
            "answer": "'석탑'",
            "braille": [],
            "dots": [],
            "clause": "제49항",
            "category": "작은따옴표_준말",
            "difficulty": "어려움",
            "hint": "작은따옴표 강조",
            "verified": False
        },
        {
            "id": "punct_010",
            "question": "'국보'",
            "answer": "'국보'",
            "braille": [],
            "dots": [],
            "clause": "제49항",
            "category": "작은따옴표_준말",
            "difficulty": "어려움",
            "hint": "작은따옴표 강조",
            "verified": False
        },
        {
            "id": "punct_011",
            "question": "'서울역'",
            "answer": "'서울역'",
            "braille": [],
            "dots": [],
            "clause": "제49항",
            "category": "작은따옴표_준말",
            "difficulty": "어려움",
            "hint": "작은따옴표 강조",
            "verified": False
        },
        {
            "id": "punct_012",
            "question": "'한글날'",
            "answer": "'한글날'",
            "braille": [],
            "dots": [],
            "clause": "제49항",
            "category": "작은따옴표_준말",
            "difficulty": "어려움",
            "hint": "작은따옴표 강조",
            "verified": False
        },
        {
            "id": "punct_013",
            "question": "'독도'",
            "answer": "'독도'",
            "braille": [],
            "dots": [],
            "clause": "제49항",
            "category": "작은따옴표_준말",
            "difficulty": "어려움",
            "hint": "작은따옴표 강조",
            "verified": False
        },
        {
            "id": "punct_014",
            "question": "'무궁화'",
            "answer": "'무궁화'",
            "braille": [],
            "dots": [],
            "clause": "제49항",
            "category": "작은따옴표_준말",
            "difficulty": "어려움",
            "hint": "작은따옴표 강조",
            "verified": False
        },
        {
            "id": "punct_015",
            "question": "'태극기'",
            "answer": "'태극기'",
            "braille": [],
            "dots": [],
            "clause": "제49항",
            "category": "작은따옴표_준말",
            "difficulty": "어려움",
            "hint": "작은따옴표 강조",
            "verified": False
        },
        # 약어 대문자 (5문항)
        {
            "id": "punct_016",
            "question": "UNESCO",
            "answer": "UNESCO",
            "braille": [],
            "dots": [],
            "clause": "제29항",
            "category": "약어_대문자",
            "difficulty": "어려움",
            "hint": "국제기구 약어",
            "verified": False
        },
        {
            "id": "punct_017",
            "question": "NATO",
            "answer": "NATO",
            "braille": [],
            "dots": [],
            "clause": "제29항",
            "category": "약어_대문자",
            "difficulty": "어려움",
            "hint": "국제기구 약어",
            "verified": False
        },
        {
            "id": "punct_018",
            "question": "WHO",
            "answer": "WHO",
            "braille": [],
            "dots": [],
            "clause": "제29항",
            "category": "약어_대문자",
            "difficulty": "어려움",
            "hint": "세계보건기구 약어",
            "verified": False
        },
        {
            "id": "punct_019",
            "question": "UN",
            "answer": "UN",
            "braille": [],
            "dots": [],
            "clause": "제29항",
            "category": "약어_대문자",
            "difficulty": "어려움",
            "hint": "국제연합 약어",
            "verified": False
        },
        {
            "id": "punct_020",
            "question": "UNICEF",
            "answer": "UNICEF",
            "braille": [],
            "dots": [],
            "clause": "제29항",
            "category": "약어_대문자",
            "difficulty": "어려움",
            "hint": "유니세프 약어",
            "verified": False
        },
        # 복합 부호 (5문항)
        {
            "id": "punct_021",
            "question": "《한국사》",
            "answer": "《한국사》",
            "braille": [],
            "dots": [],
            "clause": "제49항",
            "category": "복합부호",
            "difficulty": "어려움",
            "hint": "책 이름 표기",
            "verified": False
        },
        {
            "id": "punct_022",
            "question": "『논어』",
            "answer": "『논어』",
            "braille": [],
            "dots": [],
            "clause": "제49항",
            "category": "복합부호",
            "difficulty": "어려움",
            "hint": "책 이름 표기",
            "verified": False
        },
        {
            "id": "punct_023",
            "question": "제1장, 제2절",
            "answer": "제1장, 제2절",
            "braille": [],
            "dots": [],
            "clause": "제49항",
            "category": "복합부호",
            "difficulty": "어려움",
            "hint": "장절 표기",
            "verified": False
        },
        {
            "id": "punct_024",
            "question": "(가), (나), (다)",
            "answer": "(가), (나), (다)",
            "braille": [],
            "dots": [],
            "clause": "제49항",
            "category": "복합부호",
            "difficulty": "어려움",
            "hint": "항목 표기",
            "verified": False
        },
        {
            "id": "punct_025",
            "question": "①, ②, ③",
            "answer": "①, ②, ③",
            "braille": [],
            "dots": [],
            "clause": "제49항",
            "category": "복합부호",
            "difficulty": "어려움",
            "hint": "번호 표기",
            "verified": False
        }
    ]
}

print("=" * 70)
print("📝 새로운 문제 25개 생성 완료")
print("=" * 70)

print("\n【생성된 문제 목록】\n")
for i, q in enumerate(new_problems["reading"], 1):
    print(f"{i:2d}. {q['question']:35s} | {q['category']:15s} | {q['clause']}")

print("\n" + "=" * 70)
print(f"✅ 총 {len(new_problems['reading'])}문항 생성됨")
print("=" * 70)

# JSON 파일로 저장
with open('new_problems_25.json', 'w', encoding='utf-8') as f:
    json.dump(new_problems, f, ensure_ascii=False, indent=2)

print("\n📁 파일 저장: new_problems_25.json")
