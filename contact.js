/* ── 테마 ── */
(function () {
  const saved = localStorage.getItem('theme') || 'dark';
  if (saved === 'light') document.body.classList.add('light');
  updateThemeIcon(saved);
})();

function updateThemeIcon(theme) {
  const btn = document.getElementById('themeToggle');
  if (btn) btn.textContent = theme === 'light' ? '🌙' : '☀️';
}

document.getElementById('themeToggle').addEventListener('click', () => {
  const isLight = document.body.classList.toggle('light');
  const theme = isLight ? 'light' : 'dark';
  localStorage.setItem('theme', theme);
  updateThemeIcon(theme);
});

/* ── 폼 제출 ── */
document.getElementById('contactForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const btn    = document.getElementById('submitBtn');
  const text   = document.getElementById('btnText');
  const spinner = document.getElementById('btnSpinner');

  btn.disabled = true;
  text.textContent = '전송 중...';
  spinner.style.display = 'block';

  try {
    const res = await fetch(e.target.action, {
      method: 'POST',
      body: new FormData(e.target),
      headers: { Accept: 'application/json' },
    });

    if (res.ok) {
      document.getElementById('contactForm').style.display = 'none';
      document.getElementById('successMsg').style.display = 'block';
    } else {
      const data = await res.json();
      const msg = data.errors?.map(err => err.message).join(', ') || '전송에 실패했습니다. 다시 시도해 주세요.';
      alert(msg);
      resetBtn();
    }
  } catch {
    alert('네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
    resetBtn();
  }
});

function resetBtn() {
  const btn    = document.getElementById('submitBtn');
  const text   = document.getElementById('btnText');
  const spinner = document.getElementById('btnSpinner');
  btn.disabled = false;
  text.textContent = '문의 보내기';
  spinner.style.display = 'none';
}

function resetForm() {
  document.getElementById('contactForm').reset();
  document.getElementById('contactForm').style.display = 'block';
  document.getElementById('successMsg').style.display = 'none';
  resetBtn();
}
