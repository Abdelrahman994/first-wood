const SITE = { phone: '+20 000 000 0000', email: 'info@firstwood.example' };

function renderLayout() {
  const header = document.getElementById('site-header');
  if (header) {
    header.innerHTML = `
      <div class="container nav">
        <a class="brand" href="/">First Wood</a>
        <nav>
          <a href="/" data-i18n="nav_home"></a>
          <a href="/products.html" data-i18n="nav_products"></a>
          <a href="/contact.html" data-i18n="nav_contact"></a>
          <button id="lang-toggle" class="lang-btn" type="button"></button>
        </nav>
      </div>`;
  }

  const footer = document.getElementById('site-footer');
  if (footer) {
    footer.innerHTML = `
      <div class="container">
        <p>First Wood &middot; <span dir="ltr">${SITE.phone}</span> &middot; <span dir="ltr">${SITE.email}</span></p>
        <p>&copy; ${new Date().getFullYear()} <span data-i18n="footer_rights"></span></p>
      </div>`;
  }
}

function setupForm() {
  const form = document.getElementById('enquiry-form');
  if (!form) return;

  const preset = new URLSearchParams(location.search).get('type');
  if (preset) form.elements['type'].value = preset;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const msg = document.getElementById('form-msg');
    const btn = form.querySelector('button[type=submit]');
    const data = Object.fromEntries(new FormData(form));
    data.language = getLang();

    if (!data.email && !data.phone) {
      msg.textContent = t('f_need');
      msg.className = 'msg err';
      return;
    }

    btn.disabled = true;
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Request failed');
      form.reset();
      msg.textContent = t('f_success');
      msg.className = 'msg ok';
    } catch (err) {
      msg.textContent = t('f_error');
      msg.className = 'msg err';
    }
    btn.disabled = false;
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderLayout();
  applyLang();
  document.getElementById('lang-toggle').addEventListener('click', () => {
    setLang(getLang() === 'ar' ? 'en' : 'ar');
  });
  setupForm();
});