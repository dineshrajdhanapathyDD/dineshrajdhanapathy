/**
 * Cloud Certification Roadmap - Accessibility Enhancements
 * 
 * This module provides enhanced accessibility features including better screen reader
 * announcements, live regions, and improved keyboard navigation.
 */

window.CertificationRoadmap = window.CertificationRoadmap || {};
window.CertificationRoadmap.AccessibilityEnhancements = (function() {
    // Private variables
    let liveRegion = null;
    let statusRegion = null;
    let progressRegion = null;
    let initialized = false;
    
    // Private functions
    function createLiveRegions() {
        // Create main live region for general announcements
        liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-live-region';
        liveRegion.id = 'main-live-region';
        document.body.appendChild(liveRegion);
        
        // Create status region for status updates
        statusRegion = document.createElement('div');
        statusRegion.setAttribute('aria-live', 'assertive');
        statusRegion.setAttribute('aria-atomic', 'true');
        statusRegion.className = 'sr-live-region';
        statusRegion.id = 'status-live-region';
        document.body.appendChild(statusRegion);
        
        // Create progress region for progress updates
        progressRegion = document.createElement('div');
        progressRegion.setAttribute('aria-live', 'polite');
        progressRegion.setAttribute('aria-atomic', 'false');
        progressRegion.className = 'sr-live-region';
        progressRegion.id = 'progress-live-region';
        document.body.appendChild(progressRegion);
    }
    
    function enhanceFormAccessibility() {
        // Add better form validation announcements
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', function(e) {
                const invalidFields = form.querySelectorAll(':invalid');
                if (invalidFields.length > 0) {
                    announceStatus(`Form has ${invalidFields.length} error${invalidFields.length > 1 ? 's' : ''}. Please review and correct the highlighted fields.`);
                }
            });
        });
        
        // Enhance input field announcements
        const inputs = document.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            // Add descriptive labels if missing
            if (!input.getAttribute('aria-label') && !input.getAttribute('aria-labelledby')) {
                const label = document.querySelector(`label[for="${input.id}"]`) || input.closest('label');
                if (label && !input.getAttribute('aria-labelledby')) {
                    const labelId = `label-${input.id || Math.random().toString(36).substr(2, 9)}`;
                    label.id = labelId;
                    input.setAttribute('aria-labelledby', labelId);
                }
            }
            
            // Add validation announcements
            input.addEventListener('invalid', function() {
                const message = this.validationMessage || 'This field is required or has an invalid value.';
                announceStatus(`Error in ${this.name || 'form field'}: ${message}`);
            });
            
            input.addEventListener('input', function() {
                if (this.checkValidity() && this.classList.contains('form-field-error')) {
                    this.classList.remove('form-field-error');
                    announce(`${this.name || 'Field'} is now valid.`);
                }
            });
        });
    }
    
    function enhanceButtonAccessibility() {
        // Add better button state announcements
        const buttons = document.querySelectorAll('button, [role="button"]');
        buttons.forEach(button => {
            // Add click announcements for buttons without clear text
            button.addEventListener('click', function() {
                const buttonText = this.textContent.trim() || this.getAttribute('aria-label') || 'Button';
                const isPressed = this.getAttribute('aria-pressed') === 'true';
                const isExpanded = this.getAttribute('aria-expanded') === 'true';
                
                if (this.getAttribute('aria-pressed')) {
                    announce(`${buttonText} ${isPressed ? 'activated' : 'deactivated'}.`);
                } else if (this.getAttribute('aria-expanded')) {
                    announce(`${buttonText} ${isExpanded ? 'expanded' : 'collapsed'}.`);
                } else if (buttonText.toLowerCase().includes('filter')) {
                    // Special handling for filter buttons
                    setTimeout(() => {
                        const resultCount = document.querySelectorAll('.filtered-result, .resource-card:not([style*="display: none"]), .certification-node:not([style*="display: none"])').length;
                        announce(`Filter applied. ${resultCount} items shown.`);
                    }, 100);
                }
            });
        });
    }
    
    function enhanceNavigationAccessibility() {
        // Add step navigation announcements
        const workflowSteps = document.querySelectorAll('.certification-roadmap-workflow__step');
        workflowSteps.forEach((step, index) => {
            step.addEventListener('click', function() {
                const stepName = this.querySelector('.certification-roadmap-workflow__step-title')?.textContent || `Step ${index + 1}`;
                announce(`Navigated to ${stepName}. Step ${index + 1} of ${workflowSteps.length}.`);
            });
        });
        
        // Add tab navigation announcements
        const tabs = document.querySelectorAll('[role="tab"]');
        tabs.forEach((tab, index) => {
            tab.addEventListener('click', function() {
                const tabName = this.textContent.trim();
                const tabList = this.closest('[role="tablist"]');
                const totalTabs = tabList ? tabList.querySelectorAll('[role="tab"]').length : tabs.length;
                announce(`${tabName} tab selected. Tab ${index + 1} of ${totalTabs}.`);
            });
        });
    }
    
    function enhanceProgressAnnouncements() {
        // Monitor progress bars and announce changes
        const progressBars = document.querySelectorAll('[role="progressbar"], .progress-bar, .certification-roadmap__progress-bar');
        
        const progressObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && (mutation.attributeName === 'aria-valuenow' || mutation.attributeName === 'style')) {
                    const target = mutation.target;
                    const value = target.getAttribute('aria-valuenow') || extractProgressFromStyle(target);
                    const max = target.getAttribute('aria-valuemax') || '100';
                    const label = target.getAttribute('aria-label') || 'Progress';
                    
                    if (value !== null) {
                        announceProgress(`${label}: ${value} of ${max} complete.`);
                    }
                }
            });
        });
        
        progressBars.forEach(bar => {
            progressObserver.observe(bar, { attributes: true });
        });
    }
    
    function extractProgressFromStyle(element) {
        const style = element.style.width || element.style.transform;
        if (style) {
            const match = style.match(/(\d+(?:\.\d+)?)%/);
            return match ? Math.round(parseFloat(match[1])) : null;
        }
        return null;
    }
    
    function enhanceLoadingStates() {
        // Monitor loading states and announce them
        const loadingObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.classList && (node.classList.contains('loading') || node.classList.contains('spinner'))) {
                            announceStatus('Loading content, please wait.');
                        }
                    }
                });
                
                mutation.removedNodes.forEach(function(node) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.classList && (node.classList.contains('loading') || node.classList.contains('spinner'))) {
                            announce('Content loaded.');
                        }
                    }
                });
            });
        });
        
        loadingObserver.observe(document.body, { childList: true, subtree: true });
    }
    
    function enhanceErrorHandling() {
        // Add better error announcements
        window.addEventListener('error', function(e) {
            announceStatus('An error occurred. Please try again or contact support if the problem persists.');
        });
        
        // Monitor for error messages in the DOM
        const errorObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.classList && (node.classList.contains('error') || node.classList.contains('alert-danger'))) {
                            const errorText = node.textContent.trim();
                            if (errorText) {
                                announceStatus(`Error: ${errorText}`);
                            }
                        }
                    }
                });
            });
        });
        
        errorObserver.observe(document.body, { childList: true, subtree: true });
    }
    
    function enhanceKeyboardNavigation() {
        // Add keyboard shortcut support
        document.addEventListener('keydown', function(e) {
            // Alt + 1-6 for quick navigation to steps
            if (e.altKey && e.key >= '1' && e.key <= '6') {
                e.preventDefault();
                const stepIndex = parseInt(e.key) - 1;
                const steps = document.querySelectorAll('.certification-roadmap-workflow__step');
                if (steps[stepIndex]) {
                    steps[stepIndex].click();
                    steps[stepIndex].focus();
                }
            }
            
            // Ctrl + / for help
            if (e.ctrlKey && e.key === '/') {
                e.preventDefault();
                announceKeyboardShortcuts();
            }
            
            // Escape to close modals/dialogs
            if (e.key === 'Escape') {
                const openModal = document.querySelector('.modal[aria-hidden="false"], .dialog[aria-hidden="false"]');
                if (openModal) {
                    const closeButton = openModal.querySelector('.close, [aria-label*="close"], [aria-label*="Close"]');
                    if (closeButton) {
                        closeButton.click();
                    }
                }
            }
        });
        
        // Improve focus management
        let lastFocusedElement = null;
        
        document.addEventListener('focusin', function(e) {
            lastFocusedElement = e.target;
        });
        
        // Restore focus when modals close
        const modalObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'aria-hidden') {
                    const target = mutation.target;
                    if (target.getAttribute('aria-hidden') === 'true' && lastFocusedElement) {
                        // Modal closed, restore focus
                        setTimeout(() => {
                            if (lastFocusedElement && document.contains(lastFocusedElement)) {
                                lastFocusedElement.focus();
                            }
                        }, 100);
                    }
                }
            });
        });
        
        const modals = document.querySelectorAll('.modal, .dialog');
        modals.forEach(modal => {
            modalObserver.observe(modal, { attributes: true });
        });
    }
    
    function announceKeyboardShortcuts() {
        const shortcuts = [
            'Alt + 1 through 6: Navigate to workflow steps',
            'Ctrl + /: Show keyboard shortcuts',
            'Escape: Close dialogs and modals',
            'Tab: Navigate forward through interactive elements',
            'Shift + Tab: Navigate backward through interactive elements',
            'Enter or Space: Activate buttons and links',
            'Arrow keys: Navigate within lists and menus'
        ];
        
        announce(`Keyboard shortcuts available: ${shortcuts.join('. ')}`);
    }
    
    // Public API functions
    function announce(message, priority = 'polite') {
        if (!liveRegion || !message) return;
        
        const region = priority === 'assertive' ? statusRegion : liveRegion;
        
        // Clear previous message
        region.textContent = '';
        
        // Add new message after a brief delay to ensure screen readers pick it up
        setTimeout(() => {
            region.textContent = message;
        }, 100);
        
        // Clear message after 5 seconds to prevent clutter
        setTimeout(() => {
            if (region.textContent === message) {
                region.textContent = '';
            }
        }, 5000);
    }
    
    function announceStatus(message) {
        announce(message, 'assertive');
    }
    
    function announceProgress(message) {
        if (!progressRegion || !message) return;
        
        progressRegion.textContent = message;
        
        // Clear progress message after 3 seconds
        setTimeout(() => {
            if (progressRegion.textContent === message) {
                progressRegion.textContent = '';
            }
        }, 3000);
    }
    
    function init() {
        if (initialized) return;
        
        try {
            createLiveRegions();
            enhanceFormAccessibility();
            enhanceButtonAccessibility();
            enhanceNavigationAccessibility();
            enhanceProgressAnnouncements();
            enhanceLoadingStates();
            enhanceErrorHandling();
            enhanceKeyboardNavigation();
            
            initialized = true;
            console.log('Accessibility enhancements initialized');
            
            // Announce that accessibility features are ready
            setTimeout(() => {
                announce('Accessibility enhancements loaded. Press Ctrl + / for keyboard shortcuts.');
            }, 1000);
            
        } catch (error) {
            console.error('Error initializing accessibility enhancements:', error);
        }
    }
    
    // Public API
    return {
        init: init,
        announce: announce,
        announceStatus: announceStatus,
        announceProgress: announceProgress,
        isInitialized: function() { return initialized; }
    };
})();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    window.CertificationRoadmap.AccessibilityEnhancements.init();
});

// Also initialize if DOM is already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        window.CertificationRoadmap.AccessibilityEnhancements.init();
    });
} else {
    window.CertificationRoadmap.AccessibilityEnhancements.init();
}