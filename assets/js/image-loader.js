/**
 * Graceful Image Loading System
 * Prevents broken images from showing and handles loading states
 */

(function() {
    'use strict';

    // Function to handle image loading
    function handleImageLoad(img) {
        img.classList.add('loaded');
        img.style.opacity = '1';
        
        // Hide any fallback elements
        const fallback = img.nextElementSibling;
        if (fallback && (fallback.classList.contains('fallback') || fallback.classList.contains('placeholder'))) {
            fallback.style.display = 'none';
        }
    }

    // Function to handle image errors
    function handleImageError(img) {
        img.style.display = 'none';
        img.classList.add('error-hidden');
        
        // Show fallback if available
        const fallback = img.nextElementSibling;
        if (fallback && (fallback.classList.contains('fallback') || fallback.classList.contains('placeholder'))) {
            fallback.style.display = 'flex';
            fallback.classList.add('show');
        }
        
        // Create a simple fallback if none exists
        if (!fallback || (!fallback.classList.contains('fallback') && !fallback.classList.contains('placeholder'))) {
            const simpleFallback = document.createElement('div');
            simpleFallback.className = 'simple-fallback';
            simpleFallback.style.cssText = `
                width: ${img.width || 100}px;
                height: ${img.height || 100}px;
                background: #f8f9fa;
                border: 1px solid #dee2e6;
                border-radius: 4px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #6c757d;
                font-size: 0.8rem;
                text-align: center;
            `;
            simpleFallback.innerHTML = img.alt || 'Image';
            img.parentNode.insertBefore(simpleFallback, img.nextSibling);
        }
    }

    // Function to preload and validate images
    function validateImage(img) {
        return new Promise((resolve) => {
            if (!img.src || img.src === '' || img.src === window.location.href) {
                resolve(false);
                return;
            }

            const testImg = new Image();
            testImg.onload = () => resolve(true);
            testImg.onerror = () => resolve(false);
            testImg.src = img.src;
        });
    }

    // Initialize image handling
    function initImageHandling() {
        const images = document.querySelectorAll('img');
        
        images.forEach(async (img) => {
            // Set initial state
            img.style.opacity = '0';
            
            // Validate image
            const isValid = await validateImage(img);
            
            if (isValid) {
                // Image is valid, set up load handler
                if (img.complete) {
                    handleImageLoad(img);
                } else {
                    img.addEventListener('load', () => handleImageLoad(img));
                    img.addEventListener('error', () => handleImageError(img));
                }
            } else {
                // Image is invalid, handle error immediately
                handleImageError(img);
            }
        });
    }

    // Handle dynamically added images
    function observeNewImages() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) {
                        // Handle new images
                        if (node.tagName === 'IMG') {
                            validateImage(node).then(isValid => {
                                if (isValid) {
                                    node.addEventListener('load', () => handleImageLoad(node));
                                    node.addEventListener('error', () => handleImageError(node));
                                } else {
                                    handleImageError(node);
                                }
                            });
                        }
                        
                        // Handle images within new elements
                        const newImages = node.querySelectorAll ? node.querySelectorAll('img') : [];
                        newImages.forEach(img => {
                            validateImage(img).then(isValid => {
                                if (isValid) {
                                    img.addEventListener('load', () => handleImageLoad(img));
                                    img.addEventListener('error', () => handleImageError(img));
                                } else {
                                    handleImageError(img);
                                }
                            });
                        });
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initImageHandling();
            observeNewImages();
        });
    } else {
        initImageHandling();
        observeNewImages();
    }

    // Export functions for global use
    window.handleImageError = handleImageError;
    window.handleImageLoad = handleImageLoad;

})();