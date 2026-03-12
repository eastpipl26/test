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
  const main = picked.slice(0, 6).sort((a, b) => a - b);
  const bonus = picked[6];
  return { main, bonus };
}

function createBall(n, size = 'normal') {
  const el = document.createElement('div');
  el.className = size === 'mini'
    ? `mini-ball ${ballColors(n)}`
    : `ball ${ballColors(n)}`;
  el.textContent = n;
  return el;
}

let history = [];

function draw() {
  const btn = document.getElementById('drawBtn');
  btn.disabled = true;

  const wrap = document.getElementById('ballsWrap');
  const bonusBall = document.getElementById('bonusBall');
  const plusSign = document.getElementById('plusSign');
  const bonusLabel = document.getElementById('bonusLabel');

  wrap.innerHTML = '';
  bonusBall.innerHTML = '';
  plusSign.classList.remove('show');
  bonusLabel.classList.remove('show');

  const { main, bonus } = pickNumbers();

  // 메인 번호 순차 표시
  main.forEach((n, i) => {
    const ball = createBall(n);
    wrap.appendChild(ball);
    setTimeout(() => ball.classList.add('show'), i * 180 + 80);
  });

  // 보너스 번호
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
  history.unshift({ main, bonus });
  if (history.length > 20) history.pop();
  renderHistory();
}

function renderHistory() {
  const section = document.getElementById('historySection');
  const container = document.getElementById('history');
  section.style.display = 'block';
  container.innerHTML = '';

  history.forEach((item, idx) => {
    const row = document.createElement('div');
    row.className = 'history-row';

    const numEl = document.createElement('span');
    numEl.className = 'row-num';
    numEl.textContent = `#${history.length - idx}`;
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
  history = [];
}
