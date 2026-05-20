const mobileMenuButton = document.getElementById('mobile-menu');
const mobileNavList = document.getElementById('mobile-nav-list');

function toggleMenu() {
    if (mobileNavList) mobileNavList.classList.toggle('active');
}

if (mobileMenuButton) mobileMenuButton.addEventListener('click', toggleMenu);

let currentLang = localStorage.getItem('portfolio-lang') || 'pt';

function toggleLanguage() {
    const elements = document.querySelectorAll('[data-en]');
    const placeholders = document.querySelectorAll('[data-en-placeholder]');
    const btn = document.getElementById('lang-btn');
    const btnMobile = document.getElementById('lang-btn-mobile');

    if (currentLang === 'pt') {
        elements.forEach(el => {
            el.setAttribute('data-pt', el.innerHTML);
            el.innerHTML = el.getAttribute('data-en');
        });
        placeholders.forEach(el => {
            el.setAttribute('data-pt-placeholder', el.placeholder);
            el.placeholder = el.getAttribute('data-en-placeholder');
        });
        if (btn) btn.innerHTML = '<i class="fas fa-globe"></i> PT';
        if (btnMobile) btnMobile.innerHTML = 'Português (PT)';
        currentLang = 'en';
    } else {
        elements.forEach(el => {
            el.innerHTML = el.getAttribute('data-pt');
        });
        placeholders.forEach(el => {
            el.placeholder = el.getAttribute('data-pt-placeholder');
        });
        if (btn) btn.innerHTML = '<i class="fas fa-globe"></i> EN';
        if (btnMobile) btnMobile.innerHTML = 'Inglês (EN)';
        currentLang = 'pt';
    }
    localStorage.setItem('portfolio-lang', currentLang);
    updateToggleStates();

    // Reset typewriter with new language text
    if (typeof startTypewriter === 'function') startTypewriter();
}

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

window.toggleMenu = toggleMenu;
window.toggleLanguage = toggleLanguage;
window.toggleContrast = toggleContrast;
