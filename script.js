// Magical neon cursor trail effect
document.addEventListener('DOMContentLoaded', function() {
    // Mobile detection for performance optimization
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;

    // Create custom visible cursor (only on desktop)
    function createCustomCursor() {
        if (isMobile) return; // Skip cursor creation on mobile
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        document.body.appendChild(cursor);

        let mouseX = 0;
        let mouseY = 0;
        let animationId;

        // Throttled cursor position update for better performance
        function updateCursorPosition() {
            cursor.style.left = (mouseX - 10) + 'px';
            cursor.style.top = (mouseY - 10) + 'px';
        }

        // Update cursor position with requestAnimationFrame for smooth performance
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            if (animationId) {
                cancelAnimationFrame(animationId);
            }

            animationId = requestAnimationFrame(updateCursorPosition);
        });

        // Add click effect
        document.addEventListener('mousedown', () => {
            cursor.classList.add('clicking');
        });

        document.addEventListener('mouseup', () => {
            cursor.classList.remove('clicking');
        });

        // Add hover effects for interactive elements
        const interactiveElements = document.querySelectorAll('button, a, .social-btn, .gallery-item');
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursor.classList.add('hovering');
            });

            element.addEventListener('mouseleave', () => {
                cursor.classList.remove('hovering');
            });
        });

        // Hide cursor when mouse leaves window
        document.addEventListener('mouseleave', () => {
            cursor.style.opacity = '0';
        });

        // Show cursor when mouse enters window
        document.addEventListener('mouseenter', () => {
            cursor.style.opacity = '1';
        });
    }

    // Initialize custom cursor
    createCustomCursor();

    // Initialize neon cursor effect (only on desktop for performance)
    async function initNeonCursor() {
        if (isMobile) {
            console.log('Neon cursor disabled on mobile for better performance');
            return;
        }

        try {
            // Import the neon cursor from threejs-toys
            const { neonCursor } = await import('https://unpkg.com/threejs-toys@0.0.8/build/threejs-toys.module.cdn.min.js');

            // Initialize the neon cursor with optimized settings for better performance
            neonCursor({
                el: document.body,
                shaderPoints: 8,    // Reduced from 16 for better performance
                curvePoints: 40,    // Reduced from 80 for better performance
                curveLerp: 0.3,     // Reduced for smoother animation
                radius1: 3,
                radius2: 20,        // Reduced from 30
                velocityTreshold: 15, // Increased threshold
                sleepRadiusX: 80,   // Reduced sleep radius
                sleepRadiusY: 80,
                sleepTimeCoefX: 0.005, // Increased for faster sleep
                sleepTimeCoefY: 0.005,
                color: 0x9900ff, // Magical purple color
                thickness: 2.5,  // Reduced thickness
                opacity: 0.6     // Reduced opacity for better performance
            });

            console.log('Neon cursor initialized successfully!');
        } catch (error) {
            console.error('Failed to load neon cursor:', error);
            // Fallback to simple cursor trail if neon cursor fails
            initFallbackCursor();
        }
    }

    // Fallback cursor effect if neon cursor fails to load
    function initFallbackCursor() {
        let mouseX = 0;
        let mouseY = 0;
        let particles = [];
        let time = 0;

        // Create fallback particles
        function createFallbackParticles() {
            for (let i = 0; i < 8; i++) {
                const particle = document.createElement('div');
                particle.className = 'fallback-cursor-particle';
                particle.style.position = 'fixed';
                particle.style.width = '8px';
                particle.style.height = '8px';
                particle.style.background = `hsl(${45 + i * 45}, 100%, 60%)`;
                particle.style.borderRadius = '50%';
                particle.style.pointerEvents = 'none';
                particle.style.zIndex = '9999';
                particle.style.boxShadow = `0 0 15px hsl(${45 + i * 45}, 100%, 60%)`;
                particle.style.opacity = '0.8';
                particle.style.transition = 'all 0.1s ease-out';
                document.body.appendChild(particle);

                particles.push({
                    element: particle,
                    x: mouseX,
                    y: mouseY,
                    targetX: mouseX,
                    targetY: mouseY,
                    delay: i * 0.05
                });
            }
        }

        // Update mouse position
        document.addEventListener('mousemove', function(e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // Animate fallback particles
        function animateFallback() {
            time += 0.02;

            particles.forEach((particle, index) => {
                // Delayed following effect
                const delay = 0.1 - (index * 0.01);
                particle.targetX = mouseX;
                particle.targetY = mouseY;

                particle.x += (particle.targetX - particle.x) * delay;
                particle.y += (particle.targetY - particle.y) * delay;

                particle.element.style.left = particle.x - 4 + 'px';
                particle.element.style.top = particle.y - 4 + 'px';

                // Pulsing effect
                const scale = 0.5 + 0.5 * Math.sin(time * 2 + index * 0.5);
                particle.element.style.transform = `scale(${scale})`;
            });

            requestAnimationFrame(animateFallback);
        }

        createFallbackParticles();
        animateFallback();
    }

    // Initialize the neon cursor
    initNeonCursor();

    // Add magical cursor interactions
    addCursorInteractions();

    function addCursorInteractions() {
        // Add hover effects for interactive elements
        const interactiveElements = document.querySelectorAll('button, a, .social-btn, .gallery-item');

        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', function() {
                // Add a subtle glow to the element when hovered
                this.style.filter = 'drop-shadow(0 0 10px rgba(153, 0, 255, 0.5))';
                this.style.transition = 'filter 0.3s ease';
            });

            element.addEventListener('mouseleave', function() {
                this.style.filter = 'none';
            });
        });

        // Add special effect for the hero section (optimized for performance)
        const heroSection = document.querySelector('.hero');
        if (heroSection && !isMobile) {
            let lastSparkleTime = 0;
            heroSection.addEventListener('mousemove', function(e) {
                const now = Date.now();
                // Throttle sparkle creation to max once per 200ms and reduce probability
                if (now - lastSparkleTime > 200 && Math.random() < 0.05) { // 5% chance, max 5 per second
                    createSparkle(e.clientX, e.clientY);
                    lastSparkleTime = now;
                }
            });
        }
    }

    function createSparkle(x, y) {
        const sparkle = document.createElement('div');
        sparkle.className = 'cursor-sparkle';
        sparkle.style.position = 'fixed';
        sparkle.style.left = x + 'px';
        sparkle.style.top = y + 'px';
        sparkle.style.width = '4px';
        sparkle.style.height = '4px';
        sparkle.style.background = '#ffff00';
        sparkle.style.borderRadius = '50%';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.zIndex = '10000';
        sparkle.style.boxShadow = '0 0 6px #ffff00';
        sparkle.style.animation = 'sparkleAnimation 1s ease-out forwards';

        document.body.appendChild(sparkle);

        // Remove sparkle after animation
        setTimeout(() => {
            if (sparkle.parentNode) {
                sparkle.parentNode.removeChild(sparkle);
            }
        }, 1000);
    }

    // Hide trail when mouse leaves window (fixed reference)
    document.addEventListener('mouseleave', function() {
        const cursor = document.querySelector('.custom-cursor');
        if (cursor) cursor.style.opacity = '0';
    });

    // Show trail when mouse enters window (fixed reference)
    document.addEventListener('mouseenter', function() {
        const cursor = document.querySelector('.custom-cursor');
        if (cursor) cursor.style.opacity = '1';
    });

    // Add sparkle effect on click (optimized for performance)
    document.addEventListener('click', function(e) {
        if (!isMobile) {
            createSparkleExplosion(e.clientX, e.clientY);
        }
    });

    function createSparkleExplosion(x, y) {
        const sparkleCount = isMobile ? 0 : 6; // Reduce sparkles and disable on mobile
        for (let i = 0; i < sparkleCount; i++) {
            const sparkle = document.createElement('div');
            sparkle.style.position = 'fixed';
            sparkle.style.left = x + 'px';
            sparkle.style.top = y + 'px';
            sparkle.style.width = '4px';
            sparkle.style.height = '4px';
            sparkle.style.background = '#ffff00';
            sparkle.style.borderRadius = '50%';
            sparkle.style.pointerEvents = 'none';
            sparkle.style.zIndex = '9999';
            
            const angle = (i / 8) * Math.PI * 2;
            const velocity = 50 + Math.random() * 50;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;
            
            document.body.appendChild(sparkle);
            
            let posX = x;
            let posY = y;
            let opacity = 1;
            
            function animateSparkle() {
                posX += vx * 0.02;
                posY += vy * 0.02;
                opacity -= 0.02;
                
                sparkle.style.left = posX + 'px';
                sparkle.style.top = posY + 'px';
                sparkle.style.opacity = opacity;
                
                if (opacity > 0) {
                    requestAnimationFrame(animateSparkle);
                } else {
                    document.body.removeChild(sparkle);
                }
            }
            
            animateSparkle();
        }
    }

    // Enhanced magical gallery loading
    const galleryGrid = document.querySelector('.gallery-grid');
    const imageCount = 21; // mim1.png to mim21.png

    // Rotation values for hand-drawn effect
    const rotations = [-2, 1, -1, 2, -3, 1, -1, 2, -2, 1, -3, 2, -1, 1, -2, 3, -1, 2, -2, 1, -1];

    // Create magical gallery items with staggered animations
    for (let i = 1; i <= imageCount; i++) {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item fade-in-up';
        galleryItem.style.setProperty('--rotation', `${rotations[i-1]}deg`);
        galleryItem.style.setProperty('--animation-delay', `${i * 0.15}s`);
        galleryItem.style.setProperty('--float-y', `${Math.sin(i) * 5}px`);
        galleryItem.style.animationDelay = `${i * 0.1}s`;

        const img = document.createElement('img');
        img.src = `images/mim${i}.png`;
        img.alt = `Magic Internet Money ${i}`;
        img.loading = 'lazy';

        // Add error handling for missing images
        img.onerror = function() {
            galleryItem.style.display = 'none';
        };

        galleryItem.appendChild(img);
        galleryGrid.appendChild(galleryItem);

        // Enhanced hover effects with magical particles
        galleryItem.addEventListener('mouseenter', function() {
            createMagicalParticles(this);
            this.style.animationPlayState = 'paused';
        });

        galleryItem.addEventListener('mouseleave', function() {
            this.style.animationPlayState = 'running';
        });
    }

    // Create magical particles around gallery items
    function createMagicalParticles(element) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.innerHTML = ['✨', '⭐', '🌟', '💫', '✦', '🔮', '⚡'][Math.floor(Math.random() * 7)];
                particle.style.position = 'fixed';
                particle.style.left = centerX + (Math.random() - 0.5) * 80 + 'px';
                particle.style.top = centerY + (Math.random() - 0.5) * 80 + 'px';
                particle.style.fontSize = Math.random() * 8 + 12 + 'px';
                particle.style.pointerEvents = 'none';
                particle.style.zIndex = '9999';
                particle.style.opacity = '1';

                // Random direction for particle movement
                const tx = (Math.random() - 0.5) * 200;
                const ty = -Math.random() * 150 - 50;
                particle.style.setProperty('--tx', tx + 'px');
                particle.style.setProperty('--ty', ty + 'px');

                particle.style.animation = 'magicalFloat 2.5s ease-out forwards';
                particle.style.filter = `hue-rotate(${Math.random() * 360}deg)`;

                document.body.appendChild(particle);

                setTimeout(() => {
                    if (document.body.contains(particle)) {
                        document.body.removeChild(particle);
                    }
                }, 2500);
            }, i * 80);
        }
    }

    // Scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);

    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });

    // Add magical hover effects to buttons
    document.querySelectorAll('.hand-drawn-btn').forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.filter = 'brightness(1.2) saturate(1.3)';
            createMiniSparkles(this);
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.filter = 'none';
        });
    });

    function createMiniSparkles(element) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                const sparkle = document.createElement('div');
                sparkle.innerHTML = '✨';
                sparkle.style.position = 'fixed';
                sparkle.style.left = centerX + (Math.random() - 0.5) * 60 + 'px';
                sparkle.style.top = centerY + (Math.random() - 0.5) * 60 + 'px';
                sparkle.style.fontSize = '12px';
                sparkle.style.pointerEvents = 'none';
                sparkle.style.zIndex = '9999';
                sparkle.style.animation = 'sparkleFloat 2s ease-out forwards';
                
                document.body.appendChild(sparkle);
                
                setTimeout(() => {
                    if (document.body.contains(sparkle)) {
                        document.body.removeChild(sparkle);
                    }
                }, 2000);
            }, i * 200);
        }
    }

    // Add parallax effect to floating characters
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallax = scrolled * 0.5;
        
        document.querySelectorAll('.floating-char').forEach((char, index) => {
            const speed = 0.3 + (index * 0.1);
            char.style.transform = `translateY(${parallax * speed}px)`;
        });
    });

    // Add typing effect to hero subtitle
    const subtitle = document.querySelector('.hero-subtitle');
    const originalText = subtitle.textContent;
    subtitle.textContent = '';
    
    let i = 0;
    function typeWriter() {
        if (i < originalText.length) {
            subtitle.textContent += originalText.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    }
    
    // Start typing effect after a delay
    setTimeout(typeWriter, 1000);

    // Add random twinkling to sparkles (optimized for performance)
    if (!isMobile) {
        setInterval(() => {
            document.querySelectorAll('.sparkle').forEach(sparkle => {
                if (Math.random() > 0.8) { // Reduced frequency from 0.7 to 0.8
                    sparkle.style.boxShadow = '0 0 10px #ffff00';
                    setTimeout(() => {
                        sparkle.style.boxShadow = 'none';
                    }, 200);
                }
            });
        }, 2000); // Increased interval from 1000ms to 2000ms
    }
});

// Contract address copy functionality
function copyContract() {
    const contractAddress = document.getElementById('contractAddress').textContent;
    const copyText = document.querySelector('.copy-text');
    const contractBtn = document.querySelector('.contract-btn');

    // Copy to clipboard
    navigator.clipboard.writeText(contractAddress).then(function() {
        // Success feedback
        copyText.textContent = '✅ Copied!';
        contractBtn.style.borderColor = '#00ff00';
        contractBtn.style.boxShadow = '0 0 30px rgba(0, 255, 0, 0.5)';

        // Create success sparkles
        createCopySparkles(contractBtn);

        // Reset after 2 seconds
        setTimeout(() => {
            copyText.textContent = 'Click to Copy';
            contractBtn.style.borderColor = '#ffff00';
            contractBtn.style.boxShadow = '0 0 20px rgba(255, 255, 0, 0.3), inset 0 0 20px rgba(255, 255, 0, 0.1)';
        }, 2000);
    }).catch(function(err) {
        // Error feedback
        copyText.textContent = '❌ Failed to copy';
        contractBtn.style.borderColor = '#ff0000';

        // Reset after 2 seconds
        setTimeout(() => {
            copyText.textContent = 'Click to Copy';
            contractBtn.style.borderColor = '#ffff00';
        }, 2000);
    });
}

// Create sparkles when contract is copied
function createCopySparkles(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    for (let i = 0; i < 12; i++) {
        setTimeout(() => {
            const sparkle = document.createElement('div');
            sparkle.innerHTML = ['💰', '✨', '🪙', '💎', '⭐'][Math.floor(Math.random() * 5)];
            sparkle.style.position = 'fixed';
            sparkle.style.left = centerX + (Math.random() - 0.5) * 100 + 'px';
            sparkle.style.top = centerY + (Math.random() - 0.5) * 100 + 'px';
            sparkle.style.fontSize = Math.random() * 10 + 16 + 'px';
            sparkle.style.pointerEvents = 'none';
            sparkle.style.zIndex = '9999';
            sparkle.style.opacity = '1';

            // Random direction for particle movement
            const tx = (Math.random() - 0.5) * 300;
            const ty = -Math.random() * 200 - 100;
            sparkle.style.setProperty('--tx', tx + 'px');
            sparkle.style.setProperty('--ty', ty + 'px');

            sparkle.style.animation = 'magicalFloat 3s ease-out forwards';
            sparkle.style.filter = `hue-rotate(${Math.random() * 360}deg)`;

            document.body.appendChild(sparkle);

            setTimeout(() => {
                if (document.body.contains(sparkle)) {
                    document.body.removeChild(sparkle);
                }
            }, 3000);
        }, i * 100);
    }
}
