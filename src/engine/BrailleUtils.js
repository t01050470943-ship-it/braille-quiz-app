/**
 * BrailleUtils.js
 * 
 * 점자 유틸리티 함수 모음
 */

class BrailleUtils {
    /**
     * Dots 배열을 2x3 그리드로 변환
     * @param {Array} dots - 점 번호 배열 [1,2,3,4,5,6]
     * @returns {Array} 2x3 그리드 [[row1], [row2], [row3]]
     */
    static dotsToGrid(dots) {
        const grid = [
            [false, false],  // 1, 4
            [false, false],  // 2, 5
            [false, false]   // 3, 6
        ];

        dots.forEach(dot => {
            if (dot === 1) grid[0][0] = true;
            else if (dot === 2) grid[1][0] = true;
            else if (dot === 3) grid[2][0] = true;
            else if (dot === 4) grid[0][1] = true;
            else if (dot === 5) grid[1][1] = true;
            else if (dot === 6) grid[2][1] = true;
        });

        return grid;
    }

    /**
     * 2x3 그리드를 Dots 배열로 변환
     * @param {Array} grid - 2x3 그리드
     * @returns {Array} 점 번호 배열
     */
    static gridToDots(grid) {
        const dots = [];

        if (grid[0][0]) dots.push(1);
        if (grid[1][0]) dots.push(2);
        if (grid[2][0]) dots.push(3);
        if (grid[0][1]) dots.push(4);
        if (grid[1][1]) dots.push(5);
        if (grid[2][1]) dots.push(6);

        return dots;
    }

    /**
     * Dots 배열을 유니코드 점자로 변환
     * @param {Array} dots - 점 번호 배열
     * @returns {string} 유니코드 점자 문자
     */
    static dotsToUnicode(dots) {
        // 유니코드 점자 베이스: U+2800
        let code = 0x2800;

        dots.forEach(dot => {
            code += Math.pow(2, dot - 1);
        });

        return String.fromCharCode(code);
    }

    /**
     * 유니코드 점자를 Dots 배열로 변환
     * @param {string} char - 유니코드 점자 문자
     * @returns {Array} 점 번호 배열
     */
    static unicodeToDots(char) {
        const code = char.charCodeAt(0) - 0x2800;
        const dots = [];

        for (let i = 1; i <= 8; i++) {
            if (code & Math.pow(2, i - 1)) {
                dots.push(i);
            }
        }

        // 한국 점자는 6점만 사용
        return dots.filter(d => d <= 6);
    }
}

export default BrailleUtils;
