// Register GSAP Plugins
gsap.registerPlugin(ScrollTrigger);

// Custom Cursor Logic
const cursorDot = document.getElementById('cursor-dot');
const cursorCircle = document.getElementById('cursor-circle');
let mouseX = 0, mouseY = 0;
let circleX = 0, circleY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Dot follows instantly
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top = mouseY + 'px';
});

// Smooth circle follow
function animateCursor() {
    circleX += (mouseX - circleX) * 0.15;
    circleY += (mouseY - circleY) * 0.15;

    cursorCircle.style.left = circleX + 'px';
    cursorCircle.style.top = circleY + 'px';

    requestAnimationFrame(animateCursor);
}
animateCursor();

// Hover Interactions
const hoverTargets = document.querySelectorAll('a, button, .hover-underline-purple, .cursor-none-target');

hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('hover-link'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('hover-link'));
});

// Animations
// 1. Hero Reveal
const tl = gsap.timeline();

tl.from(".logo-reveal", {
    y: -50,
    opacity: 0,
    duration: 1,
    ease: "power4.out"
})
    .from(".hero-text h1", {
        y: 100,
        opacity: 0,
        duration: 1.2,
        stagger: 0.1,
        ease: "power4.out"
    }, "-=0.5")
    .from(".hero-element", {
        y: 20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out"
    }, "-=0.8");

// 2. Scroll Animations (Simple fade ups)
gsap.utils.toArray("section").forEach(section => {
    gsap.from(section, {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
            trigger: section,
            start: "top 80%",
            toggleActions: "play none none reverse"
        }
    });
});

console.log("V6 Editorial Loaded.");
