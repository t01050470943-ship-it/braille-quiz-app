const fs = require('fs');
const path = require('path');

// 색상 매핑
const colorMap = {
    '#cbd5e1': '#1e293b',  // 밝은 회색 -> 진한 회색
    '#94a3b8': '#334155',  // 중간 회색 -> 더 진한 회색
    '#a0aec0': '#475569',  // 보조 텍스트 -> 진한 색
    '#718096': '#64748b',  // 약간 진하게
};

// 컴포넌트 파일들
const files = [
    'src/components/StudyMode.js',
    'src/components/ReadingQuiz.js',
    'src/components/WritingQuiz.js',
    'src/components/DotInputPad.js',
    'src/analytics/WeaknessRadar.js'
];

files.forEach(filePath => {
    const fullPath = path.join(process.cwd(), filePath);

    if (!fs.existsSync(fullPath)) {
        console.log(`❌ 파일 없음: ${filePath}`);
        return;
    }

    let content = fs.readFileSync(fullPath, 'utf8');
    let changed = false;

    Object.entries(colorMap).forEach(([oldColor, newColor]) => {
        const regex = new RegExp(oldColor, 'g');
        if (content.includes(oldColor)) {
            content = content.replace(regex, newColor);
            changed = true;
        }
    });

    if (changed) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`✅ 업데이트됨: ${filePath}`);
    } else {
        console.log(`⏭️  변경 없음: ${filePath}`);
    }
});

console.log('\n🎨 색상 업데이트 완료!');
