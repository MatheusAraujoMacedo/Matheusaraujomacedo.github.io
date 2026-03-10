// =============================================
// PARALLAX SCROLL ANIMATION
// =============================================
const parallaxElements = document.querySelectorAll('.parallax-element');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function updateParallax() {
    if (prefersReducedMotion) return;
    parallaxElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const speed = parseFloat(el.dataset.speed) || 0.05;
        const center = window.innerHeight / 2;
        const elementCenter = rect.top + rect.height / 2;
        const offset = (elementCenter - center) * speed;
        el.style.transform = `translateY(${offset}px)`;
    });
}

window.addEventListener('scroll', updateParallax, { passive: true });
window.addEventListener('resize', updateParallax, { passive: true });
updateParallax();

// =============================================
// REVEAL ON SCROLL (subtle fade in)
// =============================================
const revealElements = document.querySelectorAll('.reveal');

if (!prefersReducedMotion) {
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));
} else {
    revealElements.forEach(el => el.classList.add('revealed'));
}

// =============================================
// BACK TO TOP
// =============================================
const backToTopButton = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
    backToTopButton.classList.toggle('show', window.scrollY > 300);
});

// =============================================
// ACTIVE NAV LINK
// =============================================
const sections = Array.from(document.querySelectorAll('section[id]'));
const navLinks = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
const mobileLinks = Array.from(document.querySelectorAll('#mobile-nav-list a[href^="#"]'));

function setActiveLink(id) {
    navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${id}`));
    mobileLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${id}`));
}

const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) setActiveLink(entry.target.id);
    });
}, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });

sections.forEach(section => navObserver.observe(section));

// =============================================
// MOBILE MENU
// =============================================
const mobileMenuButton = document.getElementById('mobile-menu');
const mobileNavList = document.getElementById('mobile-nav-list');

function toggleMenu() {
    if (mobileNavList) mobileNavList.classList.toggle('active');
}

if (mobileMenuButton) mobileMenuButton.addEventListener('click', toggleMenu);

// =============================================
// LANGUAGE TOGGLE
// =============================================
let currentLang = localStorage.getItem('portfolio-lang') || 'pt';

function toggleLanguage() {
    const elements = document.querySelectorAll('[data-en]');
    const btn = document.getElementById('lang-btn');
    const btnMobile = document.getElementById('lang-btn-mobile');

    if (currentLang === 'pt') {
        elements.forEach(el => {
            el.setAttribute('data-pt', el.innerHTML);
            el.innerHTML = el.getAttribute('data-en');
        });
        if (btn) btn.innerHTML = '<i class="fas fa-globe"></i> PT';
        if (btnMobile) btnMobile.innerHTML = 'Português (PT)';
        currentLang = 'en';
    } else {
        elements.forEach(el => {
            el.innerHTML = el.getAttribute('data-pt');
        });
        if (btn) btn.innerHTML = '<i class="fas fa-globe"></i> EN';
        if (btnMobile) btnMobile.innerHTML = 'Inglês (EN)';
        currentLang = 'pt';
    }
    localStorage.setItem('portfolio-lang', currentLang);
    updateToggleStates();
}

// =============================================
// CONTRAST TOGGLE
// =============================================
function toggleContrast() {
    document.body.classList.toggle('white-contrast');
    localStorage.setItem('portfolio-contrast', document.body.classList.contains('white-contrast'));
    updateToggleStates();
}

function updateToggleStates() {
    const btn = document.getElementById('lang-btn');
    const btnMobile = document.getElementById('lang-btn-mobile');
    const contrastBtn = document.getElementById('contrast-btn');
    const contrastBtnMobile = document.getElementById('contrast-btn-mobile');
    const isEnglish = currentLang === 'en';
    const isContrast = document.body.classList.contains('white-contrast');

    if (btn) { btn.classList.toggle('toggle-active', isEnglish); btn.setAttribute('aria-pressed', String(isEnglish)); }
    if (btnMobile) { btnMobile.classList.toggle('toggle-active', isEnglish); btnMobile.setAttribute('aria-pressed', String(isEnglish)); }
    if (contrastBtn) { contrastBtn.classList.toggle('toggle-active', isContrast); contrastBtn.setAttribute('aria-pressed', String(isContrast)); }
    if (contrastBtnMobile) { contrastBtnMobile.classList.toggle('toggle-active', isContrast); contrastBtnMobile.setAttribute('aria-pressed', String(isContrast)); }
}

function applyStoredPreferences() {
    if (currentLang === 'en') { currentLang = 'pt'; toggleLanguage(); }
    if (localStorage.getItem('portfolio-contrast') === 'true') { document.body.classList.add('white-contrast'); }
    updateToggleStates();
}

document.addEventListener('DOMContentLoaded', applyStoredPreferences);

// =============================================
// MODAL
// =============================================
const modal = document.getElementById('project-modal');
const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-desc');
const modalLink = document.getElementById('modal-link');
const closeModalBtn = document.querySelector('.close-modal');

function openModal(trigger) {
    const isEnglish = currentLang === 'en';
    modalTitle.innerText = isEnglish ? trigger.dataset.enTitle : trigger.dataset.title;
    modalDesc.innerText = isEnglish ? trigger.dataset.enDesc : trigger.dataset.desc;
    modalLink.href = trigger.dataset.link;
    modal.classList.add('show');
}

closeModalBtn.onclick = () => modal.classList.remove('show');
window.onclick = (e) => { if (e.target === modal) modal.classList.remove('show'); };

// =============================================
// CONTACT FORM
// =============================================
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');
const submitBtn = contactForm?.querySelector('.submit-btn');

if (contactForm) {
    contactForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const nameField = contactForm.querySelector('input[name="name"]');
        const emailField = contactForm.querySelector('input[name="email"]');
        const messageField = contactForm.querySelector('textarea[name="message"]');
        const nameValue = nameField?.value.trim() || '';
        const emailValue = emailField?.value.trim() || '';
        const messageValue = messageField?.value.trim() || '';
        const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue);

        if (!nameValue || !emailValue || !messageValue || !emailValid) {
            if (formStatus) {
                formStatus.textContent = !emailValue || !emailValid
                    ? 'Digite um e-mail válido.'
                    : 'Preencha todos os campos antes de enviar.';
                formStatus.dataset.state = 'error';
            }
            return;
        }

        if (submitBtn) submitBtn.disabled = true;
        if (formStatus) { formStatus.textContent = 'Enviando mensagem...'; formStatus.dataset.state = 'loading'; }

        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: new FormData(contactForm),
                headers: { 'Accept': 'application/json' }
            });
            if (response.ok) {
                contactForm.reset();
                if (formStatus) { formStatus.textContent = 'Mensagem enviada com sucesso. Obrigado!'; formStatus.dataset.state = 'success'; }
            } else {
                if (formStatus) { formStatus.textContent = 'Não foi possível enviar. Tente novamente.'; formStatus.dataset.state = 'error'; }
            }
        } catch (error) {
            if (formStatus) { formStatus.textContent = 'Erro de conexão. Verifique sua internet.'; formStatus.dataset.state = 'error'; }
        } finally {
            if (submitBtn) submitBtn.disabled = false;
        }
    });
}
