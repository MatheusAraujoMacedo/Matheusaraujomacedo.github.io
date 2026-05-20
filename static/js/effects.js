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