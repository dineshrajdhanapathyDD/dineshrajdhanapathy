/**
 * Cloud Certification Roadmap - Performance Optimizer
 * 
 * This module optimizes the performance of the Cloud Certification Roadmap.
 */

// Performance Optimizer Module using revealing module pattern
window.CertificationRoadmap = window.CertificationRoadmap || {};
window.CertificationRoadmap.PerformanceOptimizer = (function() {
    // Private variables
    let performanceMetrics = {
        loadTime: 0,
        renderTime: 0,
        interactionTime: 0,
        memoryUsage: 0
    };
    
    let isMonitoring = false;
    let renderStartTime = 0;
    let interactionStartTime = 0;
    
    // Private functions
    function initPerformanceOptimizer() {
        // Start monitoring performance
        startPerformanceMonitoring();
        
        // Apply performance optimizations
        applyPerformanceOptimizations();
        
        // Optimize images
        optimizeImages();
        
        // Optimize DOM operations
        optimizeDOMOperations();
        
        // Optimize event listeners
        optimizeEventListeners();
        
        // Optimize storage operations
        optimizeStorageOperations();
    }
    
    function startPerformanceMonitoring() {
        if (isMonitoring) return;
        
        isMonitoring = true;
        
        // Record load time
        if (window.performance && window.performance.timing) {
            const timing = window.performance.timing;
            performanceMetrics.loadTime = timing.loadEventEnd - timing.navigationStart;
        }
        
        // Monitor render time
        document.addEventListener('DOMContentLoaded', function() {
            renderStartTime = performance.now();
        });
        
        window.addEventListener('load', function() {
            performanceMetrics.renderTime = performance.now() - renderStartTime;
            console.log('Render time:', performanceMetrics.renderTime, 'ms');
        });
        
        // Monitor interaction time
        document.addEventListener('click', function() {
            if (interactionStartTime === 0) {
                interactionStartTime = performance.now();
            }
        });
        
        // Monitor memory usage
        if (window.performance && window.performance.memory) {
            setInterval(function() {
                performanceMetrics.memoryUsage = window.performance.memory.usedJSHeapSize;
            }, 5000);
        }
    }
    
    function applyPerformanceOptimizations() {
        // Use requestAnimationFrame for animations
        optimizeAnimations();
        
        // Use passive event listeners
        usePassiveEventListeners();
        
        // Optimize CSS selectors
        optimizeCSSSelectors();
        
        // Optimize JavaScript execution
        optimizeJavaScriptExecution();
    }
    
    function optimizeAnimations() {
        // Replace setTimeout/setInterval with requestAnimationFrame for animations
        window.CertificationRoadmap.requestAnimationFrame = function(callback) {
            return window.requestAnimationFrame(callback) ||
                window.webkitRequestAnimationFrame(callback) ||
                window.mozRequestAnimationFrame(callback) ||
                window.oRequestAnimationFrame(callback) ||
                window.msRequestAnimationFrame(callback) ||
                function(callback) {
                    window.setTimeout(callback, 1000 / 60);
                };
        };
    }
    
    function usePassiveEventListeners() {
        // Check if passive event listeners are supported
        let supportsPassive = false;
        try {
            const opts = Object.defineProperty({}, 'passive', {
                get: function() {
                    supportsPassive = true;
                    return true;
                }
            });
            window.addEventListener('test', null, opts);
            window.removeEventListener('test', null, opts);
        } catch (e) {}
        
        // Store the original addEventListener
        const originalAddEventListener = EventTarget.prototype.addEventListener;
        
        // Override addEventListener to use passive by default for certain events
        EventTarget.prototype.addEventListener = function(type, listener, options) {
            const passiveEvents = ['touchstart', 'touchmove', 'wheel', 'mousewheel'];
            
            let newOptions = options;
            if (supportsPassive && passiveEvents.includes(type)) {
                if (typeof options === 'object') {
                    newOptions = Object.assign({}, options, { passive: true });
                } else {
                    newOptions = { passive: true };
                }
            }
            
            return originalAddEventListener.call(this, type, listener, newOptions);
        };
    }
    
    function optimizeCSSSelectors() {
        // Add CSS optimization hints
        const style = document.createElement('style');
        style.textContent = `
            /* Optimize CSS selectors */
            .certification-roadmap * {
                contain: content;
            }
            
            /* Use will-change for elements that will animate */
            .certification-roadmap-workflow__step,
            .certification-card,
            .resource-card {
                will-change: transform, opacity;
            }
            
            /* Use hardware acceleration for animations */
            .certification-roadmap__step--active,
            .certification-details__tab--active,
            .resource-card:hover {
                transform: translateZ(0);
            }
        `;
        
        document.head.appendChild(style);
    }
    
    function optimizeJavaScriptExecution() {
        // Use debounce for expensive operations
        window.CertificationRoadmap.debounce = function(func, wait) {
            let timeout;
            return function() {
                const context = this;
                const args = arguments;
                clearTimeout(timeout);
                timeout = setTimeout(function() {
                    func.apply(context, args);
                }, wait);
            };
        };
        
        // Use throttle for frequent events
        window.CertificationRoadmap.throttle = function(func, limit) {
            let inThrottle;
            return function() {
                const context = this;
                const args = arguments;
                if (!inThrottle) {
                    func.apply(context, args);
                    inThrottle = true;
                    setTimeout(function() {
                        inThrottle = false;
                    }, limit);
                }
            };
        };
    }
    
    function optimizeImages() {
        // Lazy load images
        const images = document.querySelectorAll('.certification-roadmap img');
        
        if ('loading' in HTMLImageElement.prototype) {
            // Browser supports native lazy loading
            images.forEach(img => {
                img.loading = 'lazy';
            });
        } else {
            // Fallback for browsers that don't support native lazy loading
            const lazyImages = Array.from(images);
            
            if ('IntersectionObserver' in window) {
                const imageObserver = new IntersectionObserver(function(entries) {
                    entries.forEach(function(entry) {
                        if (entry.isIntersecting) {
                            const lazyImage = entry.target;
                            if (lazyImage.dataset.src) {
                                lazyImage.src = lazyImage.dataset.src;
                                lazyImage.removeAttribute('data-src');
                            }
                            imageObserver.unobserve(lazyImage);
                        }
                    });
                });
                
                lazyImages.forEach(function(lazyImage) {
                    imageObserver.observe(lazyImage);
                });
            }
        }
    }
    
    function optimizeDOMOperations() {
        // Use document fragments for batch DOM operations
        window.CertificationRoadmap.createElementsFragment = function(elements) {
            const fragment = document.createDocumentFragment();
            
            elements.forEach(element => {
                fragment.appendChild(element);
            });
            
            return fragment;
        };
        
        // Cache DOM elements
        window.CertificationRoadmap.domCache = {};
        
        window.CertificationRoadmap.getDOMElement = function(selector) {
            if (!window.CertificationRoadmap.domCache[selector]) {
                window.CertificationRoadmap.domCache[selector] = document.querySelector(selector);
            }
            
            return window.CertificationRoadmap.domCache[selector];
        };
        
        window.CertificationRoadmap.getDOMElements = function(selector) {
            if (!window.CertificationRoadmap.domCache[selector]) {
                window.CertificationRoadmap.domCache[selector] = document.querySelectorAll(selector);
            }
            
            return window.CertificationRoadmap.domCache[selector];
        };
        
        // Clear DOM cache when content changes
        window.CertificationRoadmap.clearDOMCache = function() {
            window.CertificationRoadmap.domCache = {};
        };
    }
    
    function optimizeEventListeners() {
        // Use event delegation
        window.CertificationRoadmap.delegateEvent = function(element, eventName, selector, handler) {
            element.addEventListener(eventName, function(event) {
                const target = event.target.closest(selector);
                
                if (target && element.contains(target)) {
                    handler.call(target, event);
                }
            });
        };
    }
    
    function optimizeStorageOperations() {
        // Batch localStorage operations
        const originalStorageService = window.CertificationRoadmap.StorageService;
        
        if (originalStorageService) {
            // Create a write buffer
            let writeBuffer = {};
            let writeTimeout = null;
            
            // Override saveItem method
            const originalSaveItem = originalStorageService.saveItem;
            
            originalStorageService.saveItem = function(key, value) {
                // Add to write buffer
                writeBuffer[key] = value;
                
                // Schedule flush
                if (!writeTimeout) {
                    writeTimeout = setTimeout(function() {
                        // Flush write buffer
                        for (const bufferKey in writeBuffer) {
                            originalSaveItem.call(originalStorageService, bufferKey, writeBuffer[bufferKey]);
                        }
                        
                        // Clear write buffer
                        writeBuffer = {};
                        writeTimeout = null;
                    }, 100);
                }
            };
        }
    }
    
    function getPerformanceMetrics() {
        return performanceMetrics;
    }
    
    // Public API
    return {
        /**
         * Initialize performance optimizer
         */
        init: function() {
            initPerformanceOptimizer();
        },
        
        /**
         * Get performance metrics
         * @returns {Object} Performance metrics
         */
        getPerformanceMetrics: function() {
            return getPerformanceMetrics();
        }
    };
})();

// Initialize performance optimizer
document.addEventListener('DOMContentLoaded', function() {
    window.CertificationRoadmap.PerformanceOptimizer.init();
});