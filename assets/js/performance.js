/**
 * Performance Optimization Module
 * Handles lazy loading, image optimization, and performance monitoring
 */

// Performance state management
const performanceState = {
    lazyLoadObserver: null,
    imageLoadTimes: {},
    performanceMetrics: {},
    isInitialized: false
};

/**
 * Initialize performance optimizations
 */
function initPerformance() {
    if (performanceState.isInitialized) return;
    
    // Core performance features
    initLazyLoading();
    initImageOptimization();
    initPerformanceMonitoring();
    
    // Accessibility-related performance
    initAccessibilityPerformance();
    
    // Resource optimization
    initResourceOptimization();
    
    performanceState.isInitialized = true;
    console.log('Performance optimizations initialized');
}

/**
 * Initialize lazy loading for images
 */
function initLazyLoading() {
    // Check for Intersection Observer support
    if (!('IntersectionObserver' in window)) {
        // Fallback: load all images immediately
        loadAllImages();
        return;
    }
    
    const lazyImages = document.querySelectorAll('img[loading="lazy"], img[data-src]');
    
    if (lazyImages.length === 0) return;
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                loadImage(img);
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px 0px',
        threshold: 0.01
    });
    
    lazyImages.forEach(img => {
        imageObserver.observe(img);
    });
    
    performanceState.lazyLoadObserver = imageObserver;
}

/**
 * Load individual image with performance tracking
 */
function loadImage(img) {
    const startTime = performance.now();
    
    // Handle data-src attribute for lazy loading
    if (img.dataset.src) {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
    }
    
    // Handle srcset for responsive images
    if (img.dataset.srcset) {
        img.srcset = img.dataset.srcset;
        img.removeAttribute('data-srcset');
    }
    
    // Track loading performance
    img.addEventListener('load', function() {
        const loadTime = performance.now() - startTime;
        performanceState.imageLoadTimes[img.src] = loadTime;
        
        // Remove loading placeholder
        img.classList.remove('img-loading');
        img.classList.add('img-loaded');
        
        // Announce to screen readers if it's an important image
        if (img.alt && !img.getAttribute('aria-hidden')) {
            announceImageLoad(img);
        }
    });
    
    img.addEventListener('error', function() {
        handleImageError(img);
    });
}

/**
 * Handle image loading errors
 */
function handleImageError(img) {
    img.classList.add('img-error');
    
    // Set fallback image or placeholder
    if (!img.dataset.fallback) {
        img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBhdmFpbGFibGU8L3RleHQ+PC9zdmc+';
        img.alt = img.alt ? `${img.alt} (Image not available)` : 'Image not available';
    } else {
        img.src = img.dataset.fallback;
    }
    
    // Log error for debugging
    console.warn('Image failed to load:', img.src);
}

/**
 * Announce image load to screen readers for important images
 */
function announceImageLoad(img) {
    // Only announce for images that are likely important to content
    const importantSelectors = ['.hero__photo', '.project__image', '.profile-image'];
    const isImportant = importantSelectors.some(selector => img.matches(selector));
    
    if (isImportant && window.AccessibilityModule) {
        window.AccessibilityModule.announceToScreenReader(`Image loaded: ${img.alt}`);
    }
}

/**
 * Load all images immediately (fallback for older browsers)
 */
function loadAllImages() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => {
        loadImage(img);
    });
}

/**
 * Initialize image optimization features
 */
function initImageOptimization() {
    // Add responsive image support
    addResponsiveImageSupport();
    
    // Optimize image loading order
    optimizeImageLoadingOrder();
    
    // Add image format detection
    addImageFormatSupport();
}

/**
 * Add responsive image support
 */
function addResponsiveImageSupport() {
    const images = document.querySelectorAll('img:not([srcset])');
    
    images.forEach(img => {
        // Skip if already has srcset or is a small image
        if (img.srcset || img.width < 200) return;
        
        const src = img.src;
        if (!src || src.startsWith('data:')) return;
        
        // Generate responsive srcset (this would typically be done server-side)
        const baseName = src.replace(/\.[^/.]+$/, '');
        const extension = src.split('.').pop();
        
        // Example responsive sizes (adjust based on your image processing setup)
        const sizes = [
            { width: 320, suffix: '-small' },
            { width: 768, suffix: '-medium' },
            { width: 1200, suffix: '-large' }
        ];
        
        // Only add if we can reasonably assume these variants exist
        if (src.includes('/projects/') || src.includes('/profile/')) {
            const srcset = sizes.map(size => 
                `${baseName}${size.suffix}.${extension} ${size.width}w`
            ).join(', ');
            
            img.srcset = srcset;
            img.sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';
        }
    });
}

/**
 * Optimize image loading order
 */
function optimizeImageLoadingOrder() {
    // Prioritize above-the-fold images
    const aboveFoldImages = document.querySelectorAll('.hero img, .page-header img');
    aboveFoldImages.forEach(img => {
        img.loading = 'eager';
        img.fetchPriority = 'high';
    });
    
    // Defer below-the-fold images
    const belowFoldImages = document.querySelectorAll('.projects img, .footer img');
    belowFoldImages.forEach(img => {
        if (!img.loading) {
            img.loading = 'lazy';
        }
    });
}

/**
 * Add modern image format support
 */
function addImageFormatSupport() {
    // Check for WebP support
    const supportsWebP = checkWebPSupport();
    
    if (supportsWebP) {
        // Replace image sources with WebP versions if available
        const images = document.querySelectorAll('img[src*=".jpg"], img[src*=".png"]');
        images.forEach(img => {
            const webpSrc = img.src.replace(/\.(jpg|png)$/i, '.webp');
            
            // Create a test image to check if WebP version exists
            const testImg = new Image();
            testImg.onload = function() {
                img.src = webpSrc;
            };
            testImg.onerror = function() {
                // WebP version doesn't exist, keep original
            };
            testImg.src = webpSrc;
        });
    }
}

/**
 * Check WebP support
 */
function checkWebPSupport() {
    return new Promise(resolve => {
        const webP = new Image();
        webP.onload = webP.onerror = function() {
            resolve(webP.height === 2);
        };
        webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    });
}

/**
 * Initialize performance monitoring
 */
function initPerformanceMonitoring() {
    // Monitor Core Web Vitals
    monitorCoreWebVitals();
    
    // Monitor resource loading
    monitorResourceLoading();
    
    // Monitor user interactions
    monitorUserInteractions();
}

/**
 * Monitor Core Web Vitals
 */
function monitorCoreWebVitals() {
    // Largest Contentful Paint (LCP)
    if ('PerformanceObserver' in window) {
        try {
            const lcpObserver = new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                const lastEntry = entries[entries.length - 1];
                performanceState.performanceMetrics.lcp = lastEntry.startTime;
                
                // Log warning if LCP is poor (> 2.5s)
                if (lastEntry.startTime > 2500) {
                    console.warn('Poor LCP detected:', lastEntry.startTime + 'ms');
                }
            });
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (e) {
            console.warn('LCP monitoring not supported');
        }
        
        // First Input Delay (FID)
        try {
            const fidObserver = new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                entries.forEach(entry => {
                    performanceState.performanceMetrics.fid = entry.processingStart - entry.startTime;
                    
                    // Log warning if FID is poor (> 100ms)
                    if (entry.processingStart - entry.startTime > 100) {
                        console.warn('Poor FID detected:', entry.processingStart - entry.startTime + 'ms');
                    }
                });
            });
            fidObserver.observe({ entryTypes: ['first-input'] });
        } catch (e) {
            console.warn('FID monitoring not supported');
        }
        
        // Cumulative Layout Shift (CLS)
        try {
            let clsValue = 0;
            const clsObserver = new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                entries.forEach(entry => {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                });
                performanceState.performanceMetrics.cls = clsValue;
                
                // Log warning if CLS is poor (> 0.1)
                if (clsValue > 0.1) {
                    console.warn('Poor CLS detected:', clsValue);
                }
            });
            clsObserver.observe({ entryTypes: ['layout-shift'] });
        } catch (e) {
            console.warn('CLS monitoring not supported');
        }
    }
}

/**
 * Monitor resource loading performance
 */
function monitorResourceLoading() {
    window.addEventListener('load', function() {
        // Get navigation timing
        const navigation = performance.getEntriesByType('navigation')[0];
        if (navigation) {
            performanceState.performanceMetrics.pageLoadTime = navigation.loadEventEnd - navigation.fetchStart;
            performanceState.performanceMetrics.domContentLoaded = navigation.domContentLoadedEventEnd - navigation.fetchStart;
            performanceState.performanceMetrics.firstByte = navigation.responseStart - navigation.fetchStart;
            
            // Log performance metrics
            console.log('Performance Metrics:', {
                pageLoadTime: performanceState.performanceMetrics.pageLoadTime + 'ms',
                domContentLoaded: performanceState.performanceMetrics.domContentLoaded + 'ms',
                firstByte: performanceState.performanceMetrics.firstByte + 'ms'
            });
        }
        
        // Monitor resource loading
        const resources = performance.getEntriesByType('resource');
        const slowResources = resources.filter(resource => resource.duration > 1000);
        
        if (slowResources.length > 0) {
            console.warn('Slow loading resources detected:', slowResources);
        }
    });
}

/**
 * Monitor user interactions for performance impact
 */
function monitorUserInteractions() {
    let interactionCount = 0;
    
    // Monitor click interactions
    document.addEventListener('click', function(event) {
        const startTime = performance.now();
        
        // Use requestAnimationFrame to measure interaction response time
        requestAnimationFrame(() => {
            const responseTime = performance.now() - startTime;
            
            if (responseTime > 100) {
                console.warn('Slow interaction response:', {
                    element: event.target.tagName,
                    responseTime: responseTime + 'ms'
                });
            }
            
            interactionCount++;
        });
    });
    
    // Monitor form interactions
    document.addEventListener('input', function(event) {
        if (event.target.matches('input, textarea')) {
            const startTime = performance.now();
            
            requestAnimationFrame(() => {
                const responseTime = performance.now() - startTime;
                
                if (responseTime > 50) {
                    console.warn('Slow form input response:', {
                        field: event.target.name || event.target.id,
                        responseTime: responseTime + 'ms'
                    });
                }
            });
        }
    });
}

/**
 * Initialize accessibility-related performance optimizations
 */
function initAccessibilityPerformance() {
    // Optimize screen reader announcements
    optimizeScreenReaderPerformance();
    
    // Optimize focus management
    optimizeFocusPerformance();
    
    // Optimize keyboard navigation
    optimizeKeyboardPerformance();
}

/**
 * Optimize screen reader performance
 */
function optimizeScreenReaderPerformance() {
    // Debounce screen reader announcements
    let announcementTimeout;
    const originalAnnounce = window.AccessibilityModule?.announceToScreenReader;
    
    if (originalAnnounce) {
        window.AccessibilityModule.announceToScreenReader = function(message, priority = 'polite') {
            clearTimeout(announcementTimeout);
            announcementTimeout = setTimeout(() => {
                originalAnnounce.call(this, message, priority);
            }, 100);
        };
    }
}

/**
 * Optimize focus management performance
 */
function optimizeFocusPerformance() {
    // Use passive event listeners for focus tracking
    let focusTimeout;
    
    document.addEventListener('focusin', function(event) {
        clearTimeout(focusTimeout);
        focusTimeout = setTimeout(() => {
            // Perform focus-related updates
            updateFocusIndicators(event.target);
        }, 16); // ~60fps
    }, { passive: true });
}

/**
 * Update focus indicators efficiently
 */
function updateFocusIndicators(element) {
    // Remove previous focus indicators
    const previousFocused = document.querySelector('.focus-enhanced');
    if (previousFocused) {
        previousFocused.classList.remove('focus-enhanced');
    }
    
    // Add focus enhancement to current element
    if (element && element.matches('a, button, input, textarea, select')) {
        element.classList.add('focus-enhanced');
    }
}

/**
 * Optimize keyboard navigation performance
 */
function optimizeKeyboardPerformance() {
    // Use event delegation for keyboard handlers
    document.addEventListener('keydown', function(event) {
        // Handle keyboard navigation efficiently
        if (event.key === 'Tab') {
            handleTabNavigation(event);
        } else if (event.key.startsWith('Arrow')) {
            handleArrowNavigation(event);
        }
    }, { passive: false });
}

/**
 * Handle tab navigation efficiently
 */
function handleTabNavigation(event) {
    // Get focusable elements efficiently
    const focusableElements = getFocusableElements();
    const currentIndex = focusableElements.indexOf(event.target);
    
    // Predict next focus target for smooth transitions
    if (currentIndex !== -1) {
        const nextIndex = event.shiftKey ? currentIndex - 1 : currentIndex + 1;
        const nextElement = focusableElements[nextIndex];
        
        if (nextElement) {
            // Preload any resources needed for the next element
            preloadElementResources(nextElement);
        }
    }
}

/**
 * Handle arrow navigation efficiently
 */
function handleArrowNavigation(event) {
    // Only handle arrow keys in specific contexts
    const context = event.target.closest('[role="menubar"], .filter__controls, .nav__menu');
    if (!context) return;
    
    const items = context.querySelectorAll('[role="menuitem"], .filter__btn, .nav__link');
    const currentIndex = Array.from(items).indexOf(event.target);
    
    if (currentIndex === -1) return;
    
    let nextIndex;
    switch (event.key) {
        case 'ArrowDown':
        case 'ArrowRight':
            nextIndex = (currentIndex + 1) % items.length;
            break;
        case 'ArrowUp':
        case 'ArrowLeft':
            nextIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
            break;
        default:
            return;
    }
    
    event.preventDefault();
    items[nextIndex].focus();
}

/**
 * Get focusable elements efficiently
 */
function getFocusableElements() {
    // Cache focusable elements and update only when DOM changes
    if (!performanceState.focusableElements || performanceState.domChanged) {
        performanceState.focusableElements = Array.from(document.querySelectorAll(
            'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )).filter(el => {
            return el.offsetWidth > 0 && el.offsetHeight > 0 && !el.hidden;
        });
        performanceState.domChanged = false;
    }
    
    return performanceState.focusableElements;
}

/**
 * Preload resources for upcoming elements
 */
function preloadElementResources(element) {
    // Preload images that might be needed
    const img = element.querySelector('img[data-src]');
    if (img) {
        loadImage(img);
    }
    
    // Preload any lazy-loaded content
    const lazyContent = element.querySelector('[data-lazy]');
    if (lazyContent) {
        loadLazyContent(lazyContent);
    }
}

/**
 * Load lazy content
 */
function loadLazyContent(element) {
    const content = element.dataset.lazy;
    if (content) {
        element.innerHTML = content;
        element.removeAttribute('data-lazy');
    }
}

/**
 * Initialize resource optimization
 */
function initResourceOptimization() {
    // Optimize CSS loading
    optimizeCSSLoading();
    
    // Optimize JavaScript loading
    optimizeJSLoading();
    
    // Optimize font loading
    optimizeFontLoading();
}

/**
 * Optimize CSS loading
 */
function optimizeCSSLoading() {
    // Identify critical CSS (above-the-fold styles)
    const criticalStyles = [
        'header', 'nav', '.hero', '.page-header',
        '.skip-links', '.accessibility-shortcuts'
    ];
    
    // Mark non-critical CSS for deferred loading
    const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
    stylesheets.forEach(link => {
        if (link.href.includes('accessibility.css')) {
            // Keep accessibility CSS as high priority
            link.media = 'all';
        }
    });
}

/**
 * Optimize JavaScript loading
 */
function optimizeJSLoading() {
    // Defer non-critical JavaScript
    const scripts = document.querySelectorAll('script[src]');
    scripts.forEach(script => {
        if (!script.src.includes('accessibility.js') && !script.src.includes('main.js')) {
            script.defer = true;
        }
    });
}

/**
 * Optimize font loading
 */
function optimizeFontLoading() {
    // Add font-display: swap to improve loading performance
    const style = document.createElement('style');
    style.textContent = `
        @font-face {
            font-display: swap;
        }
    `;
    document.head.appendChild(style);
    
    // Preload critical fonts
    const criticalFonts = [
        // Add paths to critical fonts here
    ];
    
    criticalFonts.forEach(fontUrl => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = fontUrl;
        link.as = 'font';
        link.type = 'font/woff2';
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
    });
}

/**
 * Get performance metrics
 */
function getPerformanceMetrics() {
    return {
        ...performanceState.performanceMetrics,
        imageLoadTimes: performanceState.imageLoadTimes,
        timestamp: Date.now()
    };
}

/**
 * Clean up performance monitoring
 */
function cleanupPerformance() {
    if (performanceState.lazyLoadObserver) {
        performanceState.lazyLoadObserver.disconnect();
    }
    
    // Clear cached data
    performanceState.focusableElements = null;
    performanceState.imageLoadTimes = {};
}

// Initialize performance optimizations when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initPerformance();
});

// Mark DOM as changed when mutations occur
if ('MutationObserver' in window) {
    const domObserver = new MutationObserver(() => {
        performanceState.domChanged = true;
    });
    
    domObserver.observe(document.body, {
        childList: true,
        subtree: true
    });
}

// Export functions for external use
window.PerformanceModule = {
    initPerformance,
    getPerformanceMetrics,
    loadImage,
    cleanupPerformance
};