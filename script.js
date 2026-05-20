/* ============================================================
   PORTFOLIO — script.js
   Sarvepalli Manoj Kumar
============================================================ */

// ── CURSOR ──────────────────────────────────────────────────
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');
let mx = 0, my = 0, fx = 0, fy = 0;

document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top = my + 'px';
});

(function animFollower() {
    fx += (mx - fx) * 0.12;
    fy += (my - fy) * 0.12;
    follower.style.left = fx + 'px';
    follower.style.top = fy + 'px';
    requestAnimationFrame(animFollower);
})();

document.querySelectorAll('a, button, .pill, .info-card, .project-card, .achievement-card').forEach(el => {
    el.addEventListener('mouseenter', () => { follower.style.width = '60px'; follower.style.height = '60px'; follower.style.borderColor = 'rgba(0,212,255,.6)'; });
    el.addEventListener('mouseleave', () => { follower.style.width = '36px'; follower.style.height = '36px'; follower.style.borderColor = 'rgba(124,106,255,.5)'; });
});

// ── NAVBAR SCROLL ────────────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// ── HAMBURGER ────────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');
hamburger.addEventListener('click', () => {
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
    navLinks.style.flexDirection = 'column';
    navLinks.style.position = 'absolute';
    navLinks.style.top = '70px';
    navLinks.style.left = '0';
    navLinks.style.right = '0';
    navLinks.style.background = 'rgba(5,8,16,.97)';
    navLinks.style.padding = '1.5rem 5%';
    navLinks.style.gap = '1.5rem';
    navLinks.style.borderBottom = '1px solid rgba(255,255,255,.07)';
});

// ── PARTICLE CANVAS ──────────────────────────────────────────
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
    constructor() { this.reset(); }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.r = Math.random() * 1.5 + .5;
        this.vx = (Math.random() - .5) * .3;
        this.vy = (Math.random() - .5) * .3;
        this.life = Math.random();
        this.alpha = Math.random() * .6 + .2;
    }
    update() {
        this.x += this.vx; this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(124,106,255,${this.alpha})`;
        ctx.fill();
    }
}

for (let i = 0; i < 100; i++) particles.push(new Particle());

function drawLines() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(124,106,255,${(1 - dist / 120) * 0.15})`;
                ctx.lineWidth = .5;
                ctx.stroke();
            }
        }
    }
}

function animParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    requestAnimationFrame(animParticles);
}
animParticles();

// ── SCROLL REVEAL ────────────────────────────────────────────
const reveals = document.querySelectorAll('.reveal, .project-card, .skill-category, .timeline-item, .achievement-card, .testimonial-card');
reveals.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── SKILL BAR ANIMATION ──────────────────────────────────────
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.skill-fill').forEach(bar => bar.classList.add('animated'));
        }
    });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-category').forEach(el => skillObserver.observe(el));

// ── HERO TYPEWRITER ──────────────────────────────────────────
const roles = ['Cyber Security Graduate', 'Java Developer', 'Gen AI Enthusiast', 'IoT Security Builder'];
let ri = 0, ci = 0, deleting = false;
const typeEl = document.querySelector('.hero-title .line:last-child');

if (typeEl) {
    const baseText = '';
    function type() {
        const current = roles[ri];
        if (!deleting) {
            ci++;
            typeEl.innerHTML = current.slice(0, ci) + ' <span class="gradient-text">●</span>';
            if (ci === current.length) { deleting = true; setTimeout(type, 2000); return; }
        } else {
            ci--;
            typeEl.innerHTML = current.slice(0, ci) + ' <span class="gradient-text">●</span>';
            if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; }
        }
        setTimeout(type, deleting ? 60 : 100);
    }
    // Reset second line for typing effect
    typeEl.innerHTML = '<span class="gradient-text">●</span>';
    setTimeout(type, 1500);
}

// ── CONTACT FORM ─────────────────────────────────────────────
const form = document.getElementById('contactForm');
const successMsg = document.getElementById('formSuccess');

form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = document.getElementById('contact-submit-btn');
    btn.textContent = 'Sending…';
    btn.disabled = true;
    setTimeout(() => {
        form.reset();
        btn.textContent = 'Send Message ✦';
        btn.disabled = false;
        successMsg.style.display = 'block';
        setTimeout(() => { successMsg.style.display = 'none'; }, 4000);
    }, 1200);
});

// ── SMOOTH ACTIVE NAV ────────────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navItems.forEach(a => {
                a.style.color = a.getAttribute('href') === '#' + entry.target.id
                    ? 'var(--text)' : '';
            });
        }
    });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

// ── PILL HOVER STAGGER ───────────────────────────────────────
document.querySelectorAll('.pill').forEach((pill, i) => {
    pill.style.animationDelay = `${i * 50}ms`;
});

// ── FLOATING CARDS PARALLAX ──────────────────────────────────
const cards = document.querySelectorAll('.floating-card');
document.addEventListener('mousemove', e => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;
    cards.forEach((card, i) => {
        const depth = (i + 1) * 8;
        card.style.transform = `translate(${dx * depth}px, ${dy * depth}px)`;
    });
});
