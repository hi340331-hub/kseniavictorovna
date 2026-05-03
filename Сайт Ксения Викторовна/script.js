// ===== PAGE SWITCHING FUNCTIONALITY =====
document.addEventListener('DOMContentLoaded', () => {
    const navButtons = document.querySelectorAll('.nav-btn');
    const pages = document.querySelectorAll('.page');
    
    // Page switching function with optimized performance
    const switchPage = (targetPageId) => {
        // Remove active class from all pages and buttons
        pages.forEach(page => {
            page.classList.remove('active');
        });
        
        navButtons.forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Add active class to target page and corresponding button
        const targetPage = document.getElementById(targetPageId);
        const targetButton = document.querySelector(`[data-page="${targetPageId}"]`);
        
        if (targetPage && targetButton) {
            // Use requestAnimationFrame for smooth 60fps transitions
            requestAnimationFrame(() => {
                targetPage.classList.add('active');
                targetButton.classList.add('active');
                
                // Reset scroll position instantly
                window.scrollTo({ top: 0, behavior: 'instant' });
                
                // Re-trigger animations for content blocks
                const blocks = targetPage.querySelectorAll('.content-block');
                blocks.forEach((block, index) => {
                    block.style.animation = 'none';
                    block.offsetHeight; // Force reflow
                    block.style.animation = '';
                });
            });
        }
    };
    
    // Add click event listeners to navigation buttons
    navButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const targetPage = button.getAttribute('data-page');
            switchPage(targetPage);
            
            // Add ripple effect
            createRipple(e, button);
        });
    });
    
    // Ripple effect for buttons
    const createRipple = (event, element) => {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    };
    
    // Add ripple styles dynamically
    const style = document.createElement('style');
    style.textContent = `
        .nav-btn {
            position: relative;
            overflow: hidden;
        }
        
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(212, 175, 55, 0.4);
            transform: scale(0);
            animation: ripple-animation 0.6s ease-out;
            pointer-events: none;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // ===== OPTIMIZED SCROLL FOR TEXT CONTENT =====
    const textContents = document.querySelectorAll('.text-content');
    
    textContents.forEach(content => {
        // Check if content is scrollable
        const checkScrollable = () => {
            return content.scrollHeight > content.clientHeight;
        };
        
        if (checkScrollable()) {
            content.style.cursor = 'default';
            
            // Optimized scrolling with passive listener
            content.addEventListener('wheel', (e) => {
                if (checkScrollable()) {
                    e.stopPropagation();
                    // Let browser handle smooth scrolling natively
                }
            }, { passive: true });
        }
    });
    
    // ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all content blocks
    document.querySelectorAll('.content-block').forEach(block => {
        observer.observe(block);
    });
    
    // ===== KEYBOARD NAVIGATION =====
    document.addEventListener('keydown', (e) => {
        // Alt + 1 for Biography page
        if (e.altKey && e.key === '1') {
            e.preventDefault();
            switchPage('biography');
        }
        
        // Alt + 2 for Achievements page
        if (e.altKey && e.key === '2') {
            e.preventDefault();
            switchPage('achievements');
        }
    });
    
    // ===== OPTIMIZED PARALLAX EFFECT =====
    let ticking = false;
    let lastScrollY = 0;
    
    const updateParallax = () => {
        const scrolled = window.pageYOffset;
        
        // Only update if scroll changed significantly (optimization)
        if (Math.abs(scrolled - lastScrollY) > 2) {
            const parallaxElements = document.querySelectorAll('.minor-part img');
            
            parallaxElements.forEach((element) => {
                const speed = 0.03;
                const yPos = -(scrolled * speed);
                element.style.transform = `translate3d(0, ${yPos}px, 0) scale(1)`;
            });
            
            lastScrollY = scrolled;
        }
        
        ticking = false;
    };
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }, { passive: true });
    
    // ===== OPTIMIZED HOVER EFFECTS =====
    const contentBlocks = document.querySelectorAll('.content-block');
    
    contentBlocks.forEach(block => {
        const blockInner = block.querySelector('.block-inner');
        let rafId = null;
        
        // Optimized mouse move with throttling
        block.addEventListener('mousemove', (e) => {
            if (rafId) return;
            
            rafId = requestAnimationFrame(() => {
                const rect = blockInner.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const deltaX = (x - centerX) / centerX;
                const deltaY = (y - centerY) / centerY;
                
                // Subtle tilt effect with 3D transform
                const tiltX = deltaY * 1.5;
                const tiltY = -deltaX * 1.5;
                
                blockInner.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
                
                rafId = null;
            });
        });
        
        block.addEventListener('mouseleave', () => {
            if (rafId) {
                cancelAnimationFrame(rafId);
                rafId = null;
            }
            blockInner.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    });
    
    // ===== OPTIMIZED LAZY LOADING FOR IMAGES =====
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                
                // Use requestAnimationFrame for smooth fade-in
                requestAnimationFrame(() => {
                    img.style.opacity = '0';
                    img.style.transition = 'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                    
                    requestAnimationFrame(() => {
                        img.style.opacity = '1';
                    });
                });
                
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px',
        threshold: 0.1
    });
    
    document.querySelectorAll('.minor-part img').forEach(img => {
        imageObserver.observe(img);
    });
    
    // ===== OPTIMIZED RESIZE HANDLER =====
    let resizeTimer;
    
    const handleResize = () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            requestAnimationFrame(() => {
                // Recalculate scrollable areas
                textContents.forEach(content => {
                    const isScrollable = content.scrollHeight > content.clientHeight;
                    content.style.cursor = 'default';
                });
            });
        }, 150);
    };
    
    window.addEventListener('resize', handleResize, { passive: true });
    
    // ===== INITIAL SETUP =====
    // Ensure the first page is active on load
    const firstPage = document.getElementById('biography');
    const firstButton = document.querySelector('[data-page="biography"]');
    
    if (firstPage && firstButton) {
        requestAnimationFrame(() => {
            firstPage.classList.add('active');
            firstButton.classList.add('active');
        });
    }
    
    // Optimized loading animation
    requestAnimationFrame(() => {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        
        requestAnimationFrame(() => {
            document.body.style.opacity = '1';
        });
    });
    
    // Console message
    console.log('%c🏛️ Александр II — Царь-Освободитель', 'color: #d4af37; font-size: 20px; font-weight: bold;');
    console.log('%cСайт создан с использованием Liquid Glass дизайна', 'color: #888; font-size: 12px;');
    console.log('%cГорячие клавиши: Alt+1 (Биография), Alt+2 (Деяния для России)', 'color: #666; font-size: 11px;');
});

// ===== PREVENT CONTEXT MENU ON IMAGES (OPTIONAL) =====
document.addEventListener('contextmenu', (e) => {
    if (e.target.tagName === 'IMG') {
        e.preventDefault();
    }
}, { passive: false });

// ===== PERFORMANCE MONITORING (DEV ONLY) =====
if (window.performance && window.performance.mark) {
    window.addEventListener('load', () => {
        performance.mark('page-loaded');
        console.log('%c⚡ Страница загружена и оптимизирована для 60-120 FPS', 'color: #d4af37; font-weight: bold;');
    });
}
