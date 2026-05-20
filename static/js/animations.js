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
    gsap.utils.toArray('.timeline-item').forEach((item) => {
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
 * 2. HERO TYPEWRITER — one-shot CSS animation on mobile
 */
function initMobileHeroTypewriter() {
    if (!isMobileDevice() || prefersReducedMotion) return;

    const heroH1 = document.querySelector('.hero h1');
    if (!heroH1) return;

    heroH1.classList.add('mob-typewriter');

    // After animation ends, clean up cursor
    heroH1.addEventListener('animationend', (e) => {
        if (e.animationName === 'mob-typing') {
            heroH1.classList.remove('mob-typewriter');
            heroH1.classList.add('mob-typewriter-done');
        }
    });
}

/**
 * 3. STACK PROGRESS BARS — animate width on viewport enter
 */
function initMobileStackBars() {
    if (!isMobileDevice() || prefersReducedMotion) return;

    const stackSection = document.getElementById('stack');
    if (!stackSection) return;

    const stackCards = stackSection.querySelectorAll('.stack-card[data-level]');
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

/**
 * 4. CARD FLIP — tap to flip project cards on mobile
 */
function initMobileCardFlip() {
    if (!isMobileDevice() || prefersReducedMotion) return;

    const cards = document.querySelectorAll('.project-card');

    cards.forEach(card => {
        // Wrap existing content in flip structure
        const existingContent = card.innerHTML;

        // Extract data for back face from the button's data attributes
        const btn = card.querySelector('.btn[onclick]');
        const title = btn ? (btn.getAttribute('data-title') || '') : '';
        const desc = btn ? (btn.getAttribute('data-desc') || '') : '';
        const link = btn ? (btn.getAttribute('data-link') || '#') : '#';
        const tags = card.querySelector('.tags');
        const tagsHTML = tags ? tags.outerHTML : '';

        card.innerHTML = `
            <div class="card-flip-inner">
                <div class="card-flip-front">${existingContent}</div>
                <div class="card-flip-back">
                    <h3>${title}</h3>
                    <p>${desc}</p>
                    ${tagsHTML}
                    <a href="${link}" target="_blank" class="btn btn-primary btn-sm" aria-label="Ver no GitHub">
                        <i class="fas fa-external-link-alt"></i> GitHub
                    </a>
                </div>
            </div>
        `;

        // Toggle flip on touch/click
        card.addEventListener('click', (e) => {
            // Don't flip if they clicked/tapped a link directly
            if (e.target.closest('a')) return;
            card.classList.toggle('flipped');
        });
    });
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