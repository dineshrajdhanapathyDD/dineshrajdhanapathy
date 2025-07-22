/**
 * Image optimization and lazy loading functionality
 * Handles efficient image loading, optimization, and performance
 */

// Image loading configuration
const imageConfig = {
    // Lazy loading settings
    lazyLoadThreshold: '50px',
    fadeInDuration: 300,
    
    // Image quality settings
    defaultQuality: 85,
    retinaQuality: 75,
    
    // Supported formats (in order of preference)
    supportedFormats: ['webp', 'avif', 'jpg', 'png'],
    
    // Placeholder settings
    placeholderColor: '#f0f0f0',
    placeholderText: '📷',
    
    // Performance settings
    maxConcurrentLoads: 3,
    retryAttempts: 2,
    retryDelay: 1000
};

// Global state
let imageLoadQueue = [];
let currentlyLoading = 0;
let intersectionObserver = null;
let imageCache = new Map();

/**
 * Initialize image optimization system
 */
function initImageOptimization() {
    // Set up lazy loading
    initLazyLoading();
    
    // Optimize existing images
    optimizeExistingImages();
    
    // Add responsive image support
    initResponsiveImages();
    
    // Set up image error handling
    initImageErrorHandling();
    
    // Initialize image analytics
    initImageAnalytics();
    
    // Add image preloading for critical images
    preloadCriticalImages();
}

/**
 * Initialize lazy loading with Intersection Observer
 */
function initLazyLoading() {
    if (!('IntersectionObserver' in window)) {
        // Fallback for older browsers
        loadAllImages();
        return;
    }
    
    const observerOptions = {
        root: null,
        rootMargin: imageConfig.lazyLoadThreshold,
        threshold: 0.01
    };
    
    intersectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                loadImage(entry.target);
                intersectionObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all lazy images
    const lazyImages = document.querySelectorAll('img[data-src], img[loading="lazy"]');
    lazyImages.forEach(img => {
        setupLazyImage(img);
        intersectionObserver.observe(img);
    });
}

/**
 * Set up individual lazy image
 */
function setupLazyImage(img) {
    // Add loading class
    img.classList.add('img-lazy');
    
    // Set up placeholder if no src
    if (!img.src && !img.dataset.src) {
        img.src = generatePlaceholder(img);
    }
    
    // Add loading attribute for native lazy loading support
    if (!img.hasAttribute('loading')) {
        img.setAttribute('loading', 'lazy');
    }
    
    // Add proper alt text if missing
    if (!img.alt) {
        img.alt = generateAltText(img);
    }
    
    // Set up error handling
    img.addEventListener('error', () => handleImageError(img));
    
    // Set up load success
    img.addEventListener('load', () => handleImageLoad(img));
}

/**
 * Load individual image
 */
async function loadImage(img) {
    if (img.classList.contains('img-loaded') || img.classList.contains('img-loading')) {
        return;
    }
    
    // Check concurrent loading limit
    if (currentlyLoading >= imageConfig.maxConcurrentLoads) {
        imageLoadQueue.push(img);
        return;
    }
    
    currentlyLoading++;
    img.classList.add('img-loading');
    
    try {
        const imageSrc = img.dataset.src || img.src;
        const optimizedSrc = await getOptimizedImageSrc(imageSrc, img);
        
        // Preload the image
        await preloadImage(optimizedSrc);
        
        // Update image source
        img.src = optimizedSrc;
        
        // Track successful load
        trackImageEvent('image_loaded', {
            src: optimizedSrc,
            width: img.width || img.naturalWidth,
            height: img.height || img.naturalHeight
        });
        
    } catch (error) {
        handleImageError(img, error);
    } finally {
        currentlyLoading--;
        processImageQueue();
    }
}

/**
 * Process image loading queue
 */
function processImageQueue() {
    if (imageLoadQueue.length > 0 && currentlyLoading < imageConfig.maxConcurrentLoads) {
        const nextImage = imageLoadQueue.shift();
        loadImage(nextImage);
    }
}

/**
 * Get optimized image source
 */
async function getOptimizedImageSrc(originalSrc, imgElement) {
    // Check cache first
    const cacheKey = `${originalSrc}_${imgElement.width || 'auto'}_${imgElement.height || 'auto'}`;
    if (imageCache.has(cacheKey)) {
        return imageCache.get(cacheKey);
    }
    
    let optimizedSrc = originalSrc;
    
    // Apply responsive sizing
    optimizedSrc = applyResponsiveSizing(optimizedSrc, imgElement);
    
    // Apply format optimization
    optimizedSrc = await applyFormatOptimization(optimizedSrc);
    
    // Apply quality optimization
    optimizedSrc = applyQualityOptimization(optimizedSrc, imgElement);
    
    // Cache the result
    imageCache.set(cacheKey, optimizedSrc);
    
    return optimizedSrc;
}

/**
 * Apply responsive sizing to image URL
 */
function applyResponsiveSizing(src, imgElement) {
    // Get target dimensions
    const containerWidth = imgElement.parentElement?.offsetWidth || window.innerWidth;
    const devicePixelRatio = window.devicePixelRatio || 1;
    const targetWidth = Math.min(containerWidth * devicePixelRatio, 2000); // Cap at 2000px
    
    // For local images, we can't resize on the fly, but we can add parameters for future CDN integration
    if (src.startsWith('assets/') || src.startsWith('./assets/')) {
        return src; // Return as-is for local images
    }
    
    // For external images or CDN, add sizing parameters
    const url = new URL(src, window.location.origin);
    url.searchParams.set('w', Math.round(targetWidth).toString());
    url.searchParams.set('fit', 'cover');
    url.searchParams.set('auto', 'format');
    
    return url.toString();
}

/**
 * Apply format optimization
 */
async function applyFormatOptimization(src) {
    // Check browser support for modern formats
    const supportsWebP = await checkFormatSupport('webp');
    const supportsAVIF = await checkFormatSupport('avif');
    
    // For local images, we can't convert formats on the fly
    if (src.startsWith('assets/') || src.startsWith('./assets/')) {
        return src;
    }
    
    // For external images or CDN, request optimal format
    const url = new URL(src, window.location.origin);
    
    if (supportsAVIF) {
        url.searchParams.set('format', 'avif');
    } else if (supportsWebP) {
        url.searchParams.set('format', 'webp');
    }
    
    return url.toString();
}

/**
 * Check browser support for image format
 */
function checkFormatSupport(format) {
    return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, 1, 1);
        
        canvas.toBlob((blob) => {
            resolve(blob !== null);
        }, `image/${format}`);
    });
}

/**
 * Apply quality optimization
 */
function applyQualityOptimization(src, imgElement) {
    // For local images, return as-is
    if (src.startsWith('assets/') || src.startsWith('./assets/')) {
        return src;
    }
    
    const isRetina = window.devicePixelRatio > 1;
    const quality = isRetina ? imageConfig.retinaQuality : imageConfig.defaultQuality;
    
    const url = new URL(src, window.location.origin);
    url.searchParams.set('q', quality.toString());
    
    return url.toString();
}

/**
 * Preload image
 */
function preloadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
        
        img.src = src;
    });
}

/**
 * Handle successful image load
 */
function handleImageLoad(img) {
    img.classList.remove('img-loading');
    img.classList.add('img-loaded');
    
    // Add fade-in effect
    img.style.opacity = '0';
    img.style.transition = `opacity ${imageConfig.fadeInDuration}ms ease-in-out`;
    
    // Trigger fade-in
    requestAnimationFrame(() => {
        img.style.opacity = '1';
    });
    
    // Remove data-src attribute
    if (img.dataset.src) {
        delete img.dataset.src;
    }
}

/**
 * Handle image loading error
 */
function handleImageError(img, error = null) {
    img.classList.remove('img-loading');
    img.classList.add('img-error');
    
    // Set fallback image
    const fallbackSrc = generateErrorPlaceholder(img);
    if (img.src !== fallbackSrc) {
        img.src = fallbackSrc;
    }
    
    // Track error
    trackImageEvent('image_error', {
        src: img.dataset.src || img.src,
        error: error?.message || 'Unknown error',
        alt: img.alt
    });
    
    console.warn('Image failed to load:', img.dataset.src || img.src, error);
}

/**
 * Generate placeholder image
 */
function generatePlaceholder(img) {
    const width = img.width || img.offsetWidth || 300;
    const height = img.height || img.offsetHeight || 200;
    
    // Create SVG placeholder
    const svg = `
        <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="${imageConfig.placeholderColor}"/>
            <text x="50%" y="50%" text-anchor="middle" dy=".3em" font-family="Arial, sans-serif" font-size="24" fill="#999">
                ${imageConfig.placeholderText}
            </text>
        </svg>
    `;
    
    return `data:image/svg+xml;base64,${btoa(svg)}`;
}

/**
 * Generate error placeholder
 */
function generateErrorPlaceholder(img) {
    const width = img.width || img.offsetWidth || 300;
    const height = img.height || img.offsetHeight || 200;
    
    const svg = `
        <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="#f8f8f8" stroke="#ddd" stroke-width="2"/>
            <text x="50%" y="45%" text-anchor="middle" dy=".3em" font-family="Arial, sans-serif" font-size="16" fill="#666">
                Image not available
            </text>
            <text x="50%" y="60%" text-anchor="middle" dy=".3em" font-family="Arial, sans-serif" font-size="12" fill="#999">
                📷
            </text>
        </svg>
    `;
    
    return `data:image/svg+xml;base64,${btoa(svg)}`;
}

/**
 * Generate alt text for images without alt attribute
 */
function generateAltText(img) {
    const src = img.dataset.src || img.src;
    
    // Extract filename without extension
    const filename = src.split('/').pop().split('.')[0];
    
    // Convert filename to readable text
    const altText = filename
        .replace(/[-_]/g, ' ')
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .toLowerCase()
        .replace(/\b\w/g, l => l.toUpperCase());
    
    return altText || 'Image';
}

/**
 * Optimize existing images on the page
 */
function optimizeExistingImages() {
    const images = document.querySelectorAll('img:not([data-src]):not(.img-lazy)');
    
    images.forEach(img => {
        // Add loading attribute if not present
        if (!img.hasAttribute('loading') && !img.classList.contains('hero__photo')) {
            img.setAttribute('loading', 'lazy');
        }
        
        // Add proper alt text if missing
        if (!img.alt) {
            img.alt = generateAltText(img);
        }
        
        // Set up error handling
        img.addEventListener('error', () => handleImageError(img));
        
        // Add optimization classes
        img.classList.add('img-optimized');
    });
}

/**
 * Initialize responsive images
 */
function initResponsiveImages() {
    // Handle window resize for responsive images
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            updateResponsiveImages();
        }, 250);
    });
    
    // Handle device pixel ratio changes
    if ('matchMedia' in window) {
        const mediaQuery = window.matchMedia('(min-resolution: 2dppx)');
        mediaQuery.addListener(() => {
            updateResponsiveImages();
        });
    }
}

/**
 * Update responsive images on resize
 */
function updateResponsiveImages() {
    const images = document.querySelectorAll('img.img-loaded');
    
    images.forEach(async (img) => {
        const originalSrc = img.dataset.originalSrc || img.src;
        const newOptimizedSrc = await getOptimizedImageSrc(originalSrc, img);
        
        if (newOptimizedSrc !== img.src) {
            img.dataset.originalSrc = originalSrc;
            img.src = newOptimizedSrc;
        }
    });
}

/**
 * Initialize image error handling
 */
function initImageErrorHandling() {
    // Global error handler for images
    window.addEventListener('error', (event) => {
        if (event.target.tagName === 'IMG') {
            handleImageError(event.target);
        }
    }, true);
}

/**
 * Preload critical images
 */
function preloadCriticalImages() {
    // Preload hero images and other critical images
    const criticalImages = document.querySelectorAll('.hero__photo, .project__image[data-featured="true"]');
    
    criticalImages.forEach(async (img) => {
        try {
            const src = img.dataset.src || img.src;
            if (src && !src.startsWith('data:')) {
                await preloadImage(src);
                img.classList.add('img-preloaded');
            }
        } catch (error) {
            console.warn('Failed to preload critical image:', error);
        }
    });
}

/**
 * Initialize image analytics
 */
function initImageAnalytics() {
    // Track image loading performance
    if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
            list.getEntries().forEach((entry) => {
                if (entry.initiatorType === 'img') {
                    trackImageEvent('image_performance', {
                        src: entry.name,
                        loadTime: entry.duration,
                        size: entry.transferSize
                    });
                }
            });
        });
        
        observer.observe({ entryTypes: ['resource'] });
    }
    
    // Track lazy loading effectiveness
    trackImageEvent('lazy_loading_initialized', {
        totalImages: document.querySelectorAll('img').length,
        lazyImages: document.querySelectorAll('img[data-src], img[loading="lazy"]').length
    });
}

/**
 * Track image events
 */
function trackImageEvent(eventName, data = {}) {
    // Integration with analytics services
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, {
            'image_optimization': true,
            ...data
        });
    }
    
    console.log(`Image event: ${eventName}`, data);
}

/**
 * Load all images (fallback for older browsers)
 */
function loadAllImages() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    lazyImages.forEach(img => {
        img.src = img.dataset.src;
        delete img.dataset.src;
        setupLazyImage(img);
    });
}

/**
 * Public API for manual image loading
 */
function loadImageManually(img) {
    if (intersectionObserver) {
        intersectionObserver.unobserve(img);
    }
    loadImage(img);
}

/**
 * Get image loading statistics
 */
function getImageStats() {
    const allImages = document.querySelectorAll('img');
    const loadedImages = document.querySelectorAll('img.img-loaded');
    const errorImages = document.querySelectorAll('img.img-error');
    const lazyImages = document.querySelectorAll('img.img-lazy');
    
    return {
        total: allImages.length,
        loaded: loadedImages.length,
        errors: errorImages.length,
        lazy: lazyImages.length,
        loadingProgress: Math.round((loadedImages.length / allImages.length) * 100)
    };
}

// Initialize image optimization when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initImageOptimization();
});

// Export functions for external use
window.ImageOptimization = {
    initImageOptimization,
    loadImageManually,
    getImageStats,
    trackImageEvent
};