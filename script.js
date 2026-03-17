// 1. Custom Cursor with Lerp
const cursorDot = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');
const hoverTargets = document.querySelectorAll('.hover-target, a, button');

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let ringX = mouseX;
let ringY = mouseY;

window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Dot follows instantly
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
});

// Lerp loop for ring
function animateCursor() {
    // Lerp formula: current = current + (target - current) * smooth
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    
    cursorRing.style.left = `${ringX}px`;
    cursorRing.style.top = `${ringY}px`;
    
    requestAnimationFrame(animateCursor);
}
animateCursor();

// Hover effect
hoverTargets.forEach(target => {
    target.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
    target.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
});


// 2. Nav Frost on Scroll
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});


// 3. Scroll Reveal via IntersectionObserver
const revealElements = document.querySelectorAll('.reveal-up');

const revealOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const delay = entry.target.getAttribute('data-delay');
            if (delay) {
                entry.target.style.transitionDelay = `${delay}ms`;
            }
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, revealOptions);

revealElements.forEach(el => revealObserver.observe(el));

// Immediate hero reveal
window.addEventListener('load', () => {
    setTimeout(() => {
        document.querySelectorAll('.hero .reveal-up').forEach(el => {
            const delay = el.getAttribute('data-delay') || 0;
            el.style.transitionDelay = `${delay}ms`;
            el.classList.add('visible');
        });
    }, 200);
});


// 4. Parallax Effect
const heroGrid = document.getElementById('hero-grid');
const heroGlow = document.getElementById('hero-glow');

window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    if (scrolled < window.innerHeight) {
        heroGrid.style.transform = `translateY(${scrolled * 0.15}px)`;
        heroGlow.style.transform = `translateY(calc(-50% + ${scrolled * 0.25}px))`;
    }
});


// 5. Jersey 3D Tilt
const initTilt = (wrapperId, imgId) => {
    const wrapper = document.getElementById(wrapperId);
    const img = document.getElementById(imgId);
    if (!wrapper || !img) return;

    wrapper.addEventListener('mousemove', (e) => {
        const rect = wrapper.getBoundingClientRect();
        const x = e.clientX - rect.left; // x position within the element
        const y = e.clientY - rect.top;  // y position within the element
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -15; // Max 15deg
        const rotateY = ((x - centerX) / centerX) * 15;
        
        img.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    });

    wrapper.addEventListener('mouseleave', () => {
        img.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    });
};
initTilt('hero-jersey-wrapper', 'hero-jersey');
initTilt('buy-jersey-wrapper', 'buy-jersey-wrapper .jersey-img'); // selector adjustment


// 6. Stat Counters
const statItems = document.querySelectorAll('.stat-num');
const statsSection = document.querySelector('.stats-band');

let statsStarted = false;

const startCounters = () => {
    const duration = 1600; // 1.6s
    const steps = 60; // Assuming 60fps roughly
    const stepTime = duration / steps;
    
    statItems.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        const increment = target / steps;
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                stat.innerText = target;
                clearInterval(timer);
            } else {
                stat.innerText = Math.ceil(current);
            }
        }, stepTime);
    });
};

const statsObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !statsStarted) {
        statsStarted = true;
        startCounters();
    }
}, { threshold: 0.5 });

if (statsSection) {
    statsObserver.observe(statsSection);
}


// 7. Colorway Switcher removed (Section changed to generic products)


// 8. Random Glitch Effect
const heroTitle = document.querySelector('.hero-title');
setInterval(() => {
    // Random interval between 4 to 6 seconds simulated by checking random prob
    if (Math.random() > 0.5) {
        heroTitle.classList.add('glitch-active');
        setTimeout(() => {
            heroTitle.classList.remove('glitch-active');
        }, 200);
    }
}, 4000);


// 9. Particle Canvas
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

let particles = [];
let w, h;

function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

class Particle {
    constructor(x, y, isBurst = false) {
        this.x = x || Math.random() * w;
        this.y = y || h + Math.random() * 100;
        this.size = Math.random() * 3 + 1;
        this.speedY = Math.random() * -1 - 0.5;
        this.speedX = Math.random() * 1 - 0.5;
        
        if (isBurst) {
            this.speedY = (Math.random() - 0.5) * 8;
            this.speedX = (Math.random() - 0.5) * 8;
            this.life = 100;
        } else {
            this.life = Infinity;
        }
        
        // Red or Gold
        this.color = Math.random() > 0.5 ? '#CC0000' : '#D4AF37';
        this.opacity = Math.random() * 0.5 + 0.2;
    }
    
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        if (this.life !== Infinity) {
            this.life--;
            this.opacity = this.life / 100;
        } else {
            if (this.y < -10) {
                this.y = h + 10;
                this.x = Math.random() * w;
            }
        }
    }
    
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

for (let i = 0; i < 60; i++) {
    particles.push(new Particle());
}

function animateParticles() {
    ctx.clearRect(0, 0, w, h);
    
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        
        if (particles[i].life <= 0) {
            particles.splice(i, 1);
            i--;
        }
    }
    
    requestAnimationFrame(animateParticles);
}
animateParticles();

window.addEventListener('click', (e) => {
    // Burst 12 particles
    for (let i = 0; i < 12; i++) {
        particles.push(new Particle(e.clientX, e.clientY, true));
    }
});


// 10. Ticker Duplicate
const tickerContent = document.getElementById('ticker-content');
if (tickerContent) {
    const clone = tickerContent.cloneNode(true);
    clone.id = ''; // Remove id to avoid duplicates
    // We already have a CSS animation doing 100% translation, 
    // but a real infinite carousel requires doubling the text content or child elements.
    tickerContent.appendChild(clone.children[0].cloneNode(true));
    tickerContent.appendChild(clone.children[0].cloneNode(true));
}

// 11. Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});