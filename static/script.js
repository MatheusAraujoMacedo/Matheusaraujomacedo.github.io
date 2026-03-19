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

// =============================================
// GSAP HERO ANIMATION
// =============================================
function initHeroAnimation() {
    if (typeof gsap === 'undefined' || prefersReducedMotion) return;

    // Create timeline with default ease
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

    // Cinematic stagger effect for text content
    tl.from(".hero-greeting, .hero h1, .hero-role, .hero-desc, .hero-badges, .hero-actions", {
        y: 40,
        opacity: 0,
        duration: 1.2,
        stagger: 0.15,
        delay: 0.1
    })
    // Dramatic fade + scale down for image container
    .from(".hero-image", {
        scale: 1.15,
        opacity: 0,
        duration: 1.8,
        ease: "power3.out"
    }, "-=1.0") // overlap with text animation
    // Subtle internal scale down for the photo itself
    .from(".hero-image img", {
        scale: 1.2,
        duration: 2.5,
        ease: "sine.out"
    }, "-=1.8"); 
}

// =============================================
// TYPEWRITER ANIMATION
// =============================================
const typeStringsPt = ["Desenvolvedor Back-end", "Especialista em Azure", "Cloud Computing", "Soluções Escaláveis"];
const typeStringsEn = ["Back-end Developer", "Azure Specialist", "Cloud Computing", "Scalable Solutions"];
let typeIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typewriterTimeout;

function startTypewriter() {
    clearTimeout(typewriterTimeout);
    typeIndex = 0;
    charIndex = 0;
    isDeleting = false;
    type();
}

function type() {
    const el = document.getElementById('typewriter');
    if (!el) return;
    
    const strings = currentLang === 'en' ? typeStringsEn : typeStringsPt;
    const currentString = strings[typeIndex];
    
    if (isDeleting) {
        el.textContent = currentString.substring(0, charIndex - 1);
        charIndex--;
    } else {
        el.textContent = currentString.substring(0, charIndex + 1);
        charIndex++;
    }
    
    let typeSpeed = isDeleting ? 40 : 80;
    
    if (!isDeleting && charIndex === currentString.length) {
        typeSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        typeIndex = (typeIndex + 1) % strings.length;
        typeSpeed = 400;
    }
    
    typewriterTimeout = setTimeout(type, typeSpeed);
}

// =============================================
// PROJECT FILTERS
// =============================================
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card[data-category]');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const filter = btn.getAttribute('data-filter');
        
        projectCards.forEach(card => {
            const category = card.getAttribute('data-category');
            if (filter === 'all' || category.includes(filter)) {
                card.classList.remove('hidden');
                if (typeof gsap !== 'undefined') {
                    gsap.fromTo(card, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4 });
                }
            } else {
                card.classList.add('hidden');
            }
        });
    });
});

// =============================================
// AI CHATBOT LOGIC
// =============================================
const chatToggle = document.getElementById('chatbot-toggle');
const chatContainer = document.getElementById('chatbot-container');
const closeChat = document.getElementById('close-chat');
const chatInput = document.getElementById('chat-input');
const sendChat = document.getElementById('send-chat');
const chatMessages = document.getElementById('chatbot-messages');

if (chatToggle && chatContainer) {
    chatToggle.addEventListener('click', () => {
        chatContainer.classList.add('active');
        chatToggle.classList.add('hidden');
    });

    closeChat.addEventListener('click', () => {
        chatContainer.classList.remove('active');
        chatToggle.classList.remove('hidden');
    });

    const handleSend = async () => {
        const text = chatInput.value.trim();
        if (!text) return;
        
        const userMsg = document.createElement('div');
        userMsg.className = 'message user-message';
        userMsg.innerHTML = `<div class="message-content"><p>${text}</p></div>`;
        chatMessages.appendChild(userMsg);
        chatInput.value = '';
        chatMessages.scrollTop = chatMessages.scrollHeight;

        const aiMsg = document.createElement('div');
        aiMsg.className = 'message ai-message typing';
        aiMsg.innerHTML = `<div class="message-content"><div class="typing-dots"><span></span><span></span><span></span></div></div>`;
        chatMessages.appendChild(aiMsg);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: text })
            });

            if (!response.ok) {
                throw new Error("Erro na solicitação");
            }

            const data = await response.json();
            
            aiMsg.classList.remove('typing');
            
            // Verifica se a resposta contém HTML marckdown simples (ex: **negrito**)
            // O ideal seria usar uma lib como marked.js, mas o Gemini costuma mandar markdown
            const formattedText = data.response
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\n(.*)/g, '<br>$1');
                
            aiMsg.innerHTML = `<div class="message-content"><p>${formattedText}</p></div>`;

        } catch (error) {
            aiMsg.classList.remove('typing');
            const isEng = currentLang === 'en';
            aiMsg.innerHTML = `<div class="message-content"><p>${
                isEng 
                ? "Sorry, I couldn't connect to the backend server. Did you start the Flask application?" 
                : "Desculpe, não consegui me conectar ao servidor. O backend Flask está rodando?"
            }</p></div>`;
        }
        
        chatMessages.scrollTop = chatMessages.scrollHeight;
    };

    sendChat.addEventListener('click', handleSend);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend();
    });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initHeroAnimation();
        startTypewriter();
    });
} else {
    initHeroAnimation();
    startTypewriter();
}
