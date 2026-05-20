const header = document.getElementById('header');
if (header) {
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });
}

const revealSelectors = '.reveal, .reveal-left, .reveal-right, .reveal-scale';
const revealElements = document.querySelectorAll(revealSelectors);

if (!prefersReducedMotion) {
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

    revealElements.forEach((el) => {
        // Add stagger delay for cards in grids
        const parent = el.parentElement;
        if (parent && (parent.classList.contains('stack-grid') || parent.classList.contains('certs-grid') || parent.classList.contains('wave-grid') || parent.classList.contains('projects-grid'))) {
            const siblings = Array.from(parent.children);
            const index = siblings.indexOf(el);
            el.style.setProperty('--reveal-delay', `${index * 0.08}s`);
            el.style.transitionDelay = `${index * 0.08}s`;
        }
        revealObserver.observe(el);
    });
} else {
    revealElements.forEach(el => el.classList.add('revealed'));
}

const backToTopButton = document.getElementById('backToTop');
if (backToTopButton) {
    window.addEventListener('scroll', () => {
        backToTopButton.classList.toggle('show', window.scrollY > 400);
    }, { passive: true });

    backToTopButton.addEventListener('click', (e) => {
        e.preventDefault();
        if (typeof lenis !== 'undefined' && lenis && typeof lenis.scrollTo === 'function') {
            lenis.scrollTo(0, { immediate: prefersReducedMotion });
        } else {
            window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
        }
    });
}

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

if (closeModalBtn) closeModalBtn.onclick = () => modal.classList.remove('show');
window.onclick = (e) => { if (e.target === modal) modal.classList.remove('show'); };

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
        } catch {
            if (formStatus) { formStatus.textContent = 'Erro de conexão. Verifique sua internet.'; formStatus.dataset.state = 'error'; }
        } finally {
            if (submitBtn) submitBtn.disabled = false;
        }
    });
}

window.openModal = openModal;

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
                    gsap.fromTo(card, 
                        { opacity: 0, y: 30, scale: 0.95 }, 
                        { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "back.out(1.2)" }
                    );
                }
            } else {
                card.classList.add('hidden');
            }
        });
    });
});