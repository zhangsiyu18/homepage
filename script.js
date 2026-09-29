/* ===== 导航栏 ===== */
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
});

navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    navMenu.classList.toggle('open');
});

navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('open');
        navMenu.classList.remove('open');
    });
});

/* ===== 打字机效果 ===== */
const typedEl = document.getElementById('typedText');
const phrases = ['一名大一新生', '编程爱好者', '舞蹈少女', '终身学习者'];
let phraseIdx = 0, charIdx = 0, deleting = false;

function typeLoop() {
    const current = phrases[phraseIdx];
    typedEl.textContent = current.slice(0, charIdx);

    if (!deleting) {
        if (charIdx < current.length) {
            charIdx++;
            setTimeout(typeLoop, 120);
        } else {
            deleting = true;
            setTimeout(typeLoop, 1800);
        }
    } else {
        if (charIdx > 0) {
            charIdx--;
            setTimeout(typeLoop, 60);
        } else {
            deleting = false;
            phraseIdx = (phraseIdx + 1) % phrases.length;
            setTimeout(typeLoop, 400);
        }
    }
}
typeLoop();

/* ===== 滚动显现 & 技能条动画 ===== */
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        entry.target.querySelectorAll('.skill-progress').forEach(bar => {
            bar.classList.add('animate');
        });
        observer.unobserve(entry.target);
    });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

/* ===== 导航高亮当前区块 ===== */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 120;
    sections.forEach(sec => {
        const top = sec.offsetTop;
        const bottom = top + sec.offsetHeight;
        if (scrollY >= top && scrollY < bottom) {
            navLinks.forEach(l => l.classList.toggle(
                'active', l.getAttribute('href') === '#' + sec.id
            ));
        }
    });
});

/* ===== Hero 粒子背景 ===== */
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}

function createParticles() {
    const count = Math.min(90, Math.floor(canvas.width / 14));
    particles = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.8 + 0.6,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4
    }));
}

function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const linkDist = 120;

    particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(79, 140, 255, 0.6)';
        ctx.fill();
    });

    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.hypot(dx, dy);
            if (dist < linkDist) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(79, 140, 255, ${0.18 * (1 - dist / linkDist)})`;
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(drawParticles);
}

function initParticles() {
    resizeCanvas();
    createParticles();
}
initParticles();
drawParticles();
window.addEventListener('resize', initParticles);
