// =============================================
// INITIALIZATION & PREFERENCES
// =============================================
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// =============================================
// LENIS SMOOTH SCROLL
// =============================================
let lenis;
if (!prefersReducedMotion && typeof Lenis !== 'undefined') {
    lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        touchMultiplier: 1.5,
        infinite: false,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Connect Lenis to GSAP ScrollTrigger
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);
    }
}

// =============================================
// PARTICLE CANVAS BACKGROUND
// =============================================
const particleCanvas = document.getElementById('particle-bg');
if (particleCanvas) {
    const ctx = particleCanvas.getContext('2d');
    let particles = [];
    let mouseX = -1000;
    let mouseY = -1000;
    let canvasWidth, canvasHeight;
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 40 : 100;
    const connectionDistance = isMobile ? 110 : 160;
    const mouseConnectionDistance = isMobile ? 150 : 250;

    function resizeCanvas() {
        canvasWidth = window.innerWidth;
        canvasHeight = window.innerHeight;
        particleCanvas.width = canvasWidth;
        particleCanvas.height = canvasHeight;
    }

    function createParticles() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvasWidth,
                y: Math.random() * canvasHeight,
                vx: (Math.random() - 0.5) * 0.6,
                vy: (Math.random() - 0.5) * 0.6,
                baseRadius: Math.random() * 2 + 0.8,
                radius: 0,
                opacity: Math.random() * 0.5 + 0.2,
                pulseSpeed: Math.random() * 0.02 + 0.01,
                angle: Math.random() * Math.PI * 2
            });
        }
    }

    function drawParticles() {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        // Update and draw particles
        for (let i = 0; i < particles.length; i++) {
            let p = particles[i];
            
            // Pulse size effect
            p.angle += p.pulseSpeed;
            p.radius = p.baseRadius + Math.sin(p.angle) * (p.baseRadius * 0.4);

            // Mouse interaction
            const dx = p.x - mouseX;
            const dy = p.y - mouseY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // Interactive connection to mouse cursor
            if (dist < mouseConnectionDistance) {
                const opacity = (1 - dist / mouseConnectionDistance) * 0.5;
                ctx.beginPath();
                ctx.strokeStyle = `rgba(139, 92, 246, ${opacity})`; // Accent secondary (purple)
                ctx.lineWidth = 1.2;
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(mouseX, mouseY);
                ctx.stroke();

                // Subtle repulsion
                if (dist < 120) {
                    const force = (120 - dist) / 120;
                    p.vx += (dx / dist) * force * 0.08;
                    p.vy += (dy / dist) * force * 0.08;
                }
            }

            // Apply friction
            p.vx *= 0.98;
            p.vy *= 0.98;

            // Maintain a subtle base wander speed
            const currentSpeed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
            if (currentSpeed < 0.2) {
                p.vx += (Math.random() - 0.5) * 0.04;
                p.vy += (Math.random() - 0.5) * 0.04;
            }

            p.x += p.vx;
            p.y += p.vy;

            // Smooth wrap around edges
            if (p.x < -20) p.x = canvasWidth + 20;
            if (p.x > canvasWidth + 20) p.x = -20;
            if (p.y < -20) p.y = canvasHeight + 20;
            if (p.y > canvasHeight + 20) p.y = -20;

            // Connections to other particles
            for (let j = i + 1; j < particles.length; j++) {
                let p2 = particles[j];
                const dx2 = p.x - p2.x;
                const dy2 = p.y - p2.y;
                const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

                if (dist2 < connectionDistance) {
                    const opacity = (1 - dist2 / connectionDistance) * 0.25;
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`; // Accent (blue/indigo)
                    ctx.lineWidth = 0.8;
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }

            // Draw glow effect if near mouse
            if (dist < 150) {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius * 3.5, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(139, 92, 246, 0.15)`;
                ctx.fill();
            }

            // Draw core particle
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(99, 102, 241, ${Math.min(1, p.opacity + (dist < 150 ? 0.5 : 0))})`;
            ctx.fill();
        }

        if (!prefersReducedMotion) {
            requestAnimationFrame(drawParticles);
        }
    }

    resizeCanvas();
    createParticles();
    if (!prefersReducedMotion) {
        drawParticles();
    }

    window.addEventListener('resize', () => {
        resizeCanvas();
        createParticles();
    });

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    document.addEventListener('mouseleave', () => {
        mouseX = -1000;
        mouseY = -1000;
    });
}

// =============================================
// CURSOR FOLLOWING GLOW
// =============================================
const cursorGlow = document.getElementById('cursor-glow');
if (cursorGlow && !prefersReducedMotion && !isMobileDevice()) {
    let glowX = 0, glowY = 0;
    let targetX = 0, targetY = 0;

    document.addEventListener('mousemove', (e) => {
        targetX = e.clientX;
        targetY = e.clientY;
        cursorGlow.classList.add('active');
    });

    function animateGlow() {
        glowX += (targetX - glowX) * 0.08;
        glowY += (targetY - glowY) * 0.08;
        cursorGlow.style.left = glowX + 'px';
        cursorGlow.style.top = glowY + 'px';
        requestAnimationFrame(animateGlow);
    }
    animateGlow();
}

function isMobileDevice() {
    return window.innerWidth < 768 || 'ontouchstart' in window;
}



// =============================================
// HEADER SCROLL STATE
// =============================================
const header = document.getElementById('header');
if (header) {
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });
}

// =============================================
// REVEAL ON SCROLL (IntersectionObserver)
// =============================================
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

    revealElements.forEach((el, i) => {
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

// =============================================
// BACK TO TOP
// =============================================
const backToTopButton = document.getElementById('backToTop');
if (backToTopButton) {
    window.addEventListener('scroll', () => {
        backToTopButton.classList.toggle('show', window.scrollY > 400);
    }, { passive: true });
}

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

if (closeModalBtn) closeModalBtn.onclick = () => modal.classList.remove('show');
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
// GSAP HERO ANIMATION — Cinematic Entry
// =============================================
function initHeroAnimation() {
    if (typeof gsap === 'undefined' || prefersReducedMotion) return;

    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

    // Cinematic stagger for text
    tl.from(".hero-greeting", {
        x: -40,
        opacity: 0,
        duration: 1,
        delay: 0.2
    })
    .from(".hero h1", {
        y: 60,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out"
    }, "-=0.6")
    .from(".hero-role", {
        y: 30,
        opacity: 0,
        duration: 0.8
    }, "-=0.7")
    .from(".hero-desc", {
        y: 30,
        opacity: 0,
        duration: 0.8
    }, "-=0.5")
    .from(".hero-badges .badge", {
        scale: 0.8,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "back.out(1.7)"
    }, "-=0.4")
    .from(".hero-actions .btn", {
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1
    }, "-=0.3")
    // Hero image — dramatic scale + glow
    .from(".hero-image", {
        scale: 0.8,
        opacity: 0,
        duration: 1.5,
        ease: "power3.out"
    }, "-=1.2")
    .from(".hero-image img", {
        scale: 1.3,
        duration: 2.5,
        ease: "sine.out"
    }, "-=1.5")
    // Orbs fade in
    .from(".hero-orb", {
        scale: 0,
        opacity: 0,
        duration: 2,
        stagger: 0.2,
        ease: "power2.out"
    }, "-=2");
}

// =============================================
// GSAP SCROLL TRIGGER ANIMATIONS
// =============================================
function initScrollAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || prefersReducedMotion) return;

    gsap.registerPlugin(ScrollTrigger);

    // Section titles — clip reveal
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

    // Stack cards — bounce stagger
    const stackCards = gsap.utils.toArray('.stack-card');
    if (stackCards.length) {
        gsap.fromTo(stackCards, 
            { y: 50, opacity: 0, scale: 0.9 },
            {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 0.7,
                stagger: 0.08,
                ease: "back.out(1.4)",
                scrollTrigger: {
                    trigger: '.stack-grid',
                    start: "top 80%",
                    toggleActions: "play none none none"
                }
            }
        );
    }

    // Cert cards — scale in
    const certCards = gsap.utils.toArray('.cert-card');
    if (certCards.length) {
        gsap.fromTo(certCards,
            { scale: 0.8, opacity: 0 },
            {
                scale: 1,
                opacity: 1,
                duration: 0.8,
                stagger: 0.12,
                ease: "back.out(1.5)",
                scrollTrigger: {
                    trigger: '.certs-grid',
                    start: "top 80%",
                    toggleActions: "play none none none"
                }
            }
        );
    }

    // Timeline items — alternate slide
    gsap.utils.toArray('.timeline-item').forEach((item, i) => {
        const isLeft = item.classList.contains('timeline-left');
        gsap.from(item.querySelector('.timeline-content'), {
            x: isLeft ? -60 : 60,
            opacity: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
                trigger: item,
                start: "top 82%",
                toggleActions: "play none none none"
            }
        });

        gsap.from(item.querySelector('.timeline-dot'), {
            scale: 0,
            duration: 0.5,
            ease: "back.out(2)",
            scrollTrigger: {
                trigger: item,
                start: "top 82%",
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

// =============================================
// 3D TILT EFFECT — Project Cards
// =============================================
function initTiltCards() {
    if (prefersReducedMotion || isMobileDevice()) return;

    const tiltCards = document.querySelectorAll('.tilt-card');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const cardCenterX = rect.left + rect.width / 2;
            const cardCenterY = rect.top + rect.height / 2;

            const mouseX = e.clientX - cardCenterX;
            const mouseY = e.clientY - cardCenterY;

            const rotateX = (-mouseY / (rect.height / 2)) * 6;
            const rotateY = (mouseX / (rect.width / 2)) * 6;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

            // Update shine position
            const shine = card.querySelector('.card-shine');
            if (shine) {
                const percentX = ((e.clientX - rect.left) / rect.width) * 100;
                const percentY = ((e.clientY - rect.top) / rect.height) * 100;
                shine.style.setProperty('--mouse-x', percentX + '%');
                shine.style.setProperty('--mouse-y', percentY + '%');
            }
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            card.style.transition = 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)';
        });

        card.addEventListener('mouseenter', () => {
            card.style.transition = 'transform 0.1s ease-out';
        });
    });
}

// =============================================
// MAGNETIC BUTTONS
// =============================================
function initMagneticButtons() {
    if (prefersReducedMotion || isMobileDevice()) return;

    const magneticBtns = document.querySelectorAll('.magnetic-btn');

    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
            btn.style.transition = 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)';
        });

        btn.addEventListener('mouseenter', () => {
            btn.style.transition = 'transform 0.1s ease-out';
        });

        // Ripple effect on click
        btn.addEventListener('click', (e) => {
            const rect = btn.getBoundingClientRect();
            const ripple = document.createElement('span');
            ripple.className = 'btn-ripple';
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
            ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
            btn.appendChild(ripple);
            ripple.addEventListener('animationend', () => ripple.remove());
        });
    });
}

// =============================================
// HERO MOUSE PARALLAX (Orbs)
// =============================================
function initHeroParallax() {
    if (prefersReducedMotion || isMobileDevice()) return;

    const orbs = document.querySelectorAll('.hero-orb');
    const heroSection = document.querySelector('.hero');

    if (!heroSection || !orbs.length) return;

    heroSection.addEventListener('mousemove', (e) => {
        const rect = heroSection.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const mouseX = e.clientX - rect.left - centerX;
        const mouseY = e.clientY - rect.top - centerY;

        orbs.forEach((orb, i) => {
            const speed = (i + 1) * 0.015;
            const x = mouseX * speed;
            const y = mouseY * speed;
            orb.style.transform = `translate(${x}px, ${y}px)`;
        });
    });
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

// =============================================
// AI CHATBOT LOGIC
// =============================================
const chatToggle = document.getElementById('chatbot-toggle');
const chatContainer = document.getElementById('chatbot-container');
const closeChat = document.getElementById('close-chat');
const chatInput = document.getElementById('chat-input');
const sendChat = document.getElementById('send-chat');
const chatMessages = document.getElementById('chatbot-messages');
const chatToggleWrapper = document.querySelector('.chatbot-toggle-wrapper');
const chatTooltip = document.getElementById('chatbot-tooltip');
const closeTooltipBtn = document.getElementById('close-tooltip');

if (chatToggle && chatContainer) {
    // Tooltip animation logic
    if (chatTooltip) {
        setTimeout(() => {
            if (!chatContainer.classList.contains('active')) {
                chatTooltip.classList.add('show');
                setTimeout(() => chatTooltip.classList.add('bounce'), 600);
            }
        }, 5000);

        if (closeTooltipBtn) {
            closeTooltipBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                chatTooltip.classList.remove('show', 'bounce');
            });
        }
    }

    chatToggle.addEventListener('click', () => {
        chatContainer.classList.add('active');
        if (chatToggleWrapper) chatToggleWrapper.classList.add('hidden');
        if (chatTooltip) chatTooltip.classList.remove('show', 'bounce');
    });

    closeChat.addEventListener('click', () => {
        chatContainer.classList.remove('active');
        if (chatToggleWrapper) chatToggleWrapper.classList.remove('hidden');
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
            const API_URL = '/api/chat';

            const response = await fetch(API_URL, {
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
            
            const formattedText = data.response
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\n(.*)/g, '<br>$1');
                
            aiMsg.innerHTML = `<div class="message-content"><p>${formattedText}</p></div>`;

        } catch (error) {
            aiMsg.classList.remove('typing');
            const isEng = currentLang === 'en';
            aiMsg.innerHTML = `<div class="message-content"><p>${
                isEng 
                ? "Sorry, I couldn't connect to the AI API. Please verify the Cloudflare setup." 
                : "Desculpe, não consegui me conectar à API da IA. Verifique as configurações do Cloudflare."
            }</p></div>`;
        }
        
        chatMessages.scrollTop = chatMessages.scrollHeight;
    };

    sendChat.addEventListener('click', handleSend);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend();
    });
}

// =============================================
// INITIALIZE EVERYTHING
// =============================================
function initAll() {
    initHeroAnimation();
    startTypewriter();
    initScrollAnimations();
    initTiltCards();
    initMagneticButtons();
    initHeroParallax();

    // Fallback: if GSAP/ScrollTrigger didn't load, make gsap-reveal elements visible
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || prefersReducedMotion) {
        document.querySelectorAll('.gsap-reveal').forEach(el => {
            el.style.opacity = '1';
        });
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
} else {
    initAll();
}
