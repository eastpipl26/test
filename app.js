/* ════════════════════════════
   테마
════════════════════════════ */
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

/* ════════════════════════════
   탭 전환
════════════════════════════ */
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tab;

    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-section').forEach(s => s.classList.remove('active'));

    btn.classList.add('active');
    document.getElementById('tab-' + target).classList.add('active');
  });
});

/* ════════════════════════════
   로또
════════════════════════════ */
const ballColors = n => {
  if (n <= 10) return 'y1';
  if (n <= 20) return 'y2';
  if (n <= 30) return 'y3';
  if (n <= 40) return 'y4';
  return 'y5';
};

function pickNumbers() {
  const pool = Array.from({length: 45}, (_, i) => i + 1);
  const picked = [];
  for (let i = 0; i < 7; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    picked.push(pool.splice(idx, 1)[0]);
  }
  return {
    main: picked.slice(0, 6).sort((a, b) => a - b),
    bonus: picked[6],
  };
}

function createBall(n, size = 'normal') {
  const el = document.createElement('div');
  el.className = size === 'mini' ? `mini-ball ${ballColors(n)}` : `ball ${ballColors(n)}`;
  el.textContent = n;
  return el;
}

let lottoHistory = [];

function draw() {
  const btn = document.getElementById('drawBtn');
  btn.disabled = true;

  const wrap       = document.getElementById('ballsWrap');
  const bonusBall  = document.getElementById('bonusBall');
  const plusSign   = document.getElementById('plusSign');
  const bonusLabel = document.getElementById('bonusLabel');

  wrap.innerHTML = '';
  bonusBall.innerHTML = '';
  plusSign.classList.remove('show');
  bonusLabel.classList.remove('show');

  const { main, bonus } = pickNumbers();

  main.forEach((n, i) => {
    const ball = createBall(n);
    wrap.appendChild(ball);
    setTimeout(() => ball.classList.add('show'), i * 180 + 80);
  });

  const delay = main.length * 180 + 200;
  setTimeout(() => {
    const bball = createBall(bonus);
    bonusBall.appendChild(bball);
    plusSign.classList.add('show');
    bonusLabel.classList.add('show');
    setTimeout(() => bball.classList.add('show'), 100);
    addHistory(main, bonus);
    btn.disabled = false;
  }, delay);
}

function addHistory(main, bonus) {
  lottoHistory.unshift({ main, bonus });
  if (lottoHistory.length > 20) lottoHistory.pop();
  renderHistory();
}

function renderHistory() {
  const section   = document.getElementById('historySection');
  const container = document.getElementById('history');
  section.style.display = 'block';
  container.innerHTML = '';

  lottoHistory.forEach((item, idx) => {
    const row = document.createElement('div');
    row.className = 'history-row';

    const numEl = document.createElement('span');
    numEl.className = 'row-num';
    numEl.textContent = `#${lottoHistory.length - idx}`;
    row.appendChild(numEl);

    item.main.forEach(n => row.appendChild(createBall(n, 'mini')));

    const plus = document.createElement('span');
    plus.className = 'mini-plus';
    plus.textContent = '+';
    row.appendChild(plus);

    row.appendChild(createBall(item.bonus, 'mini'));
    container.appendChild(row);
  });
}

function clearAll() {
  document.getElementById('ballsWrap').innerHTML = '';
  document.getElementById('bonusBall').innerHTML = '';
  document.getElementById('plusSign').classList.remove('show');
  document.getElementById('bonusLabel').classList.remove('show');
  document.getElementById('historySection').style.display = 'none';
  document.getElementById('history').innerHTML = '';
  lottoHistory = [];
}

/* ════════════════════════════
   제휴 문의 폼
════════════════════════════ */
document.getElementById('contactForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const btn     = document.getElementById('submitBtn');
  const text    = document.getElementById('btnText');
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
      const msg = data.errors?.map(err => err.message).join(', ') || '전송에 실패했습니다.';
      alert(msg);
      resetBtn();
    }
  } catch {
    alert('네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
    resetBtn();
  }
});

function resetBtn() {
  const btn     = document.getElementById('submitBtn');
  const text    = document.getElementById('btnText');
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
