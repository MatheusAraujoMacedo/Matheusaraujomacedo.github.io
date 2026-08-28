function initAll() {
    initHeroAnimation();
    startTypewriter();
    initScrollAnimations();

    initMobileScrollReveal();
    initStackBars();
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