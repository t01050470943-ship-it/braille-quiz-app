/**
 * 점자 마스터 2024 - 인증 모달
 * 주의사항 안내 및 비밀번호 인증
 */

class AuthModal {
  constructor(containerId, onAuthCallback) {
    this.container = document.querySelector(containerId);
    this.onAuthCallback = onAuthCallback;
    this.showNotice = true;
    this.agreed = false;
    this.password = '';
    this.CORRECT_PASSWORD = '39901';
  }

  init() {
    // localStorage에서 인증 상태 확인
    const hasAgreed = localStorage.getItem('braille_notice_agreed') === 'true';
    const savedPassword = localStorage.getItem('braille_password');

    // 이미 인증된 사용자는 바로 메인 앱 표시
    if (hasAgreed && savedPassword === this.CORRECT_PASSWORD) {
      this.onAuthCallback();
      return;
    }

    // 동의 여부에 따라 초기 화면 결정
    if (hasAgreed) {
      this.showNotice = false;
    }

    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="auth-overlay">
        <div class="auth-modal">
          <!-- 로고 이미지 -->
          <div class="auth-logo">
            <img src="/logo-braille.png" alt="최한솔 선생님의 특수교육임용창고" />
          </div>

          ${this.showNotice ? this.renderNoticeScreen() : this.renderPasswordScreen()}
        </div>
      </div>
    `;

    this.attachEventListeners();
  }

  renderNoticeScreen() {
    return `
      <div class="notice-content">
        <h2>⚠️ Caution</h2>
        <div class="notice-text">
          <p>• 이 앱은 <strong>임용닷컴 최한솔 선생님 수강생</strong>을 위한 수강생 전용 장특법 학습용 앱입니다.</p>
          <p>• 또한 <strong>유튜브 특수교육임용창고 멤버십 회원</strong> 혜택 중 하나로 제공되는 서비스입니다.</p>
          <p>• 따라서 해당 인원들에게 정기적으로 앱 사용을 위한 비밀번호가 제공됩니다.</p>
          <p>• 비밀번호는 임용닷컴 수강생들은 학원에서 매달 문자로 비밀번호가 발송될 예정이며, 유튜브 특수교육임용창고 멤버십 회원들은 회원 전용 게시물에서 비밀번호를 확인하실 수 있습니다.</p>
        </div>

        <label class="agree-checkbox">
          <input type="checkbox" id="agree-checkbox" />
          <span>위 내용을 확인했으며 동의합니다</span>
        </label>

        <button class="btn btn-primary" id="notice-confirm-btn" disabled>
          확인
        </button>
      </div>
    `;
  }

  renderPasswordScreen() {
    return `
      <div class="password-content">
        <h2>🔐 비밀번호 입력</h2>
        <p class="password-hint">
          임용닷컴 또는 유튜브 멤버십에서 제공받은 비밀번호를 입력해주세요.
        </p>
        <p class="password-note">
          💡 비밀번호는 정기적으로 변경됩니다.
        </p>

        <form id="password-form">
          <input
            type="password"
            class="password-input"
            id="password-input"
            placeholder="비밀번호를 입력하세요"
            autocomplete="off"
          />
          <p class="error-message" id="error-message" style="display: none;"></p>

          <button type="submit" class="btn btn-primary">
            확인
          </button>
        </form>
      </div>
    `;
  }

  attachEventListeners() {
    if (this.showNotice) {
      const checkbox = document.getElementById('agree-checkbox');
      const confirmBtn = document.getElementById('notice-confirm-btn');

      checkbox.addEventListener('change', (e) => {
        this.agreed = e.target.checked;
        confirmBtn.disabled = !this.agreed;
      });

      confirmBtn.addEventListener('click', () => {
        this.handleAgree();
      });
    } else {
      const form = document.getElementById('password-form');
      const input = document.getElementById('password-input');
      const errorMsg = document.getElementById('error-message');

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handlePasswordSubmit(input.value, errorMsg);
      });

      // 입력 시 에러 메시지 숨김
      input.addEventListener('input', () => {
        errorMsg.style.display = 'none';
      });

      // 자동 포커스
      setTimeout(() => input.focus(), 100);
    }
  }

  handleAgree() {
    if (!this.agreed) {
      alert('주의사항에 동의해주세요.');
      return;
    }

    localStorage.setItem('braille_notice_agreed', 'true');
    this.showNotice = false;
    this.render();
  }

  handlePasswordSubmit(password, errorMsg) {
    if (password === this.CORRECT_PASSWORD) {
      localStorage.setItem('braille_password', password);
      this.onAuthCallback();
    } else {
      errorMsg.textContent = '비밀번호가 올바르지 않습니다.';
      errorMsg.style.display = 'block';
      document.getElementById('password-input').value = '';
      document.getElementById('password-input').focus();
    }
  }
}

export default AuthModal;
