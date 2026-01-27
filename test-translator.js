/**
 * BrailleTranslator.js 테스트 스크립트
 * 
 * §5 겹받침, §18 약어 예외, §43 수표 재사용 검증
 */

// ES Module import를 위한 설정
import BrailleTranslator from '../src/engine/BrailleTranslator.js';

const translator = new BrailleTranslator();

console.log('='.repeat(60));
console.log('BrailleTranslator.js QA 검수 테스트');
console.log('='.repeat(60));

// ===== 1. 제5항: 겹받침 테스트 =====
console.log('\n[1] §5 겹받침 데이터셋 테스트\n');

const clusterTests = [
    { word: '많다', cluster: 'ㄶ', expected: '많(ㅁ+ㅏ+ㄴ+ㅎ)+다(약자)' },
    { word: '외곬', cluster: 'ㄽ', expected: '외(ㅇ+ㅚ)+곬(ㄱ+ㅗ+ㄹ+ㅅ)' },
    { word: '핥다', cluster: 'ㄾ', expected: '핥(ㅎ+ㅏ+ㄹ+ㅌ)+다(약자)' },
    { word: '읊다', cluster: 'ㄿ', expected: '읊(ㅇ+ㅡ+ㄹ+ㅍ)+다(약자)' },
    { word: '옳다', cluster: 'ㅀ', expected: '옳(ㅇ+ㅗ+ㄹ+ㅎ)+다(약자)' },
    { word: '없다', cluster: 'ㅄ', expected: '없(ㅇ+ㅓ+ㅂ+ㅅ)+다(약자)' }
];

clusterTests.forEach(test => {
    const result = translator.translateToBraille(test.word);
    const hasClusterData = translator.clusterFinals[test.cluster] !== undefined;

    console.log(`  ${test.cluster} (${test.word})`);
    console.log(`    - 데이터 등록: ${hasClusterData ? '✅ 있음' : '❌ 없음'}`);
    console.log(`    - 점형 결과: ${JSON.stringify(result)}`);
    console.log(`    - 예상: ${test.expected}`);
    console.log('');
});

// ===== 2. 제18항: 약어 앞 예외 로직 테스트 =====
console.log('\n[2] §18 약어 앞 예외 로직 테스트\n');

const contractionTests = [
    {
        input: '그리고',
        shouldUseContraction: true,
        reason: '앞에 글자 없음 → 약어 사용 O',
        expectedLength: 2  // [[1], [1,3,6]]
    },
    {
        input: '오그리고',
        shouldUseContraction: false,
        reason: '앞에 "오" 있음 → 약어 사용 X, 자모 분해',
        expectedLength: 7  // 오(2) + 그(2) + 리(2) + 고(1)
    },
    {
        input: '우그리고',
        shouldUseContraction: false,
        reason: '앞에 "우" 있음 → 약어 사용 X, 자모 분해',
        expectedLength: 7
    }
];

contractionTests.forEach(test => {
    const result = translator.translateToBraille(test.input);
    const usedContraction = result.length <= 2;
    const passed = usedContraction === test.shouldUseContraction;

    console.log(`  "${test.input}"`);
    console.log(`    - 결과: ${passed ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`    - 약어 사용: ${usedContraction ? 'YES' : 'NO'}`);
    console.log(`    - 점형 개수: ${result.length} (예상: ${test.expectedLength})`);
    console.log(`    - 점형 결과: ${JSON.stringify(result)}`);
    console.log(`    - 설명: ${test.reason}`);
    console.log('');
});

// ===== 3. 제43항: 수표 재사용 테스트 =====
console.log('\n[3] §43 특수 기호 뒤 수표 재사용 테스트\n');

const numberTests = [
    {
        input: '3·1',
        description: '가운뎃점 뒤 수표',
        expectedPattern: '수표 + 3 + · + 수표 + 1'
    },
    {
        input: '2:1',
        description: '쌍점 뒤 수표',
        expectedPattern: '수표 + 2 + : + 수표 + 1'
    },
    {
        input: '1-2',
        description: '붙임표 뒤 수표',
        expectedPattern: '수표 + 1 + - + 수표 + 2'
    }
];

const numberIndicator = [3, 4, 5, 6];
const isNumberIndicator = (dots) => {
    return JSON.stringify(dots) === JSON.stringify(numberIndicator);
};

numberTests.forEach(test => {
    const result = translator.translateToBraille(test.input);

    // 수표의 위치 찾기
    const indicatorPositions = [];
    result.forEach((dots, idx) => {
        if (isNumberIndicator(dots)) {
            indicatorPositions.push(idx);
        }
    });

    // 특수 기호 뒤에 수표가 있는지 확인
    const hasReusedIndicator = indicatorPositions.length >= 2;

    console.log(`  "${test.input}" (${test.description})`);
    console.log(`    - 결과: ${hasReusedIndicator ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`    - 수표 위치: ${JSON.stringify(indicatorPositions)}`);
    console.log(`    - 수표 개수: ${indicatorPositions.length} (예상: 2개)`);
    console.log(`    - 전체 점형: ${JSON.stringify(result)}`);
    console.log(`    - 예상 패턴: ${test.expectedPattern}`);
    console.log('');
});

// ===== 최종 요약 =====
console.log('\n' + '='.repeat(60));
console.log('테스트 완료');
console.log('='.repeat(60));
