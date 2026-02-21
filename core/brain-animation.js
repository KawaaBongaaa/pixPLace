/**
 * Neural Brain Animation Logic
 * Extracted and modularized for global usage
 */

(function () {
    'use strict';

    console.log("🧠 Brain Animation Module Initializing...");

    function initBrainAnimation() {
        const canvas = document.getElementById('brainCanvas');
        const container = document.getElementById('canvasContainer');

        if (!canvas || !container) {
            console.warn("🧠 Brain Animation: Canvas or Container not found. Skipping.");
            return;
        }

        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];

        // Configurations tuned for a "Constellation" vibe rather than a dense network
        const isMobile = window.innerWidth < 768;
        const particleCount = isMobile ? 25 : 55; // Fewer particles for sparser constellations
        const connectionDistance = isMobile ? 120 : 180; // Longer connections

        const mouseDistance = 250;

        // Mouse tracking
        let mouse = { x: null, y: null };

        // We track mouse on the window/document because the container might be behind other elements
        // and pointer-events: none might be set on it.
        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        window.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });

        /* Particle Class */
        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.2; // Slower, drifting speed
                this.vy = (Math.random() - 0.5) * 0.2;
                this.size = Math.random() * 2.5 + 1; // Slightly larger max size
                this.baseColor = '#38bdf8'; // Cyan to match theme
                // Twinkling properties - 20% slower
                this.alpha = Math.random();
                this.alphaDirection = Math.random() > 0.5 ? 1 : -1;
                this.twinkleSpeed = (Math.random() * 0.02 + 0.005) * 0.8;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Bounce off edges
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;

                // Mouse interaction
                if (mouse.x != null && mouse.y != null) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < mouseDistance) {
                        const forceDirectionX = dx / distance;
                        const forceDirectionY = dy / distance;
                        const force = (mouseDistance - distance) / mouseDistance;
                        // Much smoother attraction
                        this.vx += forceDirectionX * force * 0.005; // Reduced force (was 0.02)
                        this.vy += forceDirectionY * force * 0.005; // Reduced force (was 0.02)
                    }
                }

                // Speed Limit (Cap at ~0.4 to prevent "dizzying" speed)
                const maxSpeed = 0.4;
                const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
                if (speed > maxSpeed) {
                    this.vx = (this.vx / speed) * maxSpeed;
                    this.vy = (this.vy / speed) * maxSpeed;
                }
            }
            draw() {
                // Smooth twinkle effect
                this.alpha += this.twinkleSpeed * this.alphaDirection;
                if (this.alpha >= 1) {
                    this.alpha = 1;
                    this.alphaDirection = -1;
                } else if (this.alpha <= 0.2) { // don't fade out completely
                    this.alpha = 0.2;
                    this.alphaDirection = 1;
                }

                ctx.beginPath();

                // Create radial gradient for a glowing star effect
                let starGradient = ctx.createRadialGradient(
                    this.x, this.y, 0,
                    this.x, this.y, this.size * 2
                );

                // Center is solid cyan, fading to transparent at the edges
                starGradient.addColorStop(0, `rgba(56, 189, 248, ${this.alpha})`);
                starGradient.addColorStop(0.4, `rgba(56, 189, 248, ${this.alpha * 0.5})`);
                starGradient.addColorStop(1, 'rgba(56, 189, 248, 0)');

                ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);

                // Disable solid fill, use gradient
                ctx.fillStyle = starGradient;
                ctx.globalAlpha = 1; // Alpha handled by gradient
                ctx.fill();
            }
        }

        /* Initialization */
        function resize() {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;

            // Re-init particles on drastic resize? 
            // For now, let's just keep them or re-spawn if array is empty
            if (particles.length === 0) {
                spawnParticles();
            }
        }

        function spawnParticles() {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);

            for (let i = 0; i < particles.length; i++) {
                let p = particles[i];
                p.update();
                p.draw();

                // Track connections to avoid spiderweb centers
                let connections = 0;
                const maxConnections = 4; // Max 4 lines per point for constellation look

                // Connections
                for (let j = i + 1; j < particles.length; j++) {
                    if (connections >= maxConnections) break;

                    let p2 = particles[j];
                    let dx = p.x - p2.x;
                    let dy = p.y - p2.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < connectionDistance) {
                        connections++;

                        const distanceRatio = 1 - (distance / connectionDistance);

                        // Dynamic width based on distance
                        const dynamicLineWidth = 0.2 + (distanceRatio * 2.0);

                        // Create a gradient line so it fades out towards the middle or ends
                        let gradient = ctx.createLinearGradient(p.x, p.y, p2.x, p2.y);

                        // Use the particles' current twinkling alpha for the line ends
                        gradient.addColorStop(0, `rgba(56, 189, 248, ${p.alpha * distanceRatio})`);
                        gradient.addColorStop(0.5, `rgba(56, 189, 248, ${distanceRatio * 0.3})`); // Thinner/faded in middle
                        gradient.addColorStop(1, `rgba(56, 189, 248, ${p2.alpha * distanceRatio})`);

                        ctx.beginPath();
                        ctx.strokeStyle = gradient;
                        ctx.lineWidth = dynamicLineWidth;
                        ctx.globalAlpha = 1; // Alpha handled by gradient
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            }

            requestAnimationFrame(animate);
        }

        // Listen for window resize
        window.addEventListener('resize', () => {
            resize();
        });

        // Start
        resize();
        spawnParticles();
        animate();
        console.log("🧠 Brain Animation Started!");
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initBrainAnimation);
    } else {
        // slight delay to ensure elements are inserted if script runs immediately
        setTimeout(initBrainAnimation, 0);
    }

})();
