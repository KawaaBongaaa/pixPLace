// Snowfall Animation System
class SnowfallSystem {
    constructor() {
        this.container = null;
        this.snowflakes = [];
        this.animationId = null;
        this.isActive = false;
        this.maxFlakes = 180;
        this.windStrength = 0.3;
    }

    init() {
        // Create container if it doesn't exist
        this.container = document.querySelector('.snowfall-system');
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.className = 'snowfall-system';
            this.container.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 10000;
                overflow: hidden;
                will-change: transform;
            `;
            document.body.appendChild(this.container);
        }
    }

    createSnowflake() {
        const snowflake = document.createElement('div');
        snowflake.innerHTML = Math.random() > 0.5 ? '❄' : '❅'; '.'; '*';
        const depth = Math.random(); // 0 = closest, 1 = farthest
        snowflake.style.cssText = `
            position: absolute;
            font-size: ${Math.max(0.5, Math.random() * 1.5 + 0.5 - depth * 0.5)}rem;
            color: rgba(255, 255, 255, ${Math.max(0.1, Math.random() * 0.6 + 0.2 - depth * 0.4)});
            pointer-events: none;
            font-weight: 100;
            user-select: none;
            z-index: ${10001 - Math.floor(depth * 10)};
            will-change: transform, left, top;
            opacity: ${0.3 + (1 - depth) * 0.7};
        `;

        // Natural scattered start positions across full screen height
        snowflake.x = Math.random() * window.innerWidth;
        snowflake.y = Math.random() * window.innerHeight - 100; // Random position from -100 to screen height
        snowflake.speed = Math.random() * 3.5 + 1.5;
        snowflake.wind = (Math.random() - 0.5) * this.windStrength;
        snowflake.rotation = Math.random() * 360;
        snowflake.rotationSpeed = (Math.random() - 0.5) * 2;

        // Spiral motion parameters
        snowflake.spiralRadius = Math.random() * 30 + 10; // Spiral radius variation
        snowflake.spiralSpeed = (Math.random() - 0.5) * 0.02; // Very slow spiral motion
        snowflake.spiralAngle = Math.random() * Math.PI * 2; // Random starting angle
        snowflake.startX = snowflake.x; // Remember starting horizontal position

        // Smoother floating motion
        snowflake.floatAmplitude = Math.random() * 5 + 2; // Gentle side-to-side motion
        snowflake.floatFrequency = Math.random() * 0.01 + 0.005;

        snowflake.style.left = snowflake.x + 'px';
        snowflake.style.top = snowflake.y + 'px';

        this.container.appendChild(snowflake);
        return snowflake;
    }

    updateSnowflake(snowflake) {
        // Base vertical movement
        snowflake.y += snowflake.speed;

        // Complex horizontal movement: wind + spiral + floating motion
        const spiralOffset = Math.cos(snowflake.spiralAngle) * snowflake.spiralRadius * 0.1;
        const floatOffset = Math.sin(snowflake.y * snowflake.floatFrequency) * snowflake.floatAmplitude;

        snowflake.x += snowflake.wind + spiralOffset + floatOffset;
        snowflake.rotation += snowflake.rotationSpeed;

        // Update spiral angle for slow spiraling motion
        snowflake.spiralAngle += snowflake.spiralSpeed;

        // Reset snowflake when it falls off screen
        if (snowflake.y > window.innerHeight + 50) {
            // Reset with natural scattered positioning
            snowflake.y = -50 - Math.random() * 100;
            snowflake.x = Math.random() * window.innerWidth;
            snowflake.speed = Math.random() * 3.5 + 1.5;
            snowflake.wind = (Math.random() - 0.5) * this.windStrength;

            // Reset spiral and floating parameters
            snowflake.spiralAngle = Math.random() * Math.PI * 2;
            snowflake.startX = snowflake.x;
        }

        snowflake.style.left = snowflake.x + 'px';
        snowflake.style.top = snowflake.y + 'px';
        snowflake.style.transform = `rotate(${snowflake.rotation}deg)`;
    }

    animate() {
        if (!this.isActive) return;

        this.snowflakes.forEach(snowflake => {
            this.updateSnowflake(snowflake);
        });

        this.animationId = requestAnimationFrame(() => this.animate());
    }

    start() {
        if (this.isActive) return;

        this.init();
        this.isActive = true;

        // Create initial snowflakes
        for (let i = 0; i < this.maxFlakes; i++) {
            this.snowflakes.push(this.createSnowflake());
        }

        this.animate();
    }

    stop() {
        this.isActive = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }

        // Clear all snowflakes from DOM
        this.snowflakes.forEach(snowflake => {
            if (snowflake.parentNode) {
                snowflake.parentNode.removeChild(snowflake);
            }
        });
        this.snowflakes = [];
    }

    setActive(active) {
        if (active) {
            this.start();
        } else {
            this.stop();
            if (this.container) {
                this.container.style.display = 'none';
            }
        }
    }

    updateWind(strength) {
        this.windStrength = strength;
    }
}

// Auto-initialize when loading screen is active
document.addEventListener('DOMContentLoaded', function() {
    const snowfall = new SnowfallSystem();

    // Check for loading screen activation
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'class') {
                const hasActive = document.body.classList.contains('has-loading-screen') ||
                                document.querySelector('#loadingScreen.active');
                snowfall.setActive(hasActive);
            }
        });
    });

    observer.observe(document.body, {
        attributes: true,
        attributeFilter: ['class']
    });

    // Also check for loadingScreen element class changes
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        const loadingObserver = new MutationObserver(function(mutations) {
            const isLoadingActive = loadingScreen.classList.contains('active');
            snowfall.setActive(isLoadingActive);
        });

        loadingObserver.observe(loadingScreen, {
            attributes: true,
            attributeFilter: ['class']
        });
    }

    // Start if already active
    const isAlreadyActive = document.querySelector('#loadingScreen.active');
    if (isAlreadyActive) {
        snowfall.setActive(true);
    }
});

// Export for manual control
window.SnowfallSystem = SnowfallSystem;
