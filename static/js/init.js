function initAll() {
    initHeroAnimation();
    startTypewriter();
    initScrollAnimations();
    initTiltCards();
    initMagneticButtons();
    initHeroParallax();

    initMobileScrollReveal();
    initMobileHeroTypewriter();
    initMobileStackBars();
    initMobileCardFlip();
    initMobileFloatingCTA();

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