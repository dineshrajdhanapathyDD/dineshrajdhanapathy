/**
 * Global Error Handling Module
 * Provides graceful error handling for various scenarios across the site
 */

// Error handling state
const errorState = {
    isInitialized: false,
    errorLog: [],
    maxLogEntries: 50,
    retryAttempts: {},
    maxRetries: 3
};

/**
 * Initialize global error handling
 */
function initErrorHandling() {
    if (errorState.isInitialized) return;
    
    setupGlobalErrorHandlers();
    setupNetworkErrorHandling();
    setupFormErrorHandling();
    setupImageErrorHandling();
    setupScriptErrorHandling();
    
    errorState.isInitialized = true;
    console.log('Global error handling initialized');
}

/**
 * Setup global JavaScript error handlers
 */
function setupGlobalErrorHandlers() {
    // Handle uncaught JavaScript errors
    window.addEventListener('error', function(event) {
        const error = {
            type: 'javascript',
            message: event.message,
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
            stack: event.error?.stack,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent
        };
        
        logError(error);
        handleJavaScriptError(error);
    });
    
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', function(event) {
        const error = {
            type: 'promise_rejection',
            message: event.reason?.message || 'Unhandled promise rejection',
            stack: event.reason?.stack,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent
        };
        
        logError(error);
        handlePromiseRejection(error);
        
        // Prevent the default browser behavior
        event.preventDefault();
    });
}

/**
 * Setup network error handling
 */
function setupNetworkErrorHandling() {
    // Override fetch to add error handling
    const originalFetch = window.fetch;
    window.fetch = async function(...args) {
        try {
            const response = await originalFetch.apply(this, args);
            
            if (!response.ok) {
                const error = {
                    type: 'network',
                    status: response.status,
                    statusText: response.statusText,
                    url: response.url,
                    timestamp: new Date().toISOString()
                };
                
                logError(error);
                handleNetworkError(error);
            }
            
            return response;
        } catch (networkError) {
            const error = {
                type: 'network',
                message: networkError.message,
                url: args[0],
                timestamp: new Date().toISOString()
            };
            
            logError(error);
            handleNetworkError(error);
            throw networkError;
        }
    };
}

/**
 * Setup form error handling
 */
function setupFormErrorHandling() {
    document.addEventListener('submit', function(event) {
        const form = event.target;
        if (!form.tagName || form.tagName.toLowerCase() !== 'form') return;
        
        // Add form submission error handling
        setTimeout(() => {
            const formData = new FormData(form);
            const formInfo = {
                id: form.id,
                action: form.action,
                method: form.method,
                fields: Array.from(formData.keys())
            };
            
            // Track form submission attempt
            trackFormEvent('form_submission_attempt', formInfo);
        }, 0);
    });
    
    // Handle form validation errors
    document.addEventListener('invalid', function(event) {
        const field = event.target;
        const error = {
            type: 'form_validation',
            fieldName: field.name || field.id,
            fieldType: field.type,
            validationMessage: field.validationMessage,
            formId: field.form?.id,
            timestamp: new Date().toISOString()
        };
        
        logError(error);
        handleFormValidationError(error, field);
    }, true);
}

/**
 * Setup image error handling
 */
function setupImageErrorHandling() {
    document.addEventListener('error', function(event) {
        const target = event.target;
        
        if (target.tagName && target.tagName.toLowerCase() === 'img') {
            const error = {
                type: 'image_load',
                src: target.src,
                alt: target.alt,
                timestamp: new Date().toISOString()
            };
            
            logError(error);
            handleImageError(target, error);
        }
    }, true);
}

/**
 * Setup script loading error handling
 */
function setupScriptErrorHandling() {
    document.addEventListener('error', function(event) {
        const target = event.target;
        
        if (target.tagName && target.tagName.toLowerCase() === 'script') {
            const error = {
                type: 'script_load',
                src: target.src,
                timestamp: new Date().toISOString()
            };
            
            logError(error);
            handleScriptError(target, error);
        }
    }, true);
}

/**
 * Handle JavaScript errors
 */
function handleJavaScriptError(error) {
    // Show user-friendly message for critical errors
    if (error.message.includes('is not defined') || error.message.includes('Cannot read property')) {
        showErrorNotification('Some features may not work properly. Please refresh the page.', 'warning');
    }
    
    // Attempt to recover from common errors
    if (error.message.includes('fetch')) {
        showErrorNotification('Network connection issue. Please check your internet connection.', 'error');
    }
}

/**
 * Handle promise rejections
 */
function handlePromiseRejection(error) {
    // Handle common promise rejection scenarios
    if (error.message.includes('fetch') || error.message.includes('network')) {
        showErrorNotification('Connection error. Some features may be unavailable.', 'warning');
    }
}

/**
 * Handle network errors
 */
function handleNetworkError(error) {
    const retryKey = error.url;
    
    if (!errorState.retryAttempts[retryKey]) {
        errorState.retryAttempts[retryKey] = 0;
    }
    
    if (error.status >= 500) {
        showErrorNotification('Server error. Please try again later.', 'error');
    } else if (error.status === 404) {
        showErrorNotification('Requested resource not found.', 'warning');
    } else if (error.status === 403) {
        showErrorNotification('Access denied to requested resource.', 'error');
    } else if (error.status >= 400) {
        showErrorNotification('Request error. Please check your input and try again.', 'warning');
    }
}

/**
 * Handle form validation errors
 */
function handleFormValidationError(error, field) {
    // Enhance form validation error display
    const errorElement = document.getElementById(`${field.name || field.id}-error`);
    
    if (errorElement) {
        errorElement.textContent = error.validationMessage;
        errorElement.style.display = 'block';
    }
    
    // Add visual indication
    field.classList.add('form__input--error');
    field.setAttribute('aria-invalid', 'true');
    
    // Announce to screen readers
    announceToScreenReader(`Error in ${field.name || field.id}: ${error.validationMessage}`);
}

/**
 * Handle image loading errors
 */
function handleImageError(img, error) {
    // Set fallback image or placeholder
    if (!img.dataset.errorHandled) {
        img.dataset.errorHandled = 'true';
        
        // Try to load a fallback image
        const fallbackSrc = img.dataset.fallback || generatePlaceholderImage(img);
        
        if (fallbackSrc && fallbackSrc !== img.src) {
            img.src = fallbackSrc;
        } else {
            // Create a placeholder
            img.style.backgroundColor = '#f0f0f0';
            img.style.display = 'flex';
            img.style.alignItems = 'center';
            img.style.justifyContent = 'center';
            img.style.color = '#666';
            img.style.fontSize = '14px';
            img.alt = img.alt ? `${img.alt} (Image not available)` : 'Image not available';
        }
    }
}

/**
 * Handle script loading errors
 */
function handleScriptError(script, error) {
    const scriptName = script.src.split('/').pop();
    
    // Show notification for critical scripts
    if (scriptName.includes('main') || scriptName.includes('app')) {
        showErrorNotification('Some features may not work properly due to a loading error.', 'warning');
    }
    
    // Attempt to reload non-critical scripts
    if (!script.dataset.retryAttempt) {
        script.dataset.retryAttempt = '1';
        setTimeout(() => {
            const newScript = document.createElement('script');
            newScript.src = script.src;
            newScript.dataset.retryAttempt = '1';
            document.head.appendChild(newScript);
        }, 2000);
    }
}

/**
 * Generate placeholder image
 */
function generatePlaceholderImage(img) {
    const width = img.width || 300;
    const height = img.height || 200;
    
    return `data:image/svg+xml;base64,${btoa(`
        <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="#ddd"/>
            <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="14" fill="#999" text-anchor="middle" dy=".3em">
                Image not available
            </text>
        </svg>
    `)}`;
}

/**
 * Show error notification to user
 */
function showErrorNotification(message, type = 'info', duration = 5000) {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.error-notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `error-notification error-notification--${type}`;
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'assertive');
    
    notification.innerHTML = `
        <div class="error-notification__content">
            <span class="error-notification__icon" aria-hidden="true">
                ${type === 'error' ? '⚠️' : type === 'warning' ? '⚠️' : 'ℹ️'}
            </span>
            <span class="error-notification__message">${message}</span>
            <button class="error-notification__close" aria-label="Close notification">×</button>
        </div>
    `;
    
    // Add styles
    addNotificationStyles();
    
    // Add to page
    document.body.appendChild(notification);
    
    // Add close functionality
    const closeBtn = notification.querySelector('.error-notification__close');
    closeBtn.addEventListener('click', () => {
        notification.remove();
    });
    
    // Auto-remove after duration
    if (duration > 0) {
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.remove();
            }
        }, duration);
    }
    
    // Announce to screen readers
    announceToScreenReader(message);
}

/**
 * Add notification styles
 */
function addNotificationStyles() {
    if (document.getElementById('error-notification-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'error-notification-styles';
    style.textContent = `
        .error-notification {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            max-width: 400px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            border-left: 4px solid #0066cc;
            animation: slideIn 0.3s ease-out;
        }
        
        .error-notification--error {
            border-left-color: #dc3545;
        }
        
        .error-notification--warning {
            border-left-color: #ffc107;
        }
        
        .error-notification__content {
            display: flex;
            align-items: flex-start;
            gap: 12px;
            padding: 16px;
        }
        
        .error-notification__icon {
            font-size: 18px;
            flex-shrink: 0;
        }
        
        .error-notification__message {
            flex: 1;
            font-size: 14px;
            line-height: 1.4;
            color: #333;
        }
        
        .error-notification__close {
            background: none;
            border: none;
            font-size: 18px;
            cursor: pointer;
            color: #666;
            padding: 0;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
            flex-shrink: 0;
        }
        
        .error-notification__close:hover {
            background: #f0f0f0;
            color: #333;
        }
        
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @media (max-width: 480px) {
            .error-notification {
                left: 20px;
                right: 20px;
                max-width: none;
            }
        }
    `;
    
    document.head.appendChild(style);
}

/**
 * Log error for debugging and analytics
 */
function logError(error) {
    // Add to error log
    errorState.errorLog.unshift(error);
    
    // Keep log size manageable
    if (errorState.errorLog.length > errorState.maxLogEntries) {
        errorState.errorLog = errorState.errorLog.slice(0, errorState.maxLogEntries);
    }
    
    // Log to console in development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.error('Error logged:', error);
    }
    
    // Send to analytics if available
    if (typeof gtag !== 'undefined') {
        gtag('event', 'exception', {
            'description': error.message || error.type,
            'fatal': error.type === 'javascript'
        });
    }
}

/**
 * Track form events
 */
function trackFormEvent(eventName, formInfo) {
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, {
            'form_id': formInfo.id,
            'form_action': formInfo.action
        });
    }
    
    console.log(`Form event: ${eventName}`, formInfo);
}

/**
 * Announce message to screen readers
 */
function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'assertive');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
        if (document.body.contains(announcement)) {
            document.body.removeChild(announcement);
        }
    }, 1000);
}

/**
 * Get error log for debugging
 */
function getErrorLog() {
    return [...errorState.errorLog];
}

/**
 * Clear error log
 */
function clearErrorLog() {
    errorState.errorLog = [];
}

/**
 * Test error handling (for development)
 */
function testErrorHandling() {
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        console.warn('Error testing is only available in development');
        return;
    }
    
    console.log('Testing error handling...');
    
    // Test JavaScript error
    setTimeout(() => {
        try {
            throw new Error('Test JavaScript error');
        } catch (e) {
            // This will be caught by the global error handler
            throw e;
        }
    }, 1000);
    
    // Test network error
    setTimeout(() => {
        fetch('/non-existent-endpoint').catch(() => {
            // This will be handled by the network error handler
        });
    }, 2000);
    
    // Test notification
    setTimeout(() => {
        showErrorNotification('This is a test notification', 'info');
    }, 3000);
}

// Initialize error handling when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initErrorHandling();
});

// Export for external use
window.ErrorHandling = {
    initErrorHandling,
    showErrorNotification,
    logError,
    getErrorLog,
    clearErrorLog,
    testErrorHandling
};