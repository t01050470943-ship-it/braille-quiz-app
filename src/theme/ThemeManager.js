/**
 * ThemeManager.js
 * 
 * 라이트/다크 모드 테마 관리
 * - localStorage 기반 설정 저장
 * - 테마 전환 기능
 */

class ThemeManager {
    constructor() {
        this.currentTheme = 'light';
        this.init();
    }

    /**
     * 초기화
     */
    init() {
        this.loadTheme();
        this.applyTheme();
    }

    /**
     * localStorage에서 테마 로드
     */
    loadTheme() {
        const saved = localStorage.getItem('braille_theme');
        if (saved && (saved === 'light' || saved === 'dark')) {
            this.currentTheme = saved;
        }
    }

    /**
     * 테마 전환
     */
    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme();
        this.saveTheme();

        // 이벤트 발생 (다른 컴포넌트에서 감지 가능)
        window.dispatchEvent(new CustomEvent('themechange', {
            detail: { theme: this.currentTheme }
        }));
    }

    /**
     * 테마 적용
     */
    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
    }

    /**
     * localStorage에 테마 저장
     */
    saveTheme() {
        localStorage.setItem('braille_theme', this.currentTheme);
    }

    /**
     * 현재 테마 가져오기
     */
    getCurrentTheme() {
        return this.currentTheme;
    }

    /**
     * 다크 모드 여부 확인
     */
    isDarkMode() {
        return this.currentTheme === 'dark';
    }
}

export default ThemeManager;
