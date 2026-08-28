function initHeroAnimation() {
    if (typeof gsap === 'undefined' || prefersReducedMotion) return;

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.from(".hero-greeting", { y: 12, opacity: 0, duration: 0.6, delay: 0.15 })
        .from(".hero h1", { y: 28, opacity: 0, duration: 0.8 }, "-=0.35")
        .from(".hero-desc", { y: 16, opacity: 0, duration: 0.6 }, "-=0.5")
        .from(".hero-badges .badge", { y: 10, opacity: 0, duration: 0.45, stagger: 0.08 }, "-=0.35")
        .from(".hero-actions .btn", { y: 10, opacity: 0, duration: 0.45, stagger: 0.08 }, "-=0.3")
        // O terminal abre como janela e as linhas entram na ordem em que foram executadas
        .from(".hero-terminal", { y: 24, opacity: 0, duration: 0.7 }, "-=0.9")
        .from(".term-body > *", { opacity: 0, duration: 0.28, stagger: 0.09 }, "-=0.3");
}

function initScrollAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || prefersReducedMotion) return;

    gsap.registerPlugin(ScrollTrigger);

    // Titulos de secao
    gsap.utils.toArray('.section-title').forEach(title => {
        gsap.from(title, {
            y: 40,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: title,
                start: "top 85%",
                toggleActions: "play none none none"
            }
        });
    });

    // Linhas da stack — entram em cascata curta
    const stackCards = gsap.utils.toArray('.stack-card');
    if (stackCards.length) {
        gsap.fromTo(stackCards, 
            { y: 16, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.5,
                stagger: 0.05,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: '.stack-grid',
                    start: "top 80%",
                    toggleActions: "play none none none"
                }
            }
        );
    }

    // Certificacoes
    const certCards = gsap.utils.toArray('.cert-card');
    if (certCards.length) {
        gsap.fromTo(certCards,
            { y: 16, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.6,
                stagger: 0.08,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: '.certs-grid',
                    start: "top 80%",
                    toggleActions: "play none none none"
                }
            }
        );
    }

    // Linhas do log — sobem na ordem de leitura
    gsap.utils.toArray('.timeline-item').forEach((item) => {
        gsap.from(item, {
            y: 24,
            opacity: 0,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: {
                trigger: item,
                start: "top 88%",
                toggleActions: "play none none none"
            }
        });
    });

    // Contact form — subtle rise
    const contactWrapper = document.querySelector('.contact-wrapper');
    if (contactWrapper) {
        gsap.fromTo(contactWrapper,
            { y: 50, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: contactWrapper,
                    start: "top 85%",
                    toggleActions: "play none none none"
                }
            }
        );
    }
}

const typeStringsPt = ["Analista de TI · ITOps", "Automação de processos com n8n", "Resolução de incidentes", "Scripts que devolvem horas ao time"];
const typeStringsEn = ["IT Analyst · ITOps", "Process automation with n8n", "Incident resolution", "Scripts that give hours back"];
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
    
    let typeSpeed = isDeleting ? 35 : 70;
    
    if (!isDeleting && charIndex === currentString.length) {
        typeSpeed = 2200;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        typeIndex = (typeIndex + 1) % strings.length;
        typeSpeed = 500;
    }
    
    typewriterTimeout = setTimeout(type, typeSpeed);
}

/**
 * 1. MOBILE SCROLL REVEAL
 * Adds .mob-reveal to sections and .mob-reveal-child to their children.
 * Uses IntersectionObserver to add .mob-visible on enter.
 */
function initMobileScrollReveal() {
    if (!isMobileDevice() || prefersReducedMotion) return;

    const targetSections = document.querySelectorAll(
        '#about, #stack, #projects, #journey, #certs, #skills, #contact'
    );

    targetSections.forEach(section => {
        // Mark section container for reveal
        const container = section.querySelector('.container');
        if (!container) return;
        container.classList.add('mob-reveal');

        // Find direct meaningful children to stagger
        const children = container.querySelectorAll(
            '.about-text, .highlight-item, .stack-card, .project-card, ' +
            '.timeline-item, .cert-card, .wave-card, .contact-wrapper, ' +
            '.section-title, .project-filters'
        );
        children.forEach((child, i) => {
            child.classList.add('mob-reveal-child');
            child.style.setProperty('--mob-delay', `${i * 0.1}s`);
        });
    });

    const mobObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('mob-visible');
                mobObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

    document.querySelectorAll('.mob-reveal').forEach(el => {
        mobObserver.observe(el);
    });
}

/**
 * Medidor de frequencia da stack — preenche ao entrar na viewport
 */
function initStackBars() {
    if (prefersReducedMotion) return;

    const stackSection = document.getElementById('stack');
    if (!stackSection) return;

    const stackCards = stackSection.querySelectorAll('.stack-card[data-level]');
    // Zera antes de observar; o CSS ja garante o nivel final sem JS
    stackCards.forEach(card => {
        const bar = card.querySelector('.stack-progress-bar');
        if (bar) bar.style.width = '0';
    });
    let animated = false;

    const barObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animated = true;
                stackCards.forEach((card, i) => {
                    const level = card.getAttribute('data-level') || '50';
                    const bar = card.querySelector('.stack-progress-bar');
                    if (bar) {
                        setTimeout(() => {
                            bar.style.width = level + '%';
                            card.classList.add('bar-animated');
                        }, i * 120);
                    }
                });
                barObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    barObserver.observe(stackSection);
}

function initMobileFloatingCTA() {
    if (!isMobileDevice()) return;

    const cta = document.getElementById('mobile-float-cta');
    const contactSection = document.getElementById('contact');
    if (!cta || !contactSection) return;

    const ctaObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            cta.classList.toggle('mob-cta-hidden', entry.isIntersecting);
        });
    }, { threshold: 0.15 });

    ctaObserver.observe(contactSection);
}