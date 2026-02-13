// 1. Setup Three.js Scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('scene'), antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);

// 2. Create Heart Particles
const geometry = new THREE.BufferGeometry();
const pos = [];
for (let i = 0; i < 2000; i++) {
    const t = Math.random() * Math.PI * 2;
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = 13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t);
    const z = (Math.random() - 0.5) * 10;
    pos.push(x * 0.2, y * 0.2, z * 0.2);
}
geometry.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
const material = new THREE.PointsMaterial({ size: 0.06, color: 0xff2d55, transparent: true, blending: THREE.AdditiveBlending });
const heart = new THREE.Points(geometry, material);
scene.add(heart);

camera.position.z = 10;

// 3. GSAP Scrolling Magic
gsap.registerPlugin(ScrollTrigger);

// Rotate heart on scroll
gsap.to(heart.rotation, {
    y: Math.PI * 4,
    x: Math.PI * 1,
    scrollTrigger: {
        trigger: ".scroll-container",
        start: "top top",
        end: "bottom bottom",
        scrub: 1.5
    }
});

// Zoom into the heart as we get to the message
gsap.to(camera.position, {
    z: 4,
    scrollTrigger: {
        trigger: ".message",
        start: "top bottom",
        end: "top center",
        scrub: 1
    }
});

// 4. Animation Loop
function animate() {
    requestAnimationFrame(animate);
    heart.rotation.z += 0.002;
    renderer.render(scene, camera);
}
animate();

// Handle Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});