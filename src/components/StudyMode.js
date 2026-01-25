/**
 * 점자 마스터 2024 - 학습 모드 UI
 * 
 * 제1항~제49항 규정 라이브러리 시각화
 */

import BrailleUtils from '../engine/BrailleUtils.js';

class StudyMode {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      throw new Error(`컨테이너를 찾을 수 없습니다: ${containerId}`);
    }

    this.rulesData = this.initializeRulesData();
    this.selectedCategory = null;
    this.selectedClause = null;

    this.init();
  }

  /**
   * 규정 데이터 초기화
   */
  initializeRulesData() {
    return {
      '자모': {
        title: '제1장 한글 점자 자모',
        clauses: {
          '제1항': {
            title: '첫소리로 쓰인 자음자 (초성)',
            description: '기본 자음자 14개가 첫소리로 쓰일 때에는 다음과 같이 적는다.',
            items: [
              { char: 'ㄱ', dots: [4], name: '기역' },
              { char: 'ㄴ', dots: [1, 4], name: '니은' },
              { char: 'ㄷ', dots: [2, 4], name: '디귿' },
              { char: 'ㄹ', dots: [5], name: '리을' },
              { char: 'ㅁ', dots: [1, 5], name: '미음' },
              { char: 'ㅂ', dots: [4, 5], name: '비읍' },
              { char: 'ㅅ', dots: [6], name: '시옷' },
              { char: 'ㅇ', dots: [], name: '이응 (표기 안 함)' },
              { char: 'ㅈ', dots: [4, 6], name: '지읒' },
              { char: 'ㅊ', dots: [5, 6], name: '치읓' },
              { char: 'ㅋ', dots: [1, 2, 4], name: '키읔' },
              { char: 'ㅌ', dots: [1, 2, 5], name: '티읕' },
              { char: 'ㅍ', dots: [1, 4, 5], name: '피읖' },
              { char: 'ㅎ', dots: [2, 4, 5], name: '히읗' }
            ],
            notes: [
              '[다만 1] ㅇ이 첫소리로 쓰일 때에는 점자로 표기하지 않는다.',
              '[다만 2] 첫소리로 쓰인 ㅇ을 나타내야 할 때에는 1,2,3,4점으로 표기한다.'
            ],
            examples: ['거리', '너비', '두더지', '리코더', '미소', '보리', '셔츠', '저고리', '추수', '커피', '터무니', '피리', '호수'],
            examples2: {
              title: '[다만 1] ㅇ 첫소리 예시',
              words: ['아버지', '야구', '어머니', '여우', '오이', '요리', '우유', '유리', '으스스', '이모', '피아노', '도우미', '러시아']
            }
          },
          '제2항': {
            title: '된소리 표기',
            description: '된소리 글자 "ㄲ, ㄸ, ㅃ, ㅆ, ㅉ"이 첫소리로 쓰일 때에는 "ㄱ, ㄷ, ㅂ, ㅅ, ㅈ" 앞에 된소리표 6을 적어 나타낸다.',
            items: [
              { char: '된소리표', dots: [6], name: '⠠ (6점)' },
              { char: 'ㄲ', dots: [[6], [4]], name: '쌍기역' },
              { char: 'ㄸ', dots: [[6], [2, 4]], name: '쌍디귿' },
              { char: 'ㅃ', dots: [[6], [4, 5]], name: '쌍비읍' },
              { char: 'ㅆ', dots: [[6], [6]], name: '쌍시옷' },
              { char: 'ㅉ', dots: [[6], [4, 6]], name: '쌍지읒' }
            ],
            examples: ['꾸러미', '뚜꺼비', '뚜껑', '허리띠', '뻐꾸기', '꼬삐', '쓰기', '아저씨', '쭈르르', '버찌']
          },
          '제3항': {
            title: '받침으로 쓰인 자음자 (종성)',
            description: '기본 자음자 14개가 받침으로 쓰일 때에는 다음과 같이 적는다.',
            items: [
              { char: 'ㄱ', dots: [1], name: '기역 받침' },
              { char: 'ㄴ', dots: [2, 5], name: '니은 받침' },
              { char: 'ㄷ', dots: [3, 5], name: '디귿 받침' },
              { char: 'ㄹ', dots: [2], name: '리을 받침' },
              { char: 'ㅁ', dots: [2, 6], name: '미음 받침' },
              { char: 'ㅂ', dots: [1, 2], name: '비읍 받침' },
              { char: 'ㅅ', dots: [3], name: '시옷 받침' },
              { char: 'ㅇ', dots: [2, 3, 5, 6], name: '이응 받침' },
              { char: 'ㅈ', dots: [1, 3], name: '지읒 받침' },
              { char: 'ㅊ', dots: [2, 3], name: '치읓 받침' },
              { char: 'ㅋ', dots: [2, 3, 5], name: '키읔 받침' },
              { char: 'ㅌ', dots: [2, 3, 6], name: '티읕 받침' },
              { char: 'ㅍ', dots: [2, 5, 6], name: '피읖 받침' },
              { char: 'ㅎ', dots: [3, 5, 6], name: '히읗 받침' }
            ],
            examples: ['국보', '윤리', '싣고', '놀이', '솜씨', '넙치', '놋그릇', '향기', '엊저녁', '윶놀이', '부엌', '겉보리', '앞집', '히읗']
          },
          '제4항': {
            title: '쌍받침',
            description: '쌍받침 "ㄲ"은 1+1으로 적고, 쌍받침 "ㅆ"은 약자인 3,4으로 적는다.',
            items: [
              { char: 'ㄲ (받침)', dots: [[1], [1]], name: '쌍기역 받침 (1-1점)' },
              { char: 'ㅆ (받침)', dots: [3, 4], name: '쌍시옷 받침 (3,4점 약자)' }
            ],
            examples: ['겪다', '묶음', '있다', '보았다']
          },
          '제5항': {
            title: '겹받침',
            description: '겹받침은 각 받침 글자를 어울러 다음과 같이 적는다.',
            items: [
              { char: 'ㄳ', dots: [[1], [3]], name: 'ㄱ(1)+ㅅ(3)' },
              { char: 'ㄵ', dots: [[2, 5], [1, 3]], name: 'ㄴ(2,5)+ㅈ(1,3)' },
              { char: 'ㄺ', dots: [[2], [1]], name: 'ㄹ(2)+ㄱ(1)' },
              { char: 'ㄻ', dots: [[2], [2, 6]], name: 'ㄹ(2)+ㅁ(2,6)' },
              { char: 'ㄼ', dots: [[2], [1, 2]], name: 'ㄹ(2)+ㅂ(1,2)' }
            ],
            examples: ['품삯', '앉다', '않다', '읽다', '옮기다', '얇다', '외곬', '핥다', '옳다', '없다']
          },
          '제6항': {
            title: '기본 모음자',
            description: '기본 모음자 10개는 다음과 같이 적는다.',
            items: [
              { char: 'ㅏ', dots: [1, 2, 6], name: '아' },
              { char: 'ㅑ', dots: [3, 4, 5], name: '야' },
              { char: 'ㅓ', dots: [2, 3, 4], name: '어' },
              { char: 'ㅕ', dots: [1, 5, 6], name: '여' },
              { char: 'ㅗ', dots: [1, 3, 6], name: '오' },
              { char: 'ㅛ', dots: [3, 5, 6], name: '요' },
              { char: 'ㅜ', dots: [1, 3, 4], name: '우' },
              { char: 'ㅠ', dots: [1, 4, 6], name: '유' },
              { char: 'ㅡ', dots: [2, 4, 6], name: '으' },
              { char: 'ㅣ', dots: [1, 3, 5], name: '이' }
            ],
            examples: ['아리랑', '고양이', '엄지', '무역', '호랑이', '무용', '국수', '법률', '특기', '코끼리']
          },
          '제7항': {
            title: '그 밖의 모음자 (복합 모음)',
            description: '그 밖의 모음자 11개는 다음과 같이 적는다.',
            items: [
              { char: 'ㅐ', dots: [1, 2, 3, 5], name: '애' },
              { char: 'ㅒ', dots: [[3, 4, 5], [1, 2, 3, 5]], name: 'ㅑ+ㅐ' },
              { char: 'ㅔ', dots: [1, 3, 4, 5], name: '에' },
              { char: 'ㅚ', dots: [1, 3, 4, 5, 6], name: '외' },
              { char: 'ㅘ', dots: [1, 2, 3, 6], name: '와' },
              { char: 'ㅙ', dots: [[1, 2, 3, 6], [1, 2, 3, 5]], name: 'ㅘ+ㅐ' },
              { char: 'ㅝ', dots: [1, 2, 3, 4], name: '워' },
              { char: 'ㅞ', dots: [[1, 2, 3, 4], [1, 2, 3, 5]], name: 'ㅝ+ㅐ' },
              { char: 'ㅟ', dots: [[1, 3, 4], [1, 2, 3, 5]], name: 'ㅜ+ㅣ' },
              { char: 'ㅢ', dots: [2, 4, 5, 6], name: '의' }
            ],
            examples: ['매미', '애기', '헤엄', '지혜', '광주리', '쾌활', '피뢰침', '권리', '우렁쉥이', '쉼터', '무늬']
          },
          '제11항': {
            title: '모음자 "예" 가운뎃점',
            description: '모음자에 "예"가 붙어 나올 때에는 그 사이에 구분표 3,6을 적어 나타낸다.',
            items: [
              { char: '구분표(3,6)', dots: [3, 6], name: '⠖ 구분표' }
            ],
            examples: ['아예', '도예', '뭐예요', '서예']
          },
          '제12항': {
            title: '모음자 "애" 구분표',
            description: '"ㅏ, ㅝ, ㅜ, ㅟ"에 "애"가 붙어 나올 때에는 두 모음자 사이에 구분표 3,4를 적어 나타낸다.',
            items: [
              { char: '구분표(3,4)', dots: [3, 4], name: '⠌ 구분표' }
            ],
            examples: ['야애', '소화액', '수액', '파워앤프']
          }
        }
      },
      '약자': {
        title: '제2장 약자와 약어',
        clauses: {
          '제13항': {
            title: '약자 (가~하)',
            description: '다음 글자들은 약자를 사용하여 적는다.',
            items: [
              { char: '가', dots: [1, 2, 4, 6], name: '가' },
              { char: '나', dots: [1, 4], name: '나' },
              { char: '다', dots: [2, 4], name: '다' },
              { char: '마', dots: [1, 5], name: '마' },
              { char: '바', dots: [4, 5], name: '바' },
              { char: '사', dots: [6], name: '사' },
              { char: '자', dots: [4, 6], name: '자' },
              { char: '카', dots: [1, 2, 4], name: '카' },
              { char: '타', dots: [1, 2, 5], name: '타' },
              { char: '파', dots: [1, 4, 5], name: '파' },
              { char: '하', dots: [2, 4, 5], name: '하' }
            ],
            notes: ['[붙임] 위의 글자들에 받침이 있거나 첫소리가 된소리일 때에도 약자를 사용하여 적는다.'],
            examples: ['가지', '나비', '다리미', '라디오', '고구마', '바느질', '사위', '아궁이', '도자기', '기차', '카메라', '실타래', '파도', '하루'],
            examples2: {
              title: '[붙임] 받침/된소리 예시',
              words: ['강산', '낮잠', '단란', '만찬', '안방', '바캉스', '갈비탕', '판소리', '합창', '까마귀', '깜깜하다', '따님', '딱따구리', '오빠', '빵집', '싸구려', '찹쌀', '짜장', '짱구']
            }
          },
          '제14항': {
            title: '약자 예외 규칙',
            description: '"나, 다, 마, 바, 자, 카, 타, 파, 하"에 모음이 붙어 나올 때에는 약자를 사용하지 않는다.',
            notes: [
              '[붙임] "팠"을 적을 때에는 "ㅏ"를 생략하지 않고 적는다.'
            ],
            items: [],
            examples: ['나이', '다음', '마우스', '바위', '자아', '카이로', '넥타이', '파이프', '하얀']
          },
          '제15항': {
            title: '약자 (억~것)',
            description: '다음 글자들은 약자를 사용하여 적는다.',
            items: [
              { char: '억', dots: [1, 4, 5, 6], name: '억' },
              { char: '언', dots: [2, 3, 4, 5, 6], name: '언' },
              { char: '얼', dots: [2, 3, 4, 5], name: '얼' },
              { char: '연', dots: [1, 6], name: '연' },
              { char: '열', dots: [1, 2, 5, 6], name: '열' },
              { char: '영', dots: [1, 2, 4, 5, 6], name: '영' },
              { char: '옥', dots: [1, 3, 4, 6], name: '옥' },
              { char: '온', dots: [1, 2, 3, 5, 6], name: '온' },
              { char: '옹', dots: [1, 2, 3, 4, 5, 6], name: '옹' },
              { char: '운', dots: [1, 2, 4, 5], name: '운' },
              { char: '울', dots: [1, 2, 3, 4, 6], name: '울' },
              { char: '은', dots: [1, 3, 5, 6], name: '은' },
              { char: '을', dots: [2, 3, 4, 6], name: '을' },
              { char: '인', dots: [1, 2, 3, 4, 5], name: '인' },
              { char: '것', dots: [[4, 5, 6], [2, 3, 4]], name: '것' }
            ],
            notes: ['[붙임] 억, 언, 얼, 연, 열, 영, 옥, 온, 옹, 운, 울, 은, 을, 인, 것이 포함되어 있는 글자에도  약자를 사용하여 적는다.'],
            examples: ['억새', '추억', '언어', '격언', '얼룩', '하얼빈', '연필', '자연', '열매', '가열', '여매', '영어', '환영', '옥수수', '가옥', '온도', '오리온', '옹고집', '새옹지마', '운동장', '행운', '울타리', '겨울', '은하수', '양은', '을지로', '가을', '인내', '거인', '것이다', '이것'],
            examples2: {
              title: '[붙임] 포함 예시',
              words: ['덕망', '기적', '꺽다', '넋', '건전지', '개천절', '얹다', '벌레', '옷걸이', '얽다', '젊다', '넓다', '변화', '수련', '별자리', '헌혈', '엷다', '평화', '안녕', '복덕방', '가곡', '볶다', '논두렁', '용돈', '동그라미', '탁구공', '순두부', '숭례문', '불고기', '일출', '붉다', '굶다', '훑다', '근로', '마흔', '끊다', '글씨', '구슬', '긁다', '읊다', '끓다', '진실', '어린이', '하겄다']
            }
          },
          '제16항': {
            title: '된소리 약자',
            description: '"까, 싸, 껏"을 적을 때에는 "가, 사, 것"의 약자 앞에 된소리표를 적어 나타낸다.',
            notes: [
              '[붙임] "꺼"을 적을 때에는 "꺼"와 받침 "ㅆ" 약자를 어울러 적는다.'
            ],
            items: [
              { char: '까', dots: [[6], [1, 2, 4, 6]], name: '된소리표 + 가 약자' },
              { char: '싸', dots: [[6], [6]], name: '된소리표 + 사 약자' },
              { char: '껏', dots: [[6], [4, 5, 6], [2, 3, 4]], name: '된소리표 + 것 약자' }
            ],
            examples: ['까치', '깡충깡충', '싸리나무', '쌍둥이', '힘껏', '마음껏']
          },
          '제17항': {
            title: '약자 (성~청)',
            description: "'성, 썽, 정, 쩡, 청'을 적을 때에는 'ㅅ, ㅆ, ㅈ, ㅉ, ㅊ' 다음에 '영'의 약자 1,2,4,5,6점을 적어 나타낸다.",
            items: [
              { char: '성', dots: [[6], [1, 2, 4, 5, 6]], name: 'ㅅ + 영 약자' },
              { char: '썽', dots: [[6], [6], [1, 2, 4, 5, 6]], name: 'ㅆ + 영 약자' },
              { char: '정', dots: [[4, 6], [1, 2, 4, 5, 6]], name: 'ㅈ + 영 약자' },
              { char: '쩡', dots: [[6], [4, 6], [1, 2, 4, 5, 6]], name: 'ㅉ + 영 약자' },
              { char: '청', dots: [[5, 6], [1, 2, 4, 5, 6]], name: 'ㅊ + 영 약자' }
            ],
            examples: ['성공', '성인', '정말', '청소년']
          },
          '제18항': {
            title: '약어 (접속사)',
            description: '다음 단어들은 약어를 사용하여 적는다.',
            items: [
              { word: '그래서', dots: [[1], [2, 3, 4]], name: '그래서' },
              { word: '그러나', dots: [[1], [1, 4]], name: '그러나' },
              { word: '그러면', dots: [[1], [2, 5]], name: '그러면' },
              { word: '그러므로', dots: [[1], [2, 6]], name: '그러므로' },
              { word: '그런데', dots: [[1], [1, 3, 4, 5]], name: '그런데' },
              { word: '그리고', dots: [[1], [1, 3, 6]], name: '그리고' },
              { word: '그리하여', dots: [[1], [1, 5, 6]], name: '그리하여' }
            ],
            notes: [
              '[붙임] 약어 뒤에 다른 글자가 붙어 나올 때에도 약어를 사용하여 적는다.',
              '[다만] 약어 앞에 다른 글자가 붙어 나올 때에는 약어를 사용하지 않는다.'
            ],
            examples2: {
              title: '[붙임] 약어 뒤에 글자 붙을 때',
              words: ['그래서인지', '그러나저라', '그러면서', '그런데도', '그리하여도', '왜 그러나요', '그리고서']
            },
            examples3: {
              title: '[다만] 약어 앞에 글자 붙을 때 (약어 사용 X)',
              words: ['오그리고', '우그리고', '줼그리고', '폁그리고']
            }
          }
        }
      },
      '로마자': {
        title: '제4장 로마자',
        clauses: {
          '제28항': {
            title: '로마자 소문자',
            description: '로마자는 「통일영어점자 규정(UEB)」에 따라 다음과 같이 적는다.',
            items: [
              { char: 'a', dots: [1], name: 'a' },
              { char: 'b', dots: [1, 2], name: 'b' },
              { char: 'c', dots: [1, 4], name: 'c' },
              { char: 'd', dots: [1, 4, 5], name: 'd' },
              { char: 'e', dots: [1, 5], name: 'e' },
              { char: 'f', dots: [1, 2, 4], name: 'f' },
              { char: 'g', dots: [1, 2, 4, 5], name: 'g' },
              { char: 'h', dots: [1, 2, 5], name: 'h' },
              { char: 'i', dots: [2, 4], name: 'i' },
              { char: 'j', dots: [2, 4, 5], name: 'j' }
            ],
            notes: [
              '[붙임] 로마자가 한 글자만 대문자일 때에는 대문자 기호표 6을 그 앞에 적고, 단어 전체가 대문자이거나 두 글자 이상 연속해서 대문자일 때에는 대문자 단어표 6+6을 그 앞에 적는다. 세 개 이상의 연속된 단어가 모두 대문자일 때에는 첫 단어 앞에 대문자 구절표 6+6+6을 적고, 마지막 단어 뒤에 대문자 종료표 6+3을 적는다.'
            ],
            examples: ['book', 'happy', 'moon', 'purple', 'tea', 'welcome'],
            examples2: {
              title: '[붙임] 대문자 예시',
              words: ['New York', 'NEW YORK', 'McDonald', 'IoT', 'iOS']
            }
          },
          '제29항': {
            title: '로마자 표지',
            description: '국어 문장 안에 로마자가 나올 때에는 그 앞에 로마자표 3,5,6을 적고 그 뒤에 로마자 종료표 2,5,6을 적는다.',
            items: [
              { char: '로마자표', dots: [3, 5, 6], name: '로마자 시작 ⠜' },
              { char: '대문자표(1글자)', dots: [6], name: '대문자 기호 ⠠' },
              { char: '대문자단어표', dots: [[6], [6]], name: '단어 전체 대문자 ⠠⠠' },
              { char: '로마자종료표', dots: [2, 5, 6], name: '로마자 종료 ⠒' }
            ],
            notes: [
              '로마자 시작 시 로마자표(3,5,6) 사용',
              '로마자 종료 시 로마자종료표(2,5,6) 사용',
              '대문자 1글자: 6점, 2글자 이상: 6,6점'
            ],
            examples: ['Hello', 'KOREA', 'ABC']
          }
        }
      },
      '숫자': {
        title: '제5장 숫자',
        clauses: {
          '제40항': {
            title: '숫자 표기',
            description: '숫자는 수표 3,4,5,6을 앞세워 다음과 같이 적는다.',
            items: [
              { char: '수표', dots: [3, 4, 5, 6], name: '수표 ⠙' },
              { char: '1', dots: [1], name: '1' },
              { char: '2', dots: [1, 2], name: '2' },
              { char: '3', dots: [1, 4], name: '3' },
              { char: '4', dots: [1, 4, 5], name: '4' },
              { char: '5', dots: [1, 5], name: '5' },
              { char: '6', dots: [1, 2, 4], name: '6' },
              { char: '7', dots: [1, 2, 4, 5], name: '7' },
              { char: '8', dots: [1, 2, 5], name: '8' },
              { char: '9', dots: [2, 4], name: '9' },
              { char: '0', dots: [2, 4, 5], name: '0' }
            ],
            examples: ['10', '99', '375']
          },
          '제41항': {
            title: '자릿점 표기',
            description: '숫자 사이에 붙어 나오는 쉼표와 자릿점은 2로 적는다.',
            items: [
              { char: '자릿점', dots: [2], name: '2점 (⠂)' },
              { char: '예: 1,000', dots: [[3, 4, 5, 6], [1], [2], [2, 4, 5], [2, 4, 5], [2, 4, 5]], name: '수표 + 1 + 자릿점 + 0 + 0 + 0' }
            ],
            examples: ['1,000', '10,000', '100,000']
          },
          '제43항': {
            title: '수표 재사용',
            description: '가운뎃점(·), 쌍점(:), 붙임표(-), 물결표(~) 등 뒤에는 반드시 수표를 다시 적는다.',
            notes: [
              '[다만] 가운뎃점(·), 쌍점(:), 붙임표(-), 물결표(~) 등 뒤에는 반드시 수표를 다시 적는다.'
            ],
            items: [
              { char: '예: 3·1', dots: [[3, 4, 5, 6], [1, 4], [4, 5, 6], [3, 4, 5, 6], [1]], name: '수표 + 3 + 가운뎃점 + 수표 + 1' }
            ],
            examples: ['3·1 운동', '2:1', '1-2']
          },
          '제44항': {
            title: '숫자 뒤 띄어쓰기',
            description: '숫자 뒤에 이어 나오는 한글의 띄어쓰기는 묵자를 따른다.',
            notes: [
              '[다만] 숫자와 혼동되는 "ㄴ, ㄷ, ㅁ, ㅋ, ㅌ, ㅍ, ㅎ"의 첫소리 글자와 "운"의 약자는 숫자 뒤에 붙어 나오더라도 숫자와 한글을 띄어 썼다.'
            ],
            items: [],
            examples: ['1가', '2권', '3반', '4선', '5월', '6일', '7자루', '8꾸러미', '5 개', '8 상자'],
            examples2: {
              title: '[다만] 혼동 방지 띄어쓰기',
              words: ['1년', '2도', '3명', '4칸', '5톤', '6평', '7항', '5운6기']
            }
          }
        }
      },
      '부호': {
        title: '제6장 문장 부호',
        clauses: {
          '제49항': {
            title: '문장 부호',
            description: '문장 부호는 다음과 같이 적는다. 띄어쓰기는 묵자를 따르되, 「한글 맞춤법」의 [부록] 문장 부호의 규정을 준수한다.',
            items: [
              { char: '.', dots: [2, 5, 6], name: '마침표' },
              { char: '?', dots: [2, 3, 6], name: '물음표' },
              { char: '!', dots: [2, 3, 5], name: '느낌표' },
              { char: ',', dots: [5], name: '쉼표' },
              { char: '\u201C', dots: [2, 3, 6], name: '여는 큰따옴표' },
              { char: '\u201D', dots: [3, 5, 6], name: '닫는 큰따옴표' },
              { char: '\u2018', dots: [[6], [2, 3, 6]], name: '여는 작은따옴표' },
              { char: '\u2019', dots: [[3, 5, 6], [3]], name: '닫는 작은따옴표' }
            ],
            examples: ['안녕하세요.', '무엇?', '와!', '사과, 배, 포도']
          }
        }
      }
    };
  }

  /**
   * 초기화
   */
  init() {
    this.render();
  }

  /**
   * 메인 UI 렌더링
   */
  render() {
    this.container.innerHTML = `
      <div class="study-mode">
        <nav class="study-nav">
          <button class="nav-home-btn" onclick="window.location.reload()">🏠 홈으로</button>
        </nav>

        <div class="study-header">
          <h2><span class="emoji">📚</span> 규정 라이브러리</h2>
          <p class="study-subtitle">2024 개정 한국 점자 규정 학습</p>
        </div>

        <div class="study-content">
          <div class="category-nav">
            ${this.renderCategoryNav()}
          </div>

          <div class="clause-content" id="clause-content">
            ${this.renderWelcome()}
          </div>
        </div>
      </div>

      <style>
        .study-mode {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .study-nav {
          display: flex;
          justify-content: flex-start;
          padding: 1rem 0;
          margin-bottom: 1rem;
        }

        .nav-home-btn {
          padding: 0.5rem 1rem;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          color: #334155;
          font-size: 0.95rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .nav-home-btn:hover {
          background: #f8fafc;
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .study-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .study-header h2 {
          font-size: 2rem;
          margin-bottom: 0.5rem;
          color: #0f172a;
        }

        .study-header h2 .emoji {
          color: #0f172a;
        }

        .study-subtitle {
          color: #334155;
          font-size: 1.1rem;
        }

        .study-content {
          display: grid;
          grid-template-columns: 250px 1fr;
          gap: 2rem;
        }

        .category-nav {
          background: rgba(255, 255, 255, 1);
          border-radius: 12px;
          padding: 1.5rem;
          border: 1px solid #e2e8f0;
          height: fit-content;
        }

        .category-item {
          margin-bottom: 1.5rem;
        }

        .category-title {
          font-weight: 700;
          color: #6366f1;
          margin-bottom: 0.75rem;
          font-size: 1.1rem;
        }

        .clause-btn {
          display: block;
          width: 100%;
          padding: 0.75rem;
          margin-bottom: 0.5rem;
          background: rgba(255, 255, 255, 1);
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          color: #1e293b;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 0.9rem;
        }

        .clause-btn:hover {
          background: rgba(99, 102, 241, 0.2);
          border-color: #6366f1;
          transform: translateX(4px);
        }

        .clause-btn.active {
          background: rgba(99, 102, 241, 0.3);
          border-color: #6366f1;
          color: #6366f1;
        }

        .clause-content {
          background: rgba(255, 255, 255, 1);
          border-radius: 12px;
          padding: 2rem;
          border: 1px solid #e2e8f0;
          min-height: 500px;
        }

        .welcome-message {
          text-align: center;
          padding: 4rem 2rem;
          color: #334155;
        }

        .welcome-message h3 {
          font-size: 1.5rem;
          margin-bottom: 1rem;
          color: #1e293b;
        }

        .clause-header {
          margin-bottom: 2rem;
          border-bottom: 2px solid rgba(99, 102, 241, 0.3);
          padding-bottom: 1rem;
        }

        .clause-header h3 {
          color: #6366f1;
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
        }

        .clause-description {
          color: #334155;
          font-size: 1rem;
        }

        .braille-table {
          display: grid;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .braille-item {
          display: grid;
          grid-template-columns: 100px 1fr;
          gap: 2rem;
          align-items: center;
          justify-items: center;
          padding: 1.5rem;
          background: rgba(255, 255, 255, 1);
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 1);
        }

        .braille-char {
          font-size: 2rem;
          font-weight: bold;
          color: #0891b2;
          text-align: center;
        }

        .braille-visual {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          grid-template-rows: repeat(3, 1fr);
          gap: 6px;
          width: 60px;
          height: 90px;
          padding: 10px;
          background: rgba(255, 255, 255, 1);
          border-radius: 12px;
        }

        .braille-dot {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }

        .braille-dot.active {
          background: #6366f1;
          box-shadow: 0 0 10px #6366f1;
        }

        .braille-dot.inactive {
          border: 2px solid #e2e8f0;
        }


        .clause-notes {
          background: rgba(251, 191, 36, 0.1);
          border: 1px solid rgba(251, 191, 36, 0.3);
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 1.5rem;
        }

        .clause-notes h4 {
          color: #fbbf24;
          margin-bottom: 0.5rem;
        }

        .clause-notes p {
          color: #fcd34d;
          margin-bottom: 0.25rem;
          line-height: 1.6;
        }

        .clause-examples {
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.3);
          border-radius: 8px;
          padding: 1rem;
        }

        .clause-examples h4 {
          color: #10b981;
          margin-bottom: 0.75rem;
        }

        .example-words {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .example-word {
          padding: 0.5rem 1rem;
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.2);
          border-radius: 6px;
          color: #6ee7b7;
          font-size: 0.95rem;
        }

        @media (max-width: 768px) {
          .study-content {
            grid-template-columns: 1fr;
          }

          .category-nav {
            max-height: 300px;
            overflow-y: auto;
          }
        }
      </style>
    `;

    this.attachEventListeners();
  }

  /**
   * 카테고리 네비게이션 렌더링
   */
  renderCategoryNav() {
    return Object.entries(this.rulesData).map(([categoryKey, category]) => `
      <div class="category-item">
        <div class="category-title">${category.title}</div>
        ${Object.keys(category.clauses).map(clauseKey => `
          <button class="clause-btn" data-category="${categoryKey}" data-clause="${clauseKey}">
            ${clauseKey}
          </button>
        `).join('')}
      </div>
    `).join('');
  }

  /**
   * 환영 메시지 렌더링
   */
  renderWelcome() {
    return `
      <div class="welcome-message">
        <h3>👈 왼쪽에서 조항을 선택하세요</h3>
        <p>2024년 3월 1일 시행 개정 규정을 학습할 수 있습니다.</p>
      </div>
    `;
  }

  /**
   * 조항 내용 렌더링
   */
  renderClauseContent(categoryKey, clauseKey) {
    const clause = this.rulesData[categoryKey].clauses[clauseKey];

    let html = `
      <div class="clause-header">
        <h3>${clause.title}</h3>
        <p class="clause-description">${clause.description}</p>
      </div>

      <div class="braille-table">
        ${clause.items.map(item => this.renderBrailleItem(item)).join('')}
      </div>
    `;

    if (clause.notes && clause.notes.length > 0) {
      html += `
        <div class="clause-notes">
          <h4>⚠️ 주의사항</h4>
          ${clause.notes.map(note => `<p>${note}</p>`).join('')}
        </div>
      `;
    }

    if (clause.examples && clause.examples.length > 0) {
      html += `
        <div class="clause-examples">
          <h4>📝 예시 단어</h4>
          <div class="example-words">
            ${clause.examples.map(word => `<span class="example-word">${word}</span>`).join('')}
          </div>
        </div>
      `;
    }

    return html;
  }

  /**
   * 점자 항목 렌더링
   */
  renderBrailleItem(item) {
    const displayChar = item.char || item.word;
    const dots = item.dots;

    // 점자 이미지를 표시할 문자 목록
    // const allowedChars = ['.', '?', '!', ',', '\u201C', '\u201D', '\u2018', '\u2019'];
    // const shouldShowBraille = allowedChars.includes(displayChar);

    // 점자 데이터가 있으면 표시 (ㅇ의 빈 배열 제외)
    const shouldShowBraille = dots && dots.length > 0;

    // 약어는 dots가 배열의 배열
    const isMultiCell = Array.isArray(dots[0]);

    return `
      <div class="braille-item">
        <div class="braille-char">${displayChar}</div>
        ${shouldShowBraille
        ? (isMultiCell ? this.renderMultiCellVisual(dots) : this.renderSingleCellVisual(dots))
        : ''
      }
      </div>
    `;
  }

  /**
   * 단일 셀 점형 시각화
   */
  renderSingleCellVisual(dots) {
    const grid = BrailleUtils.dotsToGrid(dots);

    return `
      <div class="braille-visual">
        ${grid.map(row => row.map(isActive => `
          <div class="braille-dot ${isActive ? 'active' : 'inactive'}"></div>
        `).join('')).join('')}
      </div>
    `;
  }

  /**
   * 다중 셀 점형 시각화 (약어용)
   */
  renderMultiCellVisual(dotArrays) {
    return `
      <div style="display: flex; gap: 8px;">
        ${dotArrays.map(dots => this.renderSingleCellVisual(dots)).join('')}
      </div>
    `;
  }

  /**
   * 이벤트 리스너 등록
   */
  attachEventListeners() {
    this.container.querySelectorAll('.clause-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const categoryKey = e.target.dataset.category;
        const clauseKey = e.target.dataset.clause;

        // 활성 버튼 표시
        this.container.querySelectorAll('.clause-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');

        // 조항 내용 표시
        const contentContainer = this.container.querySelector('#clause-content');
        contentContainer.innerHTML = this.renderClauseContent(categoryKey, clauseKey);
      });
    });
  }
}

// ES6 모듈 export
export default StudyMode;
