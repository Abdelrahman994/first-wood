const tokenKey = 'fw_admin_token';
const loginBox = document.getElementById('login-box');
const dash = document.getElementById('dashboard');
let enquiries = [];
let stats = [];

function esc(value) {
  const d = document.createElement('div');
  d.textContent = value == null ? '' : String(value);
  return d.innerHTML;
}

function token() {
  return sessionStorage.getItem(tokenKey);
}

function logout() {
  sessionStorage.removeItem(tokenKey);
  dash.classList.add('hidden');
  loginBox.classList.remove('hidden');
}

async function api(path, options = {}) {
  const res = await fetch('/api/admin' + path, {
    ...options,
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token() },
  });
  if (res.status === 401) { logout(); throw new Error('Unauthorized'); }
  if (!res.ok) throw new Error('Request failed');
  return res.json();
}

function render() {
  const list = document.getElementById('list');
  if (!enquiries.length) {
    list.innerHTML = '<p class="muted">' + esc(t('a_none')) + '</p>';
    return;
  }
  const locale = getLang() === 'ar' ? 'ar-EG' : 'en-GB';
  list.innerHTML = enquiries.map((q) => `
    <article class="card enq">
      <div class="enq-head">
        <strong>${esc(q.name)}</strong>
        <span class="badge ${esc(q.status)}">${esc(t('s_' + q.status))}</span>
      </div>
      <div class="muted">${esc(t('t_' + q.type))} &middot; ${esc(new Date(q.created_at).toLocaleString(locale))}</div>
      <p>${esc(q.message)}</p>
      <div class="muted" dir="auto">${esc([q.company, q.email, q.phone].filter(Boolean).join(' | '))}</div>
      <select class="status-select" data-id="${esc(q.id)}">
        ${['new', 'in_progress', 'closed'].map((s) =>
          `<option value="${s}" ${s === q.status ? 'selected' : ''}>${esc(t('s_' + s))}</option>`).join('')}
      </select>
    </article>`).join('');
}

function renderStats() {
  const counts = { new: 0, in_progress: 0, closed: 0 };
  stats.forEach((s) => { counts[s.status] = s.count; });
  document.getElementById('stats').innerHTML = Object.keys(counts).map((k) =>
    `<div class="card stat"><b>${counts[k]}</b><span class="muted">${esc(t('s_' + k))}</span></div>`).join('');
}

async function load() {
  const params = new URLSearchParams();
  const status = document.getElementById('f-status').value;
  const type = document.getElementById('f-type').value;
  if (status) params.set('status', status);
  if (type) params.set('type', type);

  try {
    const [list, counts] = await Promise.all([api('/enquiries?' + params), api('/stats')]);
    enquiries = list;
    stats = counts;
    render();
    renderStats();
  } catch (err) {
    console.error(err);
  }
}

function showDashboard() {
  loginBox.classList.add('hidden');
  dash.classList.remove('hidden');
  load();
}

document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const err = document.getElementById('login-err');
  err.textContent = '';
  try {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: e.target.username.value, password: e.target.password.value }),
    });
    if (!res.ok) throw new Error('Login failed');
    const data = await res.json();
    sessionStorage.setItem(tokenKey, data.token);
    e.target.reset();
    showDashboard();
  } catch (error) {
    err.textContent = t('a_login_err');
  }
});

document.getElementById('logout').addEventListener('click', logout);
document.getElementById('f-status').addEventListener('change', load);
document.getElementById('f-type').addEventListener('change', load);

document.getElementById('list').addEventListener('change', async (e) => {
  if (!e.target.classList.contains('status-select')) return;
  try {
    await api('/enquiries/' + e.target.dataset.id, {
      method: 'PATCH',
      body: JSON.stringify({ status: e.target.value }),
    });
    load();
  } catch (err) {
    console.error(err);
  }
});

document.addEventListener('langchange', () => { render(); renderStats(); });

if (token()) showDashboard();