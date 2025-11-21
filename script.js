// ===== SCRIPT.JS =====
// Main JavaScript functionality for portfolio website

class PortfolioApp {
    constructor() {
        this.init();
    }

    init() {
        this.initializeMobileMenu();
        this.initializeSmoothScrolling();
        this.initializeFormHandler();
        this.initializeScrollEffects();
        this.initializeThemeManager();
        this.initializeLoadingState();
        this.initializeInteractiveElements();
    }

    // ===== MOBILE MENU =====
    initializeMobileMenu() {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');

        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                navToggle.classList.toggle('active');
                document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
            });

            // Close menu when clicking on links
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                    document.body.style.overflow = '';
                });
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        }
    }

    // ===== SMOOTH SCROLLING =====
    initializeSmoothScrolling() {
        const navLinks = document.querySelectorAll('a[href^="#"]');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetId = link.getAttribute('href');
                
                // FIXED: Prevent crash if href is just "#" or empty
                if (!targetId || targetId === '#') return;

                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const headerHeight = document.querySelector('.navbar').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // ===== FORM HANDLING =====
    initializeFormHandler() {
        const contactForm = document.querySelector('.contact-form form');
        
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmission(contactForm);
            });

            // Add real-time validation
            const inputs = contactForm.querySelectorAll('.form-input');
            inputs.forEach(input => {
                // FIXED: Use arrow functions to preserve 'this' context
                input.addEventListener('blur', (e) => this.validateField(e));
                
                // FIXED: Pass the element target, not the event object
                input.addEventListener('input', (e) => this.clearFieldError(e.target));
            });
        }
    }

    validateField(e) {
        const field = e.target;
        const value = field.value.trim();
        
        field.classList.remove('error', 'success');
        
        if (field.type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                field.classList.add('error');
                this.showFieldError(field, 'Please enter a valid email address');
                return false;
            }
        }
        
        if (field.required && !value) {
            field.classList.add('error');
            this.showFieldError(field, 'This field is required');
            return false;
        }
        
        field.classList.add('success');
        this.clearFieldError(field);
        return true;
    }

    showFieldError(field, message) {
        this.clearFieldError(field);
        
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        errorElement.style.cssText = `
            color: #ff6b6b;
            font-size: 0.8rem;
            margin-top: 0.5rem;
        `;
        
        if (field.parentNode) {
            field.parentNode.appendChild(errorElement);
        }
    }

    clearFieldError(field) {
        // FIXED: Added safety check to prevent crash if field is undefined
        if (!field || !field.parentNode) return;

        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }

    async handleFormSubmission(form) {
        const formData = new FormData(form);
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        // Validate all fields
        const inputs = form.querySelectorAll('.form-input');
        let isValid = true;
        
        inputs.forEach(input => {
            // Trigger validation manually
            const event = { target: input };
            if (!this.validateField(event)) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            this.showNotification('Please fix the errors in the form', 'error');
            return;
        }
        
        // Simulate form submission
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            this.showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
            form.reset();
            
            // Clear success states
            inputs.forEach(input => input.classList.remove('success'));
            
        } catch (error) {
            this.showNotification('Failed to send message. Please try again.', 'error');
        } finally {
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#00ff88' : type === 'error' ? '#ff6b6b' : '#00ffff'};
            color: #0d0d0d;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            z-index: 10000;
            font-weight: 600;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            transform: translateX(400px);
            transition: transform 0.3s ease;
            max-width: 300px;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 5000);
    }

    // ===== SCROLL EFFECTS =====
    initializeScrollEffects() {
        let lastScrollY = window.scrollY;
        const navbar = document.querySelector('.navbar');
        
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            if (!navbar) return;

            // Navbar hide/show on scroll
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
            
            // Navbar background on scroll
            if (currentScrollY > 50) {
                navbar.style.background = 'rgba(13, 13, 13, 0.95)';
                navbar.style.backdropFilter = 'blur(10px)';
            } else {
                navbar.style.background = 'rgba(13, 13, 13, 0.9)';
                navbar.style.backdropFilter = 'blur(5px)';
            }
            
            lastScrollY = currentScrollY;
            
            // Active section highlighting
            this.updateActiveNavLink();
        });
    }

    updateActiveNavLink() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let currentSection = '';
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    // ===== THEME MANAGEMENT =====
    initializeThemeManager() {
        const savedTheme = localStorage.getItem('portfolio-theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme === 'light' || (!savedTheme && !systemPrefersDark)) {
            this.toggleTheme();
        }
        
        this.createThemeToggle();
    }

    // createThemeToggle() {
    //     const themeToggle = document.createElement('button');
    //     // themeToggle.className = 'theme-toggle';
    //     themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    //     themeToggle.setAttribute('aria-label', 'Toggle theme');
    //     themeToggle.style.cssText = `
    //         background: transparent;
    //         border: 2px solid var(--accent-cyan);
    //         color: var(--text-primary);
    //         width: 40px;
    //         height: 40px;
    //         border-radius: 50%;
    //         display: flex;
    //         align-items: center;
    //         justify-content: center;
    //         cursor: pointer;
    //         transition: var(--transition-fast);
    //         margin-left: 1rem;
    //     `;
        
    //     themeToggle.addEventListener('click', () => {
    //         this.toggleTheme();
    //     });
        
    //     const navContainer = document.querySelector('.nav-container');
    //     if (navContainer) {
    //         navContainer.appendChild(themeToggle);
    //     }
    // }

    // toggleTheme() {
    //     const isDark = document.body.classList.toggle('light-theme');
    //     const themeToggle = document.querySelector('.theme-toggle');
        
    //     if (themeToggle) {
    //         themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    //     }
        
    //     localStorage.setItem('portfolio-theme', isDark ? 'light' : 'dark');
    // }

    // ===== LOADING STATE =====
    initializeLoadingState() {
        window.addEventListener('load', () => {
            document.body.classList.add('loaded');
            setTimeout(() => {
                document.body.classList.remove('loading');
            }, 1000);
        });

        document.addEventListener('DOMContentLoaded', () => {
            document.body.classList.add('loading');
        });
    }

    // ===== INTERACTIVE ELEMENTS =====
    initializeInteractiveElements() {
        this.initializeSkillBars();
        this.initializeProjectModals();
        this.initializeTypewriterEffect();
        this.initializeParticleEffect();
    }

    initializeSkillBars() {
        const skillsSection = document.querySelector('.skills');
        if (skillsSection) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateSkillBars();
                        observer.unobserve(entry.target);
                    }
                });
            });
            observer.observe(skillsSection);
        }
    }

    animateSkillBars() {
        console.log('Animating skill bars...');
    }

    // ===== PROJECT MODALS =====
    initializeProjectModals() {
        const projectLinks = document.querySelectorAll('.project-link');
        
        projectLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                // Prevent opening modal if href is empty or just #
                if(link.getAttribute('href') === '#' || link.getAttribute('href') === '') {
                    const projectCard = link.closest('.project-card');
                    const projectData = this.getProjectData(projectCard);
                    this.showProjectModal(projectData);
                } else {
                    // Allow normal navigation for real links
                    window.open(link.getAttribute('href'), '_blank');
                }
            });
        });
    }

    getProjectData(projectCard) {
        const title = projectCard.querySelector('.project-title').textContent;
        const description = projectCard.querySelector('.project-description').textContent;
        const techTags = Array.from(projectCard.querySelectorAll('.tech-tag')).map(tag => tag.textContent);
        const image = projectCard.querySelector('img').src;
        
        const projectDetails = {
            "E-Commerce Platform": {
                overview: "Platform e-commerce modern dengan React, Node.js, dan integrasi payment gateway yang lengkap.",
                features: [
                    "User authentication dan authorization",
                    "Shopping cart dan checkout process", 
                    "Payment gateway integration",
                    "Admin dashboard untuk management",
                    "Real-time inventory tracking"
                ],
                challenges: "Mengintegrasikan multiple payment methods dan menjaga keamanan transaksi.",
                demoLink: "#",
                githubLink: "#"
            },
            "Warung Makan Website": {
                overview: "A complete website for a local restaurant featuring menu display, online ordering, and customer management.",
                features: [
                    "Online Menu Display",
                    "Order Management System",
                    "WhatsApp Integration",
                    "Admin Dashboard"
                ],
                challenges: "Creating a responsive design that works well on all mobile devices.",
                demoLink: "#",
                githubLink: "#"
            },
            "Finance Company Logo": {
                overview: "Professional logo design focusing on trust and stability.",
                features: [
                    "Vector Format",
                    "Brand Guidelines",
                    "Multiple Variations",
                    "Social Media Assets"
                ],
                challenges: "Conveying trust and modernism simultaneously.",
                demoLink: "#",
                githubLink: "#"
            }
        };
        
        // Default fallback if project not found in map
        const defaultDetail = {
            overview: description,
            features: ["Features details available upon request"],
            challenges: "Standard development challenges",
            demoLink: "#",
            githubLink: "#"
        };

        return {
            title: title,
            description: description,
            tech: techTags,
            image: image,
            details: projectDetails[title] || defaultDetail
        };
    }

    showProjectModal(projectData) {
        const modal = document.createElement('div');
        modal.className = 'project-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <button class="modal-close">&times;</button>
                <div class="modal-header">
                    <img src="${projectData.image}" alt="${projectData.title}" class="modal-image">
                    <h3>${projectData.title}</h3>
                </div>
                <div class="modal-body">
                    <div class="modal-section">
                        <h4>🚀 Project Overview</h4>
                        <p>${projectData.details.overview}</p>
                    </div>
                    
                    <div class="modal-section">
                        <h4>✨ Features</h4>
                        <ul class="features-list">
                            ${projectData.details.features.map(feature => `<li>${feature}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="modal-section">
                        <h4>🛠️ Technologies Used</h4>
                        <div class="modal-tech">
                            ${projectData.tech.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                        </div>
                    </div>
                    
                    <div class="modal-section">
                        <h4>💡 Challenges & Solutions</h4>
                        <p>${projectData.details.challenges}</p>
                    </div>
                </div>
                <div class="modal-actions">
                    <a href="${projectData.details.demoLink}" class="btn btn-primary" target="_blank">
                        <i class="fas fa-external-link-alt"></i> Live Demo
                    </a>
                    <a href="${projectData.details.githubLink}" class="btn btn-secondary" target="_blank">
                        <i class="fab fa-github"></i> View Code
                    </a>
                </div>
            </div>
        `;
        
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(13, 13, 13, 0.95);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
            padding: 2rem;
        `;
        
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
        
        setTimeout(() => {
            modal.style.opacity = '1';
        }, 100);
        
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => {
            this.closeProjectModal(modal);
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeProjectModal(modal);
            }
        });
        
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                this.closeProjectModal(modal);
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);
    }

    closeProjectModal(modal) {
        modal.style.opacity = '0';
        setTimeout(() => {
            if (modal.parentNode) {
                modal.remove();
            }
            document.body.style.overflow = '';
        }, 300);
    }

    initializeTypewriterEffect() {
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) {
            // Store original html to preserve spans
            // Simple implementation: just fade in for now to preserve complex HTML structure
            heroTitle.style.opacity = 0;
            setTimeout(() => {
                heroTitle.style.transition = 'opacity 1s ease';
                heroTitle.style.opacity = 1;
            }, 500);
        }
    }

    initializeParticleEffect() {
        const hero = document.querySelector('.hero');
        if (hero && window.innerWidth > 768) {
            const particles = document.createElement('div');
            particles.className = 'particles';
            particles.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 1;
            `;
            
            hero.appendChild(particles);
            
            for (let i = 0; i < 20; i++) {
                this.createParticle(particles);
            }
        }
    }

    createParticle(container) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: var(--accent-cyan);
            border-radius: 50%;
            animation: float 6s ease-in-out infinite;
            opacity: ${Math.random() * 0.5 + 0.2};
        `;
        
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 5}s`;
        
        container.appendChild(particle);
    }
}

// ===== ADDITIONAL GLOBAL FUNCTIONS =====

function updateFooterYear() {
    const footer = document.querySelector('.footer p');
    if (footer) {
        const currentYear = new Date().getFullYear();
        footer.textContent = footer.textContent.replace('2024', currentYear);
    }
}

function monitorPerformance() {
    window.addEventListener('load', () => {
        if ('performance' in window) {
            const navTiming = performance.getEntriesByType('navigation')[0];
            if(navTiming) {
                console.log('Page load time:', navTiming.loadEventEnd - navTiming.loadEventStart, 'ms');
            }
        }
    });
}

function initializeErrorHandling() {
    window.addEventListener('error', (e) => {
        console.error('JavaScript Error:', e.error);
    });
    
    window.addEventListener('unhandledrejection', (e) => {
        console.error('Unhandled Promise Rejection:', e.reason);
    });
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    const app = new PortfolioApp();
    
    updateFooterYear();
    monitorPerformance();
    initializeErrorHandling();
    
    const globalStyles = document.createElement('style');
    globalStyles.textContent = `
        .light-theme {
            --bg-primary: #ffffff;
            --bg-secondary: #f8f9fa;
            --bg-card: #ffffff;
            --text-primary: #0d0d0d;
            --text-secondary: #666666;
            --accent-cyan: #008b8b;
            --accent-purple: #7b2cbf;
        }
        
        .loading {
            opacity: 0;
            transition: opacity 0.5s ease;
        }
        
        .loaded {
            opacity: 1;
        }
        
        .nav-link.active {
            color: var(--text-primary);
        }
        
        .nav-link.active::after {
            width: 100%;
        }
        
        .form-input.error {
            border-color: #ff6b6b !important;
            box-shadow: 0 0 10px rgba(255, 107, 107, 0.3) !important;
        }
        
        .form-input.success {
            border-color: #00ff88 !important;
        }
        
        @keyframes float {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @media (max-width: 768px) {
            .theme-toggle {
                display: none;
            }
        }
    `;
    document.head.appendChild(globalStyles);
    
    console.log('%c🚀 Portfolio Website Initialized', 'color: #00ffff; font-size: 16px; font-weight: bold;');
    console.log('%c💼 All systems operational', 'color: #9d4edd; font-size: 14px;');
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = PortfolioApp;
}