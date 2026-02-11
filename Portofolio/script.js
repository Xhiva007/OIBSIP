document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('header');
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const heroSubtitle = document.getElementById('rotating-profession');
    const ctaBtn = document.querySelector('.cta-btn');
    const hireBtns = document.querySelectorAll('.hire-btn');
    const aboutBtn = document.querySelector('.about-btn');
    const socialIcons = document.querySelectorAll('.social-icon');

    const professions = [
        'Full-Stack Developer',
        'Frontend Engineer', 
        'Backend Developer',
        'UI/UX Enthusiast',
        'Problem Solver',
        'Tech Innovator'
    ];

    let professionIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 150;

    function typeWriter() {
        if (!heroSubtitle) return;
        
        const currentProfession = professions[professionIndex];
        const cursor = '<span class="cursor">|</span>';
        
        if (isDeleting) {
            heroSubtitle.innerHTML = "I'm a " + currentProfession.substring(0, charIndex - 1) + cursor;
            charIndex--;
            typingSpeed = 75;
        } else {
            heroSubtitle.innerHTML = "I'm a " + currentProfession.substring(0, charIndex + 1) + cursor;
            charIndex++;
            typingSpeed = 150;
        }

        if (!isDeleting && charIndex === currentProfession.length) {
            typingSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            professionIndex = (professionIndex + 1) % professions.length;
            typingSpeed = 500; 
        }

        setTimeout(typeWriter, typingSpeed);
    }

    function toggleMobileMenu() {
        hamburger?.classList.toggle('active');
        navMenu?.classList.toggle('active');
        document.body.style.overflow = navMenu?.classList.contains('active') ? 'hidden' : 'auto';
    }

    function smoothScroll(event) {
        event.preventDefault();
        const targetId = this.getAttribute('href');
        
        if (targetId && targetId.startsWith('#')) {
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = header?.offsetHeight || 80;
                const offsetTop = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });

                if (navMenu?.classList.contains('active')) {
                    toggleMobileMenu();
                }

                updateActiveNavLink(targetId);
            }
        }
    }

    function updateActiveNavLink(activeId) {
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === activeId) {
                link.classList.add('active');
            }
        });
    }

    function handleScroll() {
        const scrollY = window.scrollY;
        if (scrollY > 50) {
            header?.classList.add('scrolled');
        } else {
            header?.classList.remove('scrolled');
        }
    }

    function updateActiveNavFromScroll() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + (header?.offsetHeight || 80) + 10;

        let activeSection = null;
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                activeSection = section;
            }
        });

        if (activeSection) {
            const id = '#' + activeSection.getAttribute('id');
            updateActiveNavLink(id);
            if (history.replaceState) {
                history.replaceState(null, null, id);
            }
        } else if (window.scrollY < 100) {
            updateActiveNavLink('#home');
        }
    }

    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    function setupAnimations() {
        const animatedElements = document.querySelectorAll(
            '.hero-stats .stat, .about-highlights .highlight, .floating-card, .social-icon, .animate-on-scroll'
        );
        
        animatedElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            el.style.transitionDelay = `${index * 0.1}s`;
            animationObserver.observe(el);
        });
    }

    function handleButtonClick(event) {
        const button = event.currentTarget;
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        button.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);

        if (button.classList.contains('cta-btn') || button.textContent.includes('Hire')) {
            const contactSection = document.querySelector('#contact');
            if (contactSection) {
                const headerHeight = header?.offsetHeight || 80;
                window.scrollTo({
                    top: contactSection.offsetTop - headerHeight,
                    behavior: 'smooth'
                });
            } else {
                showNotification('Contact section coming soon!', 'info');
            }
        } else if (button.textContent.includes('Download CV')) {
            showNotification('CV download will be available soon!', 'info');
        }
    }

    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'info' ? 'info-circle' : 'check-circle'}"></i>
            <span>${message}</span>
        `;
        
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: type === 'info' ? '#3b82f6' : '#10b981',
            color: 'white',
            padding: '1rem 1.5rem',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            zIndex: '9999',
            transform: 'translateX(120%)',
            transition: 'transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)'
        });
        
        document.body.appendChild(notification);
        
        notification.offsetHeight; 

        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(120%)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    function handleKeyboard(event) {
        if (event.key === 'Escape' && navMenu?.classList.contains('active')) {
            toggleMobileMenu();
        }
    }

    let ticking = false;
    function optimizedScrollHandler() {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleScroll();
                updateActiveNavFromScroll();
                ticking = false;
            });
            ticking = true;
        }
    }

    let resizeTimeout;
    function handleResize() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (window.innerWidth >= 769 && navMenu?.classList.contains('active')) {
                toggleMobileMenu();
            }
        }, 250);
    }

    function initializeActiveNav() {
        const hash = window.location.hash || '#home';
        updateActiveNavLink(hash);
        
        if (hash !== '#home') {
            setTimeout(() => {
                const targetElement = document.querySelector(hash);
                if (targetElement) {
                    const headerHeight = header?.offsetHeight || 80;
                    window.scrollTo({
                        top: targetElement.offsetTop - headerHeight,
                        behavior: 'smooth'
                    });
                }
            }, 500);
        }
    }

    hamburger?.addEventListener('click', toggleMobileMenu);
    navLinks.forEach(link => {
        link.addEventListener('click', smoothScroll);
    });

    [ctaBtn, ...hireBtns, aboutBtn].forEach(btn => {
        if (btn) btn.addEventListener('click', handleButtonClick);
    });

    window.addEventListener('scroll', optimizedScrollHandler);
    window.addEventListener('resize', handleResize);
    document.addEventListener('keydown', handleKeyboard);

    document.addEventListener('click', (event) => {
        if (navMenu?.classList.contains('active') && 
            !navMenu.contains(event.target) && 
            !hamburger?.contains(event.target)) {
            toggleMobileMenu();
        }
    });

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            if (!data.name || !data.email || !data.message) {
                showNotification('Please fill in all required fields', 'info');
                return;
            }
            showNotification('Message sent successfully!', 'success');
            this.reset();
        });
    }

    function init() {
        if (heroSubtitle) typeWriter();
        setupAnimations();
        initializeActiveNav();
        handleScroll();
        document.body.classList.add('loaded');
    }

    const style = document.createElement('style');
    style.textContent = `
        .ripple { position: absolute; border-radius: 50%; background: rgba(255, 255, 255, 0.4); transform: scale(0); animation: ripple 0.6s linear; pointer-events: none; }
        @keyframes ripple { to { transform: scale(4); opacity: 0; } }
        .cursor { animation: blink 1s infinite; margin-left: 2px; }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
    `;
    document.head.appendChild(style);

    init();
});