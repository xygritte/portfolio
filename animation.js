// ===== ANIMATION.JS =====
// Custom scroll reveal and animation system for portfolio website

class ScrollAnimator {
    constructor() {
        this.observer = null;
        this.animatedElements = new Set();
        this.init();
    }

    init() {
        this.createObserver();
        this.bindEvents();
        this.animateOnLoad();
    }

    createObserver() {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.handleIntersect(entry.target);
                }
            });
        }, options);
    }

    bindEvents() {
        // Observe elements on DOM load
        document.addEventListener('DOMContentLoaded', () => {
            this.observeElements();
        });

        // Re-observe on resize (for responsive changes)
        window.addEventListener('resize', () => {
            this.observeElements();
        });

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            // Note: We use arrow function here or .bind(this) to keep context if needed, 
            // but smoothScroll needs the element context for 'this.getAttribute', 
            // so we handle it inside the function logic.
            link.addEventListener('click', this.smoothScroll);
        });

        // Parallax effect for hero section
        window.addEventListener('scroll', this.handleParallax);
    }

    observeElements() {
        const elements = document.querySelectorAll([
            '.animate-fade-up',
            '.animate-slide-up',
            '.animate-slide-left',
            '.animate-slide-right',
            '.animate-zoom-in',
            '.animate-fade-in'
        ].join(','));

        elements.forEach(element => {
            if (!this.animatedElements.has(element)) {
                this.observer.observe(element);
                this.animatedElements.add(element);
            }
        });
    }

    handleIntersect(element) {
        const rect = element.getBoundingClientRect();
        const delay = (rect.top % 300) * 0.1;

        setTimeout(() => {
            element.classList.add('animate-visible');
            
            if (element.classList.contains('animate-fade-up') || 
                element.classList.contains('animate-slide-up') ||
                element.classList.contains('animate-slide-left') ||
                element.classList.contains('animate-slide-right')) {
                setTimeout(() => {
                    element.style.transform = 'none';
                }, 600);
            }
        }, delay);
    }

    smoothScroll(e) {
        e.preventDefault();
        // 'this' here refers to the clicked element (the link) because it was added via addEventListener
        const targetId = this.getAttribute('href');
        
        // FIXED: Prevent crash if targetId is just "#" or invalid
        if (!targetId || targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            const navbar = document.querySelector('.navbar');
            const headerHeight = navbar ? navbar.offsetHeight : 0;
            const targetPosition = targetElement.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            const navMenu = document.querySelector('.nav-menu');
            const navToggle = document.querySelector('.nav-toggle');
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        }
    }

    handleParallax() {
        const scrolled = window.pageYOffset;
        const heroContent = document.querySelector('.hero-content');
        
        if (heroContent) {
            const rate = scrolled * -0.5;
            heroContent.style.transform = `translateY(${rate}px)`;
            
            const opacity = 1 - (scrolled / 500);
            heroContent.style.opacity = Math.max(opacity, 0.3);
        }
    }

    animateOnLoad() {
        window.addEventListener('load', () => {
            const heroTitle = document.querySelector('.hero-title');
            const heroSubtitle = document.querySelector('.hero-subtitle');
            const heroDescription = document.querySelector('.hero-description');
            const heroButtons = document.querySelector('.hero-buttons');

            if (heroTitle) setTimeout(() => heroTitle.classList.add('animate-visible'), 200);
            if (heroSubtitle) setTimeout(() => heroSubtitle.classList.add('animate-visible'), 400);
            if (heroDescription) setTimeout(() => heroDescription.classList.add('animate-visible'), 600);
            if (heroButtons) setTimeout(() => heroButtons.classList.add('animate-visible'), 800);
        });
    }
}

// ===== MICRO INTERACTIONS =====
class MicroInteractions {
    constructor() {
        this.init();
    }

    init() {
        this.addButtonHoverEffects();
        this.addCardHoverEffects();
        this.addFormInteractions();
        this.addSkillBarAnimations();
    }

    addButtonHoverEffects() {
        document.querySelectorAll('.btn').forEach(button => {
            button.addEventListener('mouseenter', this.buttonHoverIn);
            button.addEventListener('mouseleave', this.buttonHoverOut);
        });
    }

    buttonHoverIn(e) {
        const button = e.target;
        button.style.transform = 'translateY(-2px) scale(1.02)';
        
        if (button.classList.contains('btn-primary')) {
            button.style.boxShadow = '0 10px 30px rgba(0, 255, 255, 0.4)';
        } else if (button.classList.contains('btn-secondary')) {
            button.style.boxShadow = '0 10px 30px rgba(157, 78, 221, 0.4)';
        }
    }

    buttonHoverOut(e) {
        const button = e.target;
        button.style.transform = 'translateY(0) scale(1)';
        button.style.boxShadow = '';
    }

    addCardHoverEffects() {
        document.querySelectorAll('.skill-card, .project-card').forEach(card => {
            card.addEventListener('mouseenter', this.cardHoverIn);
            card.addEventListener('mouseleave', this.cardHoverOut);
        });
    }

    cardHoverIn(e) {
        const card = e.target.closest('.skill-card, .project-card');
        if (card) {
            card.style.transform = card.classList.contains('project-card') 
                ? 'translateY(-10px) scale(1.02)' 
                : 'translateY(-5px)';
            
            if (card.classList.contains('skill-card')) {
                card.style.boxShadow = '0 20px 40px rgba(0, 255, 255, 0.2)';
            }
        }
    }

    cardHoverOut(e) {
        const card = e.target.closest('.skill-card, .project-card');
        if (card) {
            card.style.transform = '';
            card.style.boxShadow = '';
        }
    }

    addFormInteractions() {
        document.querySelectorAll('.form-input').forEach(input => {
            input.addEventListener('focus', this.formFocusIn);
            input.addEventListener('blur', this.formFocusOut);
        });
    }

    formFocusIn(e) {
        const input = e.target;
        input.style.transform = 'scale(1.02)';
        input.style.borderColor = '#00ffff';
        if(input.parentElement) input.parentElement.style.transform = 'translateY(-2px)';
    }

    formFocusOut(e) {
        const input = e.target;
        input.style.transform = 'scale(1)';
        input.style.borderColor = '#333';
        if(input.parentElement) input.parentElement.style.transform = 'translateY(0)';
    }

    addSkillBarAnimations() {
        document.querySelectorAll('.skill-card').forEach((card, index) => {
            card.addEventListener('mouseenter', () => {
                const icon = card.querySelector('.skill-icon');
                if (icon) {
                    icon.style.transform = 'scale(1.1) rotate(5deg)';
                }
            });

            card.addEventListener('mouseleave', () => {
                const icon = card.querySelector('.skill-icon');
                if (icon) {
                    icon.style.transform = 'scale(1) rotate(0deg)';
                }
            });
        });
    }
}

// ===== PAGE TRANSITIONS =====
class PageTransitions {
    constructor() {
        this.init();
    }

    init() {
        this.addLoadingAnimation();
        this.addScrollProgress();
    }

    addLoadingAnimation() {
        window.addEventListener('load', () => {
            document.body.classList.add('page-loaded');
            setTimeout(() => {
                document.body.classList.remove('loading');
            }, 1000);
        });

        document.addEventListener('DOMContentLoaded', () => {
            document.body.classList.add('loading');
        });
    }

    addScrollProgress() {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, #00ffff, #9d4edd);
            z-index: 1001;
            transition: width 0.1s ease;
        `;
        document.body.appendChild(progressBar);

        window.addEventListener('scroll', () => {
            const winHeight = window.innerHeight;
            const docHeight = document.documentElement.scrollHeight - winHeight;
            const scrolled = (window.pageYOffset / docHeight) * 100;
            progressBar.style.width = `${scrolled}%`;
        });
    }
}

// ===== CURSOR EFFECTS =====
class CursorEffects {
    constructor() {
        this.cursor = null;
        this.init();
    }

    init() {
        if (window.matchMedia('(pointer: fine)').matches) {
            this.createCustomCursor();
            this.bindCursorEvents();
        }
    }

    createCustomCursor() {
        this.cursor = document.createElement('div');
        this.cursor.className = 'custom-cursor';
        this.cursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            border: 2px solid #00ffff;
            border-radius: 50%;
            pointer-events: none;
            z-index: 10000;
            transition: transform 0.1s ease, opacity 0.3s ease;
            transform: translate(-50%, -50%);
            mix-blend-mode: difference;
        `;
        document.body.appendChild(this.cursor);

        document.body.style.cursor = 'none';
    }

    bindCursorEvents() {
        document.addEventListener('mousemove', (e) => {
            if (this.cursor) {
                this.cursor.style.left = `${e.clientX}px`;
                this.cursor.style.top = `${e.clientY}px`;
            }
        });

        const interactiveElements = document.querySelectorAll(
            'a, button, .skill-card, .project-card, .form-input'
        );

        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                if (this.cursor) {
                    this.cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
                    this.cursor.style.background = '#00ffff';
                    this.cursor.style.borderColor = '#00ffff';
                }
            });

            element.addEventListener('mouseleave', () => {
                if (this.cursor) {
                    this.cursor.style.transform = 'translate(-50%, -50%) scale(1)';
                    this.cursor.style.background = 'transparent';
                    this.cursor.style.borderColor = '#00ffff';
                }
            });
        });

        document.addEventListener('mouseleave', () => {
            if (this.cursor) {
                this.cursor.style.opacity = '0';
            }
        });

        document.addEventListener('mouseenter', () => {
            if (this.cursor) {
                this.cursor.style.opacity = '1';
            }
        });
    }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    const scrollAnimator = new ScrollAnimator();
    const microInteractions = new MicroInteractions();
    const pageTransitions = new PageTransitions();
    const cursorEffects = new CursorEffects();

    const style = document.createElement('style');
    style.textContent = `
        .loading {
            opacity: 0;
            transition: opacity 0.5s ease;
        }
        
        .page-loaded {
            opacity: 1;
        }
        
        .custom-cursor {
            pointer-events: none;
        }
        
        @media (max-width: 768px) {
            .custom-cursor {
                display: none;
            }
            
            body {
                cursor: auto !important;
            }
        }
    `;
    document.head.appendChild(style);

    console.log('%c🚀 Portfolio Website Loaded Successfully!', 'color: #00ffff; font-size: 16px; font-weight: bold;');
    console.log('%c✨ Animations & Interactions Ready', 'color: #9d4edd; font-size: 14px;');
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ScrollAnimator,
        MicroInteractions,
        PageTransitions,
        CursorEffects
    };
}