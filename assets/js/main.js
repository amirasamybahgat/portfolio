// Scroll to top on every page load/refresh
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

document.addEventListener('DOMContentLoaded', () => {
    /* ====================================
       1. LOADING SCREEN
       ==================================== */
    const loader = document.getElementById('loader');
    
    // Simulate loading or wait for window load
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
                // Trigger initial animations
                document.body.classList.add('loaded');
            }, 500);
        }, 1500); // 1.5s delay to show the animation
    });

    /* ====================================
       TYPEWRITER EFFECT
       ==================================== */
    const typingText = document.querySelector('.typing-text');
    if (typingText) {
        const words = ['User-Centered', 'Intuitive', 'Engaging'];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingDelay = 150;

        function type() {
            const currentWord = words[wordIndex];
            
            if (isDeleting) {
                typingText.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
                typingDelay = 50; // faster when deleting
            } else {
                typingText.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
                typingDelay = 150; // slower when typing
            }

            if (!isDeleting && charIndex === currentWord.length) {
                // finished typing a word, wait before deleting
                isDeleting = true;
                typingDelay = 2000; // wait 2s
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex++;
                if (wordIndex === words.length) {
                    wordIndex = 0; // loop back
                }
                typingDelay = 500; // wait half a second before typing next
            }

            setTimeout(type, typingDelay);
        }

        // Start typing shortly after load
        setTimeout(type, 1500); 
    }

    /* ====================================
       2. CUSTOM CURSOR
       ==================================== */
    const cursor = document.querySelector('.custom-cursor');
    const cursorFollower = document.querySelector('.custom-cursor-follower');
    const links = document.querySelectorAll('a, button, .magnetic-btn');

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        
        // Slight delay for follower
        setTimeout(() => {
            cursorFollower.style.left = e.clientX + 'px';
            cursorFollower.style.top = e.clientY + 'px';
        }, 50);
    });

    links.forEach(link => {
        link.addEventListener('mouseenter', () => {
            document.body.classList.add('cursor-hover');
        });
        link.addEventListener('mouseleave', () => {
            document.body.classList.remove('cursor-hover');
        });
    });

    /* ====================================
       3. DARK MODE TOGGLE
       ==================================== */
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const themeIcon = themeToggle.querySelector('i');

    // Check for saved theme — default is DARK
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        themeIcon.classList.replace('ph-moon', 'ph-sun');
    } else {
        body.classList.remove('dark-mode');
    }

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        
        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
            themeIcon.classList.replace('ph-moon', 'ph-sun');
            initGalaxy();
        } else {
            localStorage.setItem('theme', 'light');
            themeIcon.classList.replace('ph-sun', 'ph-moon');
            stopGalaxy();
        }
    });

    /* ====================================
       MOBILE MENU TOGGLE
       ==================================== */
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinksContainer = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-link');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinksContainer.classList.toggle('active');
            const icon = mobileMenuBtn.querySelector('i');
            if (navLinksContainer.classList.contains('active')) {
                icon.classList.replace('ph-list', 'ph-x');
            } else {
                icon.classList.replace('ph-x', 'ph-list');
            }
        });

        // Close menu when clicking a link
        navLinksItems.forEach(item => {
            item.addEventListener('click', () => {
                navLinksContainer.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                if (icon) icon.classList.replace('ph-x', 'ph-list');
            });
        });
    }

    /* ====================================
       GALAXY CANVAS ANIMATION
       ==================================== */
    const galaxyCanvas = document.getElementById('galaxy-canvas');
    const galaxyCtx = galaxyCanvas.getContext('2d');
    let galaxyAnimationId = null;
    let stars = [];
    let shootingStars = [];

    function initGalaxy() {
        resizeGalaxy();
        createStars();
        if (!galaxyAnimationId) animateGalaxy();
        window.addEventListener('resize', resizeGalaxy);
    }

    function stopGalaxy() {
        if (galaxyAnimationId) {
            cancelAnimationFrame(galaxyAnimationId);
            galaxyAnimationId = null;
        }
        galaxyCtx.clearRect(0, 0, galaxyCanvas.width, galaxyCanvas.height);
    }

    function resizeGalaxy() {
        galaxyCanvas.width = window.innerWidth;
        galaxyCanvas.height = window.innerHeight;
        createStars();
    }

    function createStars() {
        stars = [];
        const count = Math.floor((galaxyCanvas.width * galaxyCanvas.height) / 3000);
        for (let i = 0; i < count; i++) {
            stars.push({
                x: Math.random() * galaxyCanvas.width,
                y: Math.random() * galaxyCanvas.height,
                radius: Math.random() * 1.8 + 0.2,
                opacity: Math.random() * 0.7 + 0.3,
                twinkleSpeed: Math.random() * 0.02 + 0.005,
                twinkleDir: Math.random() > 0.5 ? 1 : -1,
                // Some stars have a slight purple/blue tint
                color: Math.random() > 0.7
                    ? `rgba(${160 + Math.random()*50|0}, ${100 + Math.random()*50|0}, ${220 + Math.random()*35|0},`
                    : 'rgba(230, 220, 255,'
            });
        }
    }

    function spawnShootingStar() {
        shootingStars.push({
            x: Math.random() * galaxyCanvas.width * 0.7,
            y: Math.random() * galaxyCanvas.height * 0.4,
            len: Math.random() * 180 + 80,
            speed: Math.random() * 8 + 6,
            opacity: 1,
            angle: Math.PI / 5
        });
    }

    function animateGalaxy() {
        galaxyAnimationId = requestAnimationFrame(animateGalaxy);
        galaxyCtx.clearRect(0, 0, galaxyCanvas.width, galaxyCanvas.height);

        // Draw nebula glow blobs
        const nebulaData = [
            { x: 0.15, y: 0.4, r: 0.35, col: 'rgba(80, 0, 140, 0.12)' },
            { x: 0.75, y: 0.2, r: 0.28, col: 'rgba(50, 0, 110, 0.1)' },
            { x: 0.55, y: 0.75, r: 0.3,  col: 'rgba(100, 0, 160, 0.09)' },
            { x: 0.9,  y: 0.6, r: 0.2,  col: 'rgba(60, 0, 130, 0.08)' },
        ];
        nebulaData.forEach(n => {
            const grd = galaxyCtx.createRadialGradient(
                n.x * galaxyCanvas.width, n.y * galaxyCanvas.height, 0,
                n.x * galaxyCanvas.width, n.y * galaxyCanvas.height, n.r * galaxyCanvas.width
            );
            grd.addColorStop(0, n.col);
            grd.addColorStop(1, 'transparent');
            galaxyCtx.fillStyle = grd;
            galaxyCtx.fillRect(0, 0, galaxyCanvas.width, galaxyCanvas.height);
        });

        // Draw & twinkle stars
        stars.forEach(star => {
            star.opacity += star.twinkleSpeed * star.twinkleDir;
            if (star.opacity >= 1 || star.opacity <= 0.15) star.twinkleDir *= -1;

            galaxyCtx.beginPath();
            galaxyCtx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            galaxyCtx.fillStyle = `${star.color}${star.opacity})`;
            galaxyCtx.fill();
        });

        // Shooting stars
        shootingStars.forEach((ss, i) => {
            ss.x += Math.cos(ss.angle) * ss.speed;
            ss.y += Math.sin(ss.angle) * ss.speed;
            ss.opacity -= 0.018;

            if (ss.opacity <= 0) {
                shootingStars.splice(i, 1);
                return;
            }

            const grad = galaxyCtx.createLinearGradient(
                ss.x, ss.y,
                ss.x - Math.cos(ss.angle) * ss.len,
                ss.y - Math.sin(ss.angle) * ss.len
            );
            grad.addColorStop(0, `rgba(220, 180, 255, ${ss.opacity})`);
            grad.addColorStop(1, 'transparent');

            galaxyCtx.beginPath();
            galaxyCtx.moveTo(ss.x, ss.y);
            galaxyCtx.lineTo(ss.x - Math.cos(ss.angle) * ss.len, ss.y - Math.sin(ss.angle) * ss.len);
            galaxyCtx.strokeStyle = grad;
            galaxyCtx.lineWidth = 1.5;
            galaxyCtx.stroke();
        });

        // Spawn shooting star randomly
        if (Math.random() < 0.003) spawnShootingStar();
    }

    // Init galaxy if dark mode was saved
    if (body.classList.contains('dark-mode')) {
        initGalaxy();
    }

    /* ====================================
       4. SCROLL PROGRESS
       ==================================== */
    const scrollProgress = document.getElementById('scroll-progress');
    const backToTop = document.getElementById('backToTop');
    const nav = document.querySelector('.floating-nav');

    window.addEventListener('scroll', () => {
        // Scroll Progress Bar
        const totalHeight = document.body.scrollHeight - window.innerHeight;
        const progress = (window.pageYOffset / totalHeight) * 100;
        scrollProgress.style.width = progress + '%';

        // Back to top button
        if (window.pageYOffset > 300) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }

        // Floating nav style
        if (window.pageYOffset > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    /* ====================================
       5. INTERSECTION OBSERVER (ANIMATIONS)
       ==================================== */
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // If it's a counter, trigger it
                if (entry.target.classList.contains('stat-card') || entry.target.querySelector('.counter')) {
                    triggerCounters();
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => {
        revealObserver.observe(el);
    });

    /* ====================================
       6. ANIMATED COUNTERS
       ==================================== */
    let countersAnimated = false;
    
    function triggerCounters() {
        if (countersAnimated) return;
        countersAnimated = true;
        
        const counters = document.querySelectorAll('.counter');
        const speed = 200; // lower = faster

        counters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText;
                const inc = target / speed;

                if (count < target) {
                    counter.innerText = Math.ceil(count + inc);
                    setTimeout(updateCount, 15);
                } else {
                    counter.innerText = target;
                }
            };
            updateCount();
        });
    }

    /* ====================================
       7. MAGNETIC BUTTONS
       ==================================== */
    const magneticBtns = document.querySelectorAll('.magnetic-btn');

    magneticBtns.forEach(btn => {
        let currentX = 0;
        let currentY = 0;

        btn.addEventListener('mousemove', function(e) {
            const rect = btn.getBoundingClientRect();
            
            // Calculate true center by subtracting the current transform translation
            // This prevents the violent feedback loop jitter!
            const trueLeft = rect.left - currentX;
            const trueTop = rect.top - currentY;
            
            const centerX = trueLeft + rect.width / 2;
            const centerY = trueTop + rect.height / 2;
            
            const deltaX = e.clientX - centerX;
            const deltaY = e.clientY - centerY;
            
            // Magnetic pull strength
            currentX = deltaX * 0.3;
            currentY = deltaY * 0.4;
            
            btn.style.transition = 'transform 0.1s ease-out';
            btn.style.transform = `translate(${currentX}px, ${currentY}px)`;
        });

        btn.addEventListener('mouseleave', function() {
            currentX = 0;
            currentY = 0;
            btn.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
            btn.style.transform = 'translate(0px, 0px)';
        });
    });

    /* ====================================
       8. TESTIMONIAL SLIDER
       ==================================== */
    const track = document.querySelector('.testimonial-track');
    const cards = document.querySelectorAll('.testimonial-card');
    const nextBtn = document.querySelector('.next-btn');
    const prevBtn = document.querySelector('.prev-btn');
    const dotsContainer = document.querySelector('.slider-dots');
    
    if (track && cards.length > 0) {
        let currentIndex = 0;

        // Create dots
        cards.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });

        const dots = document.querySelectorAll('.dot');
        
        // Initialize first card
        cards[0].classList.add('active');

        function updateSlider() {
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
            
            cards.forEach((card, index) => {
                if (index === currentIndex) {
                    card.classList.add('active');
                } else {
                    card.classList.remove('active');
                }
            });

            dots.forEach((dot, index) => {
                if (index === currentIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }

        function goToSlide(index) {
            currentIndex = index;
            updateSlider();
        }

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % cards.length;
            updateSlider();
        });

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + cards.length) % cards.length;
            updateSlider();
        });

        // Optional: Auto slide
        // setInterval(() => {
        //     currentIndex = (currentIndex + 1) % cards.length;
        //     updateSlider();
        // }, 5000);
    }

    /* ====================================
       9. ACTIVE NAV LINKS
       ==================================== */
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href').includes(current)) {
                item.classList.add('active');
            }
        });
    });

    /* ====================================
       10. FORM VALIDATION & WEB3FORMS SUBMISSION
       ==================================== */
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;

            const hCaptchaEl = form.querySelector('.h-captcha');
            const hCaptchaResponse = form.querySelector('textarea[name="h-captcha-response"]')?.value;
            if (hCaptchaEl && !hCaptchaResponse) {
                btn.innerHTML = '<span>Please complete the Captcha</span>';
                btn.style.backgroundColor = '#e67e22';
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.backgroundColor = '';
                }, 2500);
                return;
            }

            btn.disabled = true;
            btn.innerHTML = '<span>Sending...</span>';
            btn.style.opacity = '0.7';

            try {
                const formData = new FormData(form);
                const payload = Object.fromEntries(formData.entries());

                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                const result = await response.json();

                if (response.ok && result.success) {
                    btn.innerHTML = '<span>Message Sent!</span> <i class="ph ph-check"></i>';
                    btn.style.backgroundColor = '#28a745';
                    btn.style.opacity = '1';
                    form.reset();
                } else {
                    console.error('Web3Forms error:', result);
                    throw new Error(result.message || 'Submission failed');
                }
            } catch (error) {
                btn.innerHTML = '<span>Failed to Send. Try Again</span>';
                btn.style.backgroundColor = '#dc3545';
                btn.style.opacity = '1';
            } finally {
                if (typeof hcaptcha !== 'undefined') {
                    hcaptcha.reset();
                }
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.backgroundColor = '';
                    btn.style.opacity = '1';
                    btn.disabled = false;
                }, 3000);
            }
        });
    }

    /* ====================================
       11. PROJECT FILTER
       ==================================== */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');
            
            const filterValue = btn.getAttribute('data-filter');
            
            projectCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.classList.remove('hide');
                    // Re-trigger animation
                    card.classList.remove('active');
                    setTimeout(() => {
                        card.classList.add('active');
                    }, 50);
                } else {
                    card.classList.add('hide');
                    card.classList.remove('active');
                }
            });
        });
    });
});
