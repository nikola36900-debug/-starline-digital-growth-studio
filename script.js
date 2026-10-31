(() => {
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.site-nav');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const updateHeader = () => header.classList.toggle('scrolled', window.scrollY > 12);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  const closeMenu = () => {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation');
    nav.classList.remove('open');
    document.body.classList.remove('menu-open');
  };
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    nav.classList.toggle('open', open);
    document.body.classList.toggle('menu-open', open);
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
  window.addEventListener('resize', () => { if (window.innerWidth > 800) closeMenu(); });

  const revealItems = document.querySelectorAll('.reveal, .metric-feature');
  if ('IntersectionObserver' in window && !reducedMotion) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.16 });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add('is-visible'));
  }

  document.querySelectorAll('.faq details').forEach(detail => {
    detail.addEventListener('toggle', () => {
      if (detail.open) {
        document.querySelectorAll('.faq details').forEach(other => {
          if (other !== detail) other.open = false;
        });
      }
    });
  });

  document.getElementById('year').textContent = new Date().getFullYear();
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  form.addEventListener('submit', event => {
    event.preventDefault();
    status.textContent = '';
    const required = [...form.querySelectorAll('[required]')];
    const invalid = required.find(field => {
      if (field.type === 'checkbox') return !field.checked;
      return !field.value.trim() || (field.type === 'email' && !field.validity.valid);
    });
    if (invalid) {
      status.textContent = invalid.type === 'checkbox' ? 'Please confirm the consent checkbox to continue.' : 'Please complete the required fields with valid information.';
      invalid.focus();
      return;
    }
    const data = new FormData(form);
    const subject = `StarlineComplex enquiry — ${data.get('business')}`;
    const body = [
      `Name: ${data.get('name')}`,
      `Business: ${data.get('business')}`,
      `Email: ${data.get('email')}`,
      `Phone: ${data.get('phone') || 'Not provided'}`,
      `Website: ${data.get('website') || 'Not provided'}`,
      `Service: ${data.get('service')}`,
      `Preferred contact: ${data.get('contact_method')}`,
      '',
      'Goals:',
      data.get('goals')
    ].join('\n');
    status.textContent = 'Your details are valid. This demo has not sent them anywhere; connect a form backend before publishing.';
    // Keep the data on-page only; do not open an email client or transmit personal information unexpectedly.
    console.info('Demo form validated. Connect a secure form endpoint to enable submissions.', { subject, bodyLength: body.length });
  });
})();
