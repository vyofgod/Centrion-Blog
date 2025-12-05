// Scroll reveal animation handler with enhanced page transitions
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    // Add scroll-reveal class to post entries
    const postEntries = document.querySelectorAll('.post-entry');
    postEntries.forEach((entry, index) => {
        entry.style.animationDelay = `${index * 0.1}s`;
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements with scroll-reveal class
    const revealElements = document.querySelectorAll('.scroll-reveal');
    revealElements.forEach(el => observer.observe(el));

    // Smooth scroll for in-page anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });

    // Header hide/show on scroll
    let lastScrollTop = 0;
    const header = document.querySelector('.header');
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (header) {
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
            header.style.transition = 'transform 0.3s ease-in-out';
        }
        lastScrollTop = scrollTop;
    }, { passive: true });

    // Ripple effect on buttons
    const buttons = document.querySelectorAll('button, .button, a.button');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Page transition overlay
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const transitionMs = 350; // Updated for smoother exit animation
    const overlay = document.createElement('div');
    overlay.className = 'page-transition active';
    document.body.appendChild(overlay);

    requestAnimationFrame(() => {
        overlay.classList.remove('active');
    });

    // INTERNAL LINK CLICK → EXIT ANIMATION → NAVIGATE
    document.addEventListener('click', (e) => {
        const a = e.target.closest('a');
        if (!a) return;

        const href = a.getAttribute('href') || '';
        if (href.startsWith('#')) return;
        if (a.hasAttribute('download')) return;
        if (a.target && a.target !== '' && a.target !== '_self') return;

        try {
            const url = new URL(a.href, window.location.href);
            if (url.origin !== window.location.origin) return;
        } catch {
            return;
        }

        e.preventDefault();

        if (!reduceMotion) {
            document.body.classList.add('page-exit');
            overlay.classList.add('active');
            setTimeout(() => { window.location.href = a.href; }, transitionMs);
        } else {
            window.location.href = a.href;
        }
    });

    // Handle back/forward navigation
    window.addEventListener('pageshow', (event) => {
        if (event.persisted) {
            document.body.classList.remove('page-exit');
            document.body.classList.add('page-loaded');
        }
        overlay.classList.remove('active');
    });

    // Image loading fade-in
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        if (!img.complete) {
            img.style.opacity = '0';
            img.addEventListener('load', function() {
                this.style.transition = 'opacity 0.5s ease-in';
                this.style.opacity = '1';
            });
        }
    });

    // Stagger menu items
    const menuItems = document.querySelectorAll('#menu li');
    menuItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            item.style.transition = 'all 0.3s ease-out';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, 100 * index);
    });

    // Scroll progress indicator
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, var(--primary), var(--secondary));
        z-index: 9999;
        transition: width 0.1s ease-out;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', function() {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
    }, { passive: true });
});

// Trigger enter animation
document.addEventListener("DOMContentLoaded", () => {
    document.body.classList.add("page-loaded");
});

// Ripple effect styling
const style = document.createElement('style');
style.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
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
    button, .button {
        position: relative;
        overflow: hidden;
    }
`;
document.head.appendChild(style);
