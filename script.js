document.addEventListener('DOMContentLoaded', () => {
  const qs = (sel, root = document) => root.querySelector(sel);
  const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // Date/time
  const datetime = qs('#datetime');
  const updateTime = () => {
    const now = new Date();
    const formatted = new Intl.DateTimeFormat('ar-EG', {
      dateStyle: 'full', timeStyle: 'short'
    }).format(now);
    if (datetime) datetime.textContent = formatted;
  };
  updateTime();
  setInterval(updateTime, 60_000);

  // Copy year
  const copyYear = qs('#copyYear');
  if (copyYear) copyYear.textContent = String(new Date().getFullYear());

  // Search overlay
  const searchOverlay = qs('#searchOverlay');
  qs('#openSearch')?.addEventListener('click', () => {
    searchOverlay?.setAttribute('aria-hidden', 'false');
  });
  qs('#closeSearch')?.addEventListener('click', () => {
    searchOverlay?.setAttribute('aria-hidden', 'true');
  });
  searchOverlay?.addEventListener('click', (e) => {
    if (e.target === searchOverlay) searchOverlay.setAttribute('aria-hidden', 'true');
  });

  // Mobile drawer
  const drawer = qs('#mobileDrawer');
  qs('#openMenu')?.addEventListener('click', () => drawer?.setAttribute('aria-hidden', 'false'));
  qs('#closeMenu')?.addEventListener('click', () => drawer?.setAttribute('aria-hidden', 'true'));
  drawer?.addEventListener('click', (e) => { if (e.target === drawer) drawer.setAttribute('aria-hidden', 'true'); });

  // Tabs
  const tabs = qsa('.tab');
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const group = tab.closest('.section-head');
      const targetSel = tab.getAttribute('data-tab-target');
      if (!group || !targetSel) return;

      // Toggle active tab
      qsa('.tab', group).forEach(t => t.classList.remove('is-active'));
      tab.classList.add('is-active');

      // Panels
      const container = group.parentElement; // grid__content
      if (!container) return;
      qsa('.tab-panel', container).forEach(p => {
        p.classList.remove('is-active');
        p.toggleAttribute('hidden', true);
      });
      const target = qs(targetSel, container);
      if (target) {
        target.classList.add('is-active');
        target.toggleAttribute('hidden', false);
      }
    });
  });

  // Slider controls (videos)
  const slider = qs('#videoSlider');
  const scrollBy = () => slider?.clientWidth ? slider.clientWidth * 0.9 : 300;
  qs('#videoPrev')?.addEventListener('click', () => slider?.scrollBy({ left: -scrollBy(), behavior: 'smooth' }));
  qs('#videoNext')?.addEventListener('click', () => slider?.scrollBy({ left: scrollBy(), behavior: 'smooth' }));

  // Load more (demo)
  qs('#loadMoreBtn')?.addEventListener('click', () => {
    const grid = qs('#latest');
    if (!grid) return;
    for (let i = 0; i < 4; i++) {
      const idx = Math.floor(Math.random() * 5000);
      const article = document.createElement('article');
      article.className = 'card card--horz';
      article.innerHTML = `
        <a href="#" class="card__media"><img src="https://picsum.photos/seed/m${idx}/600/400" alt="خبر"></a>
        <div class="card__body">
          <a class="chip" href="#">مصر</a>
          <h3 class="card__title"><a href="#">عنوان إضافي للمحتوى التجريبي</a></h3>
          <p class="card__excerpt">نص تجريبي يوضح إضافة مزيد من البطاقات إلى القائمة.</p>
          <div class="meta">الآن</div>
        </div>`;
      grid.appendChild(article);
    }
  });

  // Subscribe forms (demo only)
  const hookSubscribe = (formId, msgId) => {
    const form = qs(formId);
    const msg = qs(msgId);
    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = new FormData(form).get('email');
      setTimeout(() => {
        if (msg) msg.textContent = `تم الاشتراك بنجاح: ${email}`;
        form.reset();
      }, 400);
    });
  };
  hookSubscribe('#subscribeForm', '#subscribeMsg');
  hookSubscribe('#footerSubscribeForm', '#footerSubscribeMsg');
});