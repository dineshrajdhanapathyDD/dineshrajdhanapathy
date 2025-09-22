/**
 * Main JavaScript file for portfolio website
 * Handles navigation, mobile menu, and common functionality
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initLastUpdated();
    initAccessibility();
    initFocusManagement();
    initKeyboardNavigation();
    initScrollAnimations();
    initEnhancedFooter();
    initFeaturedProjects();
    initFeaturedProjectsAnalytics();
    
    // Initialize error handling for images and links
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', function() {
            handleImageError(this);
        });
    });
    
    const links = document.querySelectorAll('a[href]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.href.includes('undefined') || this.href.includes('null')) {
                e.preventDefault();
                console.log('Prevented navigation to invalid URL:', this.href);
            }
        });
    });
});

/**
 * Navigation functionality
 * Handles mobile menu toggle and active states
 */
function initNavigation() {
    const navToggle = document.querySelector('.nav__toggle');
    const navMenu = document.querySelector('.nav__menu');
    const navLinks = document.querySelectorAll('.nav__link');
    
    if (!navToggle || !navMenu) return;
    
    // Mobile menu toggle
    navToggle.addEventListener('click', function() {
        const isOpen = navMenu.classList.contains('nav__menu--open');
        
        if (isOpen) {
            closeNavMenu();
        } else {
            openNavMenu();
        }
    });
    
    // Close menu when clicking nav links (mobile)
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                closeNavMenu();
            }
        });
    });
    
    // Close menu when clicking outside (mobile)
    document.addEventListener('click', function(event) {
        const isClickInsideNav = navToggle.contains(event.target) || navMenu.contains(event.target);
        
        if (!isClickInsideNav && navMenu.classList.contains('nav__menu--open')) {
            closeNavMenu();
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            closeNavMenu();
        }
    });
    
    // Keyboard navigation for mobile menu
    navToggle.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            navToggle.click();
        }
    });
    
    // Set active navigation state based on current page
    setActiveNavigation();
}

/**
 * Open mobile navigation menu
 */
function openNavMenu() {
    const navToggle = document.querySelector('.nav__toggle');
    const navMenu = document.querySelector('.nav__menu');
    const hamburger = document.querySelector('.nav__hamburger');
    
    navMenu.classList.add('nav__menu--open');
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.setAttribute('aria-label', 'Close navigation menu');
    
    // Animate hamburger to X
    if (hamburger) {
        hamburger.style.transform = 'rotate(45deg)';
        hamburger.style.backgroundColor = 'transparent';
    }
    
    // Focus first menu item for accessibility
    const firstLink = navMenu.querySelector('.nav__link');
    if (firstLink) {
        setTimeout(() => firstLink.focus(), 100);
    }
}

/**
 * Close mobile navigation menu
 */
function closeNavMenu() {
    const navToggle = document.querySelector('.nav__toggle');
    const navMenu = document.querySelector('.nav__menu');
    const hamburger = document.querySelector('.nav__hamburger');
    
    navMenu.classList.remove('nav__menu--open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Toggle navigation menu');
    
    // Reset hamburger animation
    if (hamburger) {
        hamburger.style.transform = 'rotate(0deg)';
        hamburger.style.backgroundColor = 'var(--color-gray-700)';
    }
}

/**
 * Set active navigation state based on current page
 */
function setActiveNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav__link');
    
    navLinks.forEach(link => {
        link.classList.remove('nav__link--active');
        
        const linkHref = link.getAttribute('href');
        
        // Handle different cases for active state
        if (
            (currentPage === 'index.html' && linkHref === 'index.html') ||
            (currentPage === '' && linkHref === 'index.html') ||
            (currentPage === '/' && linkHref === 'index.html') ||
            linkHref === currentPage
        ) {
            link.classList.add('nav__link--active');
            link.setAttribute('aria-current', 'page');
        } else {
            link.removeAttribute('aria-current');
        }
    });
}

/**
 * Update last updated date in footer
 */
function initLastUpdated() {
    const lastUpdatedElement = document.getElementById('last-updated');
    if (lastUpdatedElement) {
        const currentDate = new Date();
        const options = { 
            year: 'numeric', 
            month: 'long'
        };
        lastUpdatedElement.textContent = currentDate.toLocaleDateString('en-US', options);
    }
}

/**
 * Initialize accessibility features
 */
function initAccessibility() {
    // Add skip link functionality
    addSkipLink();
    
    // Handle focus management
    initFocusManagement();
    
    // Add keyboard navigation helpers
    initKeyboardNavigation();
}

/**
 * Add skip link for keyboard users
 */
function addSkipLink() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--color-primary);
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 1000;
        transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', function() {
        this.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add id to main content if it doesn't exist
    const main = document.querySelector('main');
    if (main && !main.id) {
        main.id = 'main-content';
    }
}

/**
 * Initialize focus management
 */
function initFocusManagement() {
    // Ensure focus is visible for keyboard users
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });
}

/**
 * Initialize keyboard navigation helpers
 */
function initKeyboardNavigation() {
    // Handle escape key to close mobile menu
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            const navMenu = document.querySelector('.nav__menu');
            if (navMenu && navMenu.classList.contains('nav__menu--open')) {
                closeNavMenu();
                document.querySelector('.nav__toggle').focus();
            }
        }
    });
}

/**
 * Utility function to debounce function calls
 * Useful for resize and scroll events
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Utility function for smooth scrolling to elements
 */
function smoothScrollTo(targetId) {
    const target = document.getElementById(targetId);
    if (target) {
        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

/**
 * Initialize intersection observer for animations
 * Can be used for fade-in effects on scroll
 */
function initScrollAnimations() {
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);
        
        // Observe elements with animation class
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            observer.observe(el);
        });
    }
}

// Export functions for use in other modules
window.PortfolioApp = {
    openNavMenu,
    closeNavMenu,
    setActiveNavigation,
    smoothScrollTo,
    debounce
};

/**
 * Footer component functionality
 */

/**
 * Initialize footer functionality
 */
function initFooter() {
    initBackToTopButton();
    initNewsletterForm();
    initFooterAnimations();
    initFooterAnalytics();
}

/**
 * Initialize back to top button
 */
function initBackToTopButton() {
    const backToTopButton = document.getElementById('back-to-top');
    if (!backToTopButton) return;
    
    // Show/hide button based on scroll position
    function toggleBackToTopButton() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const showThreshold = 300; // Show after scrolling 300px
        
        if (scrollTop > showThreshold) {
            backToTopButton.classList.add('footer__back-to-top--visible');
        } else {
            backToTopButton.classList.remove('footer__back-to-top--visible');
        }
    }
    
    // Throttled scroll event listener
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(toggleBackToTopButton, 10);
    });
    
    // Click handler for smooth scroll to top
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        // Track usage
        trackFooterEvent('back_to_top_clicked');
        
        // Focus management for accessibility
        setTimeout(() => {
            const skipLink = document.querySelector('.skip-link');
            if (skipLink) {
                skipLink.focus();
            } else {
                document.body.focus();
            }
        }, 500);
    });
    
    // Keyboard support
    backToTopButton.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            backToTopButton.click();
        }
    });
    
    // Initial check
    toggleBackToTopButton();
}

/**
 * Initialize newsletter form
 */
function initNewsletterForm() {
    const newsletterForm = document.getElementById('newsletter-form');
    if (!newsletterForm) return;
    
    const emailInput = newsletterForm.querySelector('.footer__newsletter-input');
    const submitButton = newsletterForm.querySelector('.footer__newsletter-btn');
    
    // Form submission handler
    newsletterForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        const email = emailInput.value.trim();
        
        // Basic email validation
        if (!isValidEmail(email)) {
            showNewsletterMessage('Please enter a valid email address.', 'error');
            return;
        }
        
        // Set loading state
        setNewsletterLoading(true);
        
        try {
            // Simulate newsletter subscription (replace with actual service)
            await simulateNewsletterSubscription(email);
            
            showNewsletterMessage('Thank you for subscribing!', 'success');
            emailInput.value = '';
            trackFooterEvent('newsletter_subscribed', { email: email });
            
        } catch (error) {
            showNewsletterMessage('Something went wrong. Please try again.', 'error');
            trackFooterEvent('newsletter_error', { error: error.message });
        } finally {
            setNewsletterLoading(false);
        }
    });
    
    // Real-time email validation
    emailInput.addEventListener('input', function() {
        const email = emailInput.value.trim();
        if (email && !isValidEmail(email)) {
            emailInput.classList.add('footer__newsletter-input--error');
        } else {
            emailInput.classList.remove('footer__newsletter-input--error');
        }
    });
}

/**
 * Validate email address
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Simulate newsletter subscription
 */
function simulateNewsletterSubscription(email) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate 95% success rate
            if (Math.random() > 0.05) {
                resolve({ success: true });
            } else {
                reject(new Error('Network error'));
            }
        }, 1500);
    });
}

/**
 * Set newsletter loading state
 */
function setNewsletterLoading(isLoading) {
    const submitButton = document.querySelector('.footer__newsletter-btn');
    const emailInput = document.querySelector('.footer__newsletter-input');
    
    if (isLoading) {
        submitButton.textContent = 'Subscribing...';
        submitButton.disabled = true;
        emailInput.disabled = true;
    } else {
        submitButton.textContent = 'Subscribe';
        submitButton.disabled = false;
        emailInput.disabled = false;
    }
}

/**
 * Show newsletter message
 */
function showNewsletterMessage(message, type) {
    // Remove existing message
    const existingMessage = document.querySelector('.footer__newsletter-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new message
    const messageElement = document.createElement('div');
    messageElement.className = `footer__newsletter-message footer__newsletter-message--${type}`;
    messageElement.textContent = message;
    
    const newsletterForm = document.getElementById('newsletter-form');
    newsletterForm.appendChild(messageElement);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (messageElement.parentNode) {
            messageElement.remove();
        }
    }, 5000);
}

/**
 * Initialize footer animations
 */
function initFooterAnimations() {
    // Intersection observer for footer sections
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('footer__section--visible');
                }
            });
        }, observerOptions);
        
        // Observe footer sections
        document.querySelectorAll('.footer__section').forEach(section => {
            observer.observe(section);
        });
    }
}

/**
 * Initialize footer analytics
 */
function initFooterAnalytics() {
    // Track footer link clicks
    const footerLinks = document.querySelectorAll('.footer__nav-link, .footer__link, .footer__social-link');
    
    footerLinks.forEach(link => {
        link.addEventListener('click', function() {
            const linkText = link.textContent.trim();
            const linkType = link.classList.contains('footer__social-link') ? 'social' : 'navigation';
            
            trackFooterEvent('footer_link_clicked', {
                link_text: linkText,
                link_type: linkType,
                link_url: link.href
            });
        });
    });
    
    // Track footer visibility
    if ('IntersectionObserver' in window) {
        const footerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    trackFooterEvent('footer_viewed');
                    footerObserver.unobserve(entry.target); // Only track once
                }
            });
        }, { threshold: 0.5 });
        
        const footer = document.querySelector('.footer');
        if (footer) {
            footerObserver.observe(footer);
        }
    }
}

/**
 * Track footer events
 */
function trackFooterEvent(eventName, data = {}) {
    // Integration with analytics services
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, {
            'footer_interaction': true,
            ...data
        });
    }
    
    console.log(`Footer event: ${eventName}`, data);
}

/**
 * Initialize enhanced footer functionality
 */
function initEnhancedFooter() {
    initFooter();
    
    // Add footer keyboard shortcuts
    addFooterKeyboardShortcuts();
    
    // Initialize footer health check
    initFooterHealthCheck();
    
    // Add footer accessibility enhancements
    enhanceFooterAccessibility();
}

/**
 * Add footer keyboard shortcuts
 */
function addFooterKeyboardShortcuts() {
    document.addEventListener('keydown', function(event) {
        // Only activate when not in form fields
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
            return;
        }
        
        // Ctrl/Cmd + Home to scroll to top
        if ((event.ctrlKey || event.metaKey) && event.key === 'Home') {
            event.preventDefault();
            const backToTopButton = document.getElementById('back-to-top');
            if (backToTopButton) {
                backToTopButton.click();
            }
        }
        
        // Ctrl/Cmd + End to scroll to footer
        if ((event.ctrlKey || event.metaKey) && event.key === 'End') {
            event.preventDefault();
            const footer = document.querySelector('.footer');
            if (footer) {
                footer.scrollIntoView({ behavior: 'smooth' });
                trackFooterEvent('keyboard_scroll_to_footer');
            }
        }
    });
}

/**
 * Initialize footer health check
 */
function initFooterHealthCheck() {
    const socialLinks = document.querySelectorAll('.footer__social-link');
    let placeholderCount = 0;
    
    socialLinks.forEach(link => {
        if (link.href.includes('example.com') || link.href === '#') {
            placeholderCount++;
            link.classList.add('footer__social-link--placeholder');
        }
    });
    
    if (placeholderCount > 0) {
        console.warn(`${placeholderCount} placeholder social links found in footer. Please update with actual URLs.`);
    }
}

/**
 * Enhance footer accessibility
 */
function enhanceFooterAccessibility() {
    // Add landmark role if not present
    const footer = document.querySelector('.footer');
    if (footer && !footer.getAttribute('role')) {
        footer.setAttribute('role', 'contentinfo');
    }
    
    // Enhance newsletter form accessibility
    const newsletterInput = document.querySelector('.footer__newsletter-input');
    if (newsletterInput) {
        newsletterInput.setAttribute('autocomplete', 'email');
        newsletterInput.setAttribute('spellcheck', 'false');
    }
    
    // Add skip link to footer
    addFooterSkipLink();
}

/**
 * Add skip link to footer
 */
function addFooterSkipLink() {
    const footer = document.querySelector('.footer');
    if (!footer) return;
    
    const skipToFooter = document.createElement('a');
    skipToFooter.href = '#footer';
    skipToFooter.textContent = 'Skip to footer';
    skipToFooter.className = 'skip-link skip-link--footer';
    skipToFooter.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--color-primary);
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 1000;
        transition: top 0.3s;
    `;
    
    skipToFooter.addEventListener('focus', function() {
        this.style.top = '6px';
    });
    
    skipToFooter.addEventListener('blur', function() {
        this.style.top = '-40px';
    });
    
    document.body.insertBefore(skipToFooter, footer);
    footer.id = 'footer';
}

// Enhanced footer will be initialized by main DOMContentLoaded listener

// Update exports
window.PortfolioApp = {
    ...window.PortfolioApp,
    initEnhancedFooter,
    trackFooterEvent
};
/**

 * Error handling functions to prevent resource not found popups
 */

// Handle download errors gracefully
function handleDownload(element) {
    const url = element.href;
    
    // Check if resource exists before attempting download
    fetch(url, { method: 'HEAD' })
        .then(response => {
            if (!response.ok) {
                console.warn('Resource not found:', url);
                showNotification('Sorry, the requested file is currently unavailable. Please try again later.', 'warning');
                return false;
            }
            // If resource exists, proceed with download
            return true;
        })
        .catch(error => {
            console.error('Download error:', error);
            showNotification('Download failed. Please check your connection and try again.', 'error');
            return false;
        });
    
    return true; // Allow default behavior initially
}

// Handle image loading errors
function handleImageError(img) {
    console.warn('Image failed to load:', img.src);
    
    // Hide the image and show fallback
    img.style.display = 'none';
    
    // Show fallback element if it exists
    const fallback = img.nextElementSibling;
    if (fallback && fallback.classList.contains('fallback')) {
        fallback.style.display = 'flex';
    }
}

// Show user-friendly notifications instead of browser popups
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
        <div class="notification__content">
            <span class="notification__message">${message}</span>
            <button class="notification__close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Suppress browser error popups and handle them gracefully
window.addEventListener('error', function(event) {
    // Prevent the default browser error popup
    event.preventDefault();
    
    // Log error for debugging
    console.error('Resource error:', event.filename, event.message);
    
    // Don't show notification for every error, just log it
    return true;
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled promise rejection:', event.reason);
    event.preventDefault();
});

// Add global error handling for fetch requests
const originalFetch = window.fetch;
window.fetch = function(...args) {
    return originalFetch.apply(this, args)
        .catch(error => {
            console.error('Fetch error:', error);
            // Don't show notification for every fetch error
            throw error;
        });
};

// Initialize error handling when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add error handling to all images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', function() {
            handleImageError(this);
        });
    });
    
    // Add error handling to all download links
    const downloadLinks = document.querySelectorAll('a[download]');
    downloadLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            const result = handleDownload(this);
            if (!result) {
                event.preventDefault();
            }
        });
    });
});
/**

 * Featured Projects functionality
 */
function initFeaturedProjects() {
    const container = document.getElementById('featured-projects-container');
    if (!container) return;

    // Show loading state
    container.innerHTML = '<div class="featured-projects__loading">Loading projects...</div>';

    // Featured projects data (subset of projects.js data)
    const featuredProjectsData = [
        {
            id: "aws-project-portfolio",
            title: "AWS Project Portfolio",
            description: "Comprehensive collection of AWS projects showcasing cloud architecture, serverless applications, and infrastructure automation.",
            technologies: ["AWS", "CloudFormation", "Lambda", "S3", "EC2", "RDS"],
            githubUrl: "https://learn.nextwork.org/positive_purple_innocent_lemon/portfolio",
            imageUrl: "assets/images/projects/aws-icon.svg",
            featured: true,
            dateCreated: "2024-12-01",
            status: "completed",
            category: "cloud"
        },
        {
            id: "kodekloud-devops-projects",
            title: "KodeKloud DevOps Projects",
            description: "Collection of hands-on DevOps projects covering CI/CD pipelines, container orchestration, infrastructure as code, and automation.",
            technologies: ["Jenkins", "Kubernetes", "Docker", "Ansible", "Terraform"],
            githubUrl: "https://github.com/dineshrajdhanapathyDD/kodekloud_DevOps_project",
            imageUrl: "assets/images/projects/devops-tools-icon.svg",
            featured: true,
            dateCreated: "2024-11-20",
            status: "completed",
            category: "devops"
        },
        {
            id: "aws-serverless-api",
            title: "Three-Tier Architecture Website with CloudFront",
            description: "Scalable serverless website architecture built with AWS CloudFront, S3, and API Gateway for high-performance, cost-effective content delivery.",
            technologies: ["AWS CloudFront", "S3", "API Gateway", "Lambda", "Route53"],
            githubUrl: "https://github.com/dineshrajdhanapathyDD/Cloud/tree/main/AWS/NextWork%20AWS%20Documentation/1%20NETWORKING%20AWS%20CONCEPT/4-Three-Tier%20Architecture%20Website%20Delivery%20with%20CloudFront",
            imageUrl: "assets/images/projects/lambda-icon.svg",
            featured: true,
            dateCreated: "2024-11-15",
            status: "completed",
            category: "backend"
        },
        {
            id: "cloud-certification-roadmap",
            title: "Cloud Certification Roadmap",
            description: "Interactive tool for planning cloud certification paths based on skills assessment and career goals.",
            technologies: ["JavaScript", "HTML5", "CSS3", "D3.js", "Accessibility"],
            githubUrl: "https://github.com/dineshrajdhanapathyDD/portfolio/tree/main/certification-roadmap",
            liveUrl: "certification-roadmap.html",
            imageUrl: "assets/images/projects/cloud-certification-icon.svg",
            featured: true,
            dateCreated: "2024-07-20",
            status: "completed",
            category: "tools"
        }
    ];

    // Simulate loading delay for better UX (remove in production)
    setTimeout(() => {
        renderFeaturedProjects(featuredProjectsData);
        
        // Add loaded class for animations
        const grid = document.querySelector('.featured-projects__grid');
        if (grid) {
            grid.classList.add('loaded');
        }
    }, 300);
}

function renderFeaturedProjects(projects) {
    const container = document.getElementById('featured-projects-container');
    if (!container) return;

    container.innerHTML = projects.map(project => createFeaturedProjectCard(project)).join('');
}

function createFeaturedProjectCard(project) {
    const statusBadge = project.status === 'in-progress'
        ? '<span class="featured-project__badge featured-project__badge--progress">In Progress</span>'
        : '';

    const featuredBadge = project.featured
        ? '<span class="featured-project__badge featured-project__badge--featured">Featured</span>'
        : '';

    // Determine which link buttons to show
    let projectLinks = '';

    // For AWS Project Portfolio and KodeKloud projects, show Portfolio button
    if (project.id === "aws-project-portfolio" || project.id === "kodekloud-devops-projects") {
        projectLinks = `
            <a href="${project.githubUrl}" class="featured-project__link featured-project__link--portfolio" target="_blank" rel="noopener noreferrer" aria-label="View ${project.title} portfolio">
                <span class="featured-project__link-text">Portfolio</span>
                <span class="featured-project__link-icon" aria-hidden="true">↗</span>
            </a>
        `;
    } else {
        // For other projects, show GitHub button and Live button if available
        const liveLink = project.liveUrl
            ? `<a href="${project.liveUrl}" class="featured-project__link featured-project__link--live" target="_blank" rel="noopener noreferrer" aria-label="View ${project.title} live demo">
                 <span class="featured-project__link-text">Live Demo</span>
                 <span class="featured-project__link-icon" aria-hidden="true">↗</span>
               </a>`
            : '';

        projectLinks = `
            <a href="${project.githubUrl}" class="featured-project__link featured-project__link--github" target="_blank" rel="noopener noreferrer" aria-label="View ${project.title} source code on GitHub">
                <span class="featured-project__link-text">GitHub</span>
                <span class="featured-project__link-icon" aria-hidden="true">↗</span>
            </a>
            ${liveLink}
        `;
    }

    return `
        <article class="featured-project-card" data-project-id="${project.id}" data-category="${project.category}">
            <div class="featured-project__image-container">
                <img 
                    src="${project.imageUrl}" 
                    alt="${project.title} icon" 
                    class="featured-project__image"
                    loading="lazy"
                    onerror="this.style.display='none'"
                >
                <div class="featured-project__badges">
                    ${featuredBadge}
                    ${statusBadge}
                </div>
            </div>
            
            <div class="featured-project__content">
                <header class="featured-project__header">
                    <h3 class="featured-project__title">${project.title}</h3>
                    <time class="featured-project__date" datetime="${project.dateCreated}">
                        ${formatProjectDate(project.dateCreated)}
                    </time>
                </header>
                
                <p class="featured-project__description">${project.description}</p>
                
                <div class="featured-project__technologies">
                    ${project.technologies.slice(0, 4).map(tech =>
                        `<span class="featured-project__tech-tag">${tech}</span>`
                    ).join('')}
                    ${project.technologies.length > 4 ? `<span class="featured-project__tech-tag">+${project.technologies.length - 4} more</span>` : ''}
                </div>
                
                <footer class="featured-project__footer">
                    ${projectLinks}
                </footer>
            </div>
        </article>
    `;
}

function formatProjectDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short'
    });
}

// Featured projects will be initialized by main DOMContentLoaded listener/
**
 * Analytics tracking for featured projects
 */
function trackFeaturedProjectInteraction(projectId, action, linkType = null) {
    // Track project interactions for analytics
    const eventData = {
        event: 'featured_project_interaction',
        project_id: projectId,
        action: action,
        link_type: linkType,
        timestamp: new Date().toISOString(),
        section: 'featured_projects'
    };
    
    // Log for debugging (replace with actual analytics in production)
    console.log('Featured Project Analytics:', eventData);
    
    // Example: Google Analytics 4 event tracking
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            'custom_parameter_1': projectId,
            'custom_parameter_2': linkType
        });
    }
    
    // Example: Custom analytics endpoint
    if (window.analytics && typeof window.analytics.track === 'function') {
        window.analytics.track('Featured Project Interaction', eventData);
    }
}

/**
 * Initialize featured projects analytics
 */
function initFeaturedProjectsAnalytics() {
    // Track when featured projects section comes into view
    const featuredSection = document.querySelector('.featured-projects');
    if (!featuredSection) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                trackFeaturedProjectInteraction('section', 'view');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    observer.observe(featuredSection);
    
    // Track project card clicks
    document.addEventListener('click', function(event) {
        const projectCard = event.target.closest('.featured-project-card');
        if (!projectCard) return;
        
        const projectId = projectCard.dataset.projectId;
        const link = event.target.closest('.featured-project__link');
        
        if (link) {
            const linkType = link.classList.contains('featured-project__link--github') ? 'github' :
                           link.classList.contains('featured-project__link--portfolio') ? 'portfolio' :
                           link.classList.contains('featured-project__link--live') ? 'live' : 'unknown';
            
            trackFeaturedProjectInteraction(projectId, 'click', linkType);
        }
        
        // Track technology tag clicks
        const techTag = event.target.closest('.featured-project__tech-tag');
        if (techTag) {
            trackFeaturedProjectInteraction(projectId, 'tech_tag_click', techTag.textContent);
        }
    });
    
    // Track hover interactions (for engagement metrics)
    document.addEventListener('mouseenter', function(event) {
        const projectCard = event.target.closest('.featured-project-card');
        if (projectCard) {
            const projectId = projectCard.dataset.projectId;
            trackFeaturedProjectInteraction(projectId, 'hover');
        }
    }, true);
}
/*
*
 * Handle download links with error checking
 * @param {HTMLElement} element - The download link element
 * @returns {boolean} - Whether to proceed with download
 */
function handleDownload(element) {
    try {
        const href = element.getAttribute('href');
        const filename = element.getAttribute('download');
        
        if (!href || href === '#' || href === '') {
            console.log('Invalid download link:', href);
            showNotification('Download link is not available', 'error');
            return false;
        }
        
        // Check if file exists using a HEAD request
        fetch(href, { method: 'HEAD' })
            .then(response => {
                if (!response.ok) {
                    showNotification('The requested file is currently unavailable. Please try again later.', 'warning');
                }
            })
            .catch(() => {
                showNotification('Download failed. Please check your connection and try again.', 'error');
            });
        
        // Allow the download to proceed
        return true;
    } catch (error) {
        console.log('Download error:', error);
        showNotification('Download failed. Please try again.', 'error');
        return false;
    }
}

/**
 * Show notification to user
 * @param {string} message - The message to show
 * @param {string} type - The type of notification (info, warning, error, success)
 */
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
        <div class="notification__content">
            <span class="notification__message">${message}</span>
            <button class="notification__close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // Add styles if not already present
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                max-width: 400px;
                padding: 16px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                z-index: 1000;
                animation: slideIn 0.3s ease-out;
            }
            .notification--info { background: #e3f2fd; color: #1565c0; border-left: 4px solid #2196f3; }
            .notification--success { background: #e8f5e8; color: #2e7d32; border-left: 4px solid #4caf50; }
            .notification--warning { background: #fff3e0; color: #ef6c00; border-left: 4px solid #ff9800; }
            .notification--error { background: #ffebee; color: #c62828; border-left: 4px solid #f44336; }
            .notification__content { display: flex; justify-content: space-between; align-items: center; }
            .notification__message { flex: 1; margin-right: 12px; }
            .notification__close { background: none; border: none; font-size: 18px; cursor: pointer; opacity: 0.7; }
            .notification__close:hover { opacity: 1; }
            @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
            @keyframes slideOut { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }
        `;
        document.head.appendChild(styles);
    }
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOut 0.3s ease-in forwards';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Make functions globally available
window.handleDownload = handleDownload;
window.showNotification = showNotification;