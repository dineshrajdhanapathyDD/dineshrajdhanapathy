/**
 * Comprehensive Error Suppression System
 * Prevents all browser popups and handles errors gracefully
 */

(function() {
    'use strict';

    // Suppress all console errors in production
    const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
    
    if (isProduction) {
        console.error = function() {};
        console.warn = function() {};
    }

    // Override window.onerror to prevent error popups
    window.onerror = function(message, source, lineno, colno, error) {
        // Log error silently for debugging (only in development)
        if (!isProduction) {
            console.log('Suppressed error:', { message, source, lineno, colno, error });
        }
        // Prevent the default browser error handling
        return true;
    };

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', function(event) {
        if (!isProduction) {
            console.log('Suppressed promise rejection:', event.reason);
        }
        event.preventDefault();
    });

    // Suppress resource loading errors
    window.addEventListener('error', function(event) {
        if (event.target !== window) {
            // This is a resource loading error (image, script, etc.)
            if (!isProduction) {
                console.log('Suppressed resource error:', event.target.src || event.target.href);
            }
            event.preventDefault();
            event.stopPropagation();
            return false;
        }
    }, true);

    // Override fetch to handle network errors silently
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
        return originalFetch.apply(this, args)
            .catch(error => {
                if (!isProduction) {
                    console.log('Suppressed fetch error:', error);
                }
                // Return a resolved promise with a fake response to prevent errors
                return Promise.resolve({
                    ok: false,
                    status: 404,
                    statusText: 'Not Found',
                    json: () => Promise.resolve({}),
                    text: () => Promise.resolve(''),
                    blob: () => Promise.resolve(new Blob()),
                });
            });
    };

    // Override XMLHttpRequest to handle errors silently
    const originalXHROpen = XMLHttpRequest.prototype.open;
    const originalXHRSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function(...args) {
        this.addEventListener('error', function(event) {
            if (!isProduction) {
                console.log('Suppressed XHR error:', event);
            }
            event.preventDefault();
            event.stopPropagation();
        });
        return originalXHROpen.apply(this, args);
    };

    // Prevent image loading errors from showing popups
    function handleImageErrors() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            img.addEventListener('error', function(event) {
                event.preventDefault();
                event.stopPropagation();
                
                // Hide the broken image
                this.style.display = 'none';
                
                // Show fallback if available
                const fallback = this.nextElementSibling;
                if (fallback && (fallback.classList.contains('fallback') || fallback.classList.contains('placeholder'))) {
                    fallback.style.display = 'flex';
                }
                
                if (!isProduction) {
                    console.log('Image failed to load:', this.src);
                }
            });
            
            // Also handle the load event to ensure image is valid
            img.addEventListener('load', function() {
                // Image loaded successfully, ensure fallback is hidden
                const fallback = this.nextElementSibling;
                if (fallback && (fallback.classList.contains('fallback') || fallback.classList.contains('placeholder'))) {
                    fallback.style.display = 'none';
                }
            });
        });
    }

    // Prevent link errors from showing popups
    function handleLinkErrors() {
        const links = document.querySelectorAll('a[href]');
        links.forEach(link => {
            link.addEventListener('click', function(event) {
                const href = this.getAttribute('href');
                
                // Check for obviously broken links
                if (!href || href === '#' || href === '' || href === 'javascript:void(0)') {
                    event.preventDefault();
                    if (!isProduction) {
                        console.log('Prevented navigation to invalid link:', href);
                    }
                    return false;
                }
                
                // For download links, validate before allowing
                if (this.hasAttribute('download')) {
                    const url = this.href;
                    
                    // Use a simple HEAD request to check if resource exists
                    fetch(url, { method: 'HEAD' })
                        .then(response => {
                            if (!response.ok) {
                                // File doesn't exist, show user-friendly message
                                showNotification('The requested file is currently unavailable. Please try again later.', 'warning');
                            }
                        })
                        .catch(() => {
                            // Network error or file doesn't exist
                            showNotification('Download failed. Please check your connection and try again.', 'error');
                        });
                }
            });
        });
    }

    // Prevent script loading errors
    function handleScriptErrors() {
        const scripts = document.querySelectorAll('script[src]');
        scripts.forEach(script => {
            script.addEventListener('error', function(event) {
                event.preventDefault();
                event.stopPropagation();
                if (!isProduction) {
                    console.log('Script failed to load:', this.src);
                }
            });
        });
    }

    // Prevent CSS loading errors
    function handleStyleErrors() {
        const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
        stylesheets.forEach(stylesheet => {
            stylesheet.addEventListener('error', function(event) {
                event.preventDefault();
                event.stopPropagation();
                if (!isProduction) {
                    console.log('Stylesheet failed to load:', this.href);
                }
            });
        });
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

    // Make showNotification globally available
    window.showNotification = showNotification;

    // Initialize error handling when DOM is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            handleImageErrors();
            handleLinkErrors();
            handleScriptErrors();
            handleStyleErrors();
        });
    } else {
        // DOM is already loaded
        handleImageErrors();
        handleLinkErrors();
        handleScriptErrors();
        handleStyleErrors();
    }

    // Also handle dynamically added elements
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === 1) { // Element node
                    // Handle new images
                    if (node.tagName === 'IMG') {
                        node.addEventListener('error', function(event) {
                            event.preventDefault();
                            event.stopPropagation();
                            this.style.display = 'none';
                            const fallback = this.nextElementSibling;
                            if (fallback && (fallback.classList.contains('fallback') || fallback.classList.contains('placeholder'))) {
                                fallback.style.display = 'flex';
                            }
                        });
                    }
                    
                    // Handle new images within added elements
                    const newImages = node.querySelectorAll ? node.querySelectorAll('img') : [];
                    newImages.forEach(img => {
                        img.addEventListener('error', function(event) {
                            event.preventDefault();
                            event.stopPropagation();
                            this.style.display = 'none';
                            const fallback = this.nextElementSibling;
                            if (fallback && (fallback.classList.contains('fallback') || fallback.classList.contains('placeholder'))) {
                                fallback.style.display = 'flex';
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

    // Suppress browser's default error dialogs
    window.addEventListener('beforeunload', function() {
        // Clear any pending error handlers
        window.onerror = null;
        window.onunhandledrejection = null;
    });

    // Additional safety net for any remaining errors
    setTimeout(function() {
        // Override any remaining error handlers
        const originalAlert = window.alert;
        const originalConfirm = window.confirm;
        
        window.alert = function(message) {
            if (!isProduction) {
                console.log('Suppressed alert:', message);
            }
            // Show our custom notification instead
            showNotification(message, 'info');
        };
        
        window.confirm = function(message) {
            if (!isProduction) {
                console.log('Suppressed confirm:', message);
            }
            // Always return true to prevent blocking
            return true;
        };
    }, 1000);

})();