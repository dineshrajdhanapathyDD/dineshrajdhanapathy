/**
 * Cloud Certification Roadmap - Keyboard Focus
 * 
 * This module handles keyboard focus detection and indicators, as well as keyboard navigation.
 */

// Keyboard Focus Module using revealing module pattern
window.CertificationRoadmap = window.CertificationRoadmap || {};
window.CertificationRoadmap.KeyboardFocus = (function() {
    // Private variables
    let usingKeyboard = false;
    let focusIndicator = null;
    let focusableElements = [];
    let containerSelector = '';
    let elementSelector = '';
    
    // Private functions
    function createFocusIndicator() {
        // Create focus indicator element
        focusIndicator = document.createElement('div');
        focusIndicator.className = 'keyboard-focus-indicator';
        focusIndicator.textContent = 'Keyboard navigation active. Press Tab to navigate, Enter or Space to select.';
        document.body.appendChild(focusIndicator);
    }
    
    function showFocusIndicator() {
        if (!focusIndicator) {
            createFocusIndicator();
        }
        
        focusIndicator.classList.add('visible');
        
        // Hide after 3 seconds
        setTimeout(() => {
            focusIndicator.classList.remove('visible');
        }, 3000);
    }
    
    function handleKeyDown(event) {
        // Check if Tab key was pressed
        if (event.key === 'Tab') {
            usingKeyboard = true;
            showFocusIndicator();
            document.body.classList.add('keyboard-focus');
        }
    }
    
    function handleMouseDown() {
        usingKeyboard = false;
        document.body.classList.remove('keyboard-focus');
    }
    
    function handleKeyboardNavigation(event) {
        // Only handle keyboard navigation if we're using keyboard
        if (!usingKeyboard) return;
        
        // Get all focusable elements in the container
        const container = event.currentTarget.closest(containerSelector);
        if (!container) return;
        
        const elements = Array.from(container.querySelectorAll(elementSelector));
        if (!elements.length) return;
        
        // Get current element index
        const currentIndex = elements.indexOf(event.target);
        if (currentIndex === -1) return;
        
        let nextIndex = currentIndex;
        
        // Handle arrow keys
        switch (event.key) {
            case 'ArrowRight':
            case 'ArrowDown':
                nextIndex = (currentIndex + 1) % elements.length;
                event.preventDefault();
                break;
            case 'ArrowLeft':
            case 'ArrowUp':
                nextIndex = (currentIndex - 1 + elements.length) % elements.length;
                event.preventDefault();
                break;
            case 'Home':
                nextIndex = 0;
                event.preventDefault();
                break;
            case 'End':
                nextIndex = elements.length - 1;
                event.preventDefault();
                break;
            default:
                return; // Don't handle other keys
        }
        
        // Focus next element
        if (nextIndex !== currentIndex) {
            elements[nextIndex].focus();
        }
    }
    
    function handleFocusIn(event) {
        if (usingKeyboard) {
            event.target.classList.add('focus-visible');
        }
    }
    
    function handleFocusOut(event) {
        event.target.classList.remove('focus-visible');
    }
    
    // Initialize keyboard focus detection
    function init() {
        // Add event listeners
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('mousedown', handleMouseDown);
        
        // Create focus indicator
        createFocusIndicator();
    }
    
    // Initialize keyboard navigation for specific elements
    function initKeyboardFocus(containerSel, elementSel) {
        containerSelector = containerSel;
        elementSelector = elementSel;
        
        // Find all containers
        const containers = document.querySelectorAll(containerSelector);
        if (!containers.length) return;
        
        // For each container, find all elements and add keyboard navigation
        containers.forEach(container => {
            const elements = container.querySelectorAll(elementSelector);
            if (!elements.length) return;
            
            // Add tabindex to elements if they don't have one
            elements.forEach(element => {
                if (!element.hasAttribute('tabindex')) {
                    element.setAttribute('tabindex', '0');
                }
                
                // Add event listeners for keyboard navigation
                element.addEventListener('keydown', handleKeyboardNavigation);
                element.addEventListener('focus', handleFocusIn);
                element.addEventListener('blur', handleFocusOut);
            });
            
            // Store elements for later use
            focusableElements.push(...elements);
        });
    }
    
    // Public API
    return {
        /**
         * Initialize keyboard focus detection
         */
        init: init,
        
        /**
         * Initialize keyboard focus navigation for specific elements
         * @param {String} containerSelector - CSS selector for the container element
         * @param {String} elementSelector - CSS selector for the focusable elements
         */
        initKeyboardFocus: initKeyboardFocus,
        
        /**
         * Check if user is using keyboard navigation
         * @returns {Boolean} True if user is using keyboard navigation
         */
        isUsingKeyboard: function() {
            return usingKeyboard;
        }
    };
})();

// Initialize keyboard focus detection
document.addEventListener('DOMContentLoaded', function() {
    window.CertificationRoadmap.KeyboardFocus.init();
    
    // Initialize keyboard navigation for workflow steps
    window.CertificationRoadmap.KeyboardFocus.initKeyboardFocus(
        '.certification-roadmap-workflow',
        '.certification-roadmap-workflow__step'
    );
    
    // Initialize keyboard navigation for certification details tabs
    window.CertificationRoadmap.KeyboardFocus.initKeyboardFocus(
        '.certification-details__tabs',
        '.certification-details__tab'
    );
    
    // Initialize keyboard navigation for resource filters
    window.CertificationRoadmap.KeyboardFocus.initKeyboardFocus(
        '.resources-filters',
        '.resource-filter'
    );
    
    // Initialize keyboard navigation for resource cards
    window.CertificationRoadmap.KeyboardFocus.initKeyboardFocus(
        '.resources-grid',
        '.resource-card'
    );
    
    // Initialize keyboard navigation for roadmap filters
    window.CertificationRoadmap.KeyboardFocus.initKeyboardFocus(
        '.roadmap-filters',
        '.roadmap-filter, .roadmap-control-button'
    );
    
    // Initialize keyboard navigation for roadmap zoom controls
    window.CertificationRoadmap.KeyboardFocus.initKeyboardFocus(
        '.roadmap-zoom-controls',
        '.roadmap-zoom-button'
    );
});