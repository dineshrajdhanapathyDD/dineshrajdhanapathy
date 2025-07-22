/**
 * Accessibility Enhancement Module
 * Provides comprehensive accessibility features for the portfolio website
 */

// Accessibility state management
const accessibilityState = {
    isKeyboardNavigation: false,
    focusedElement: null,
    skipLinksAdded: false,
    ariaLiveRegion: null,
    focusTrap: null
};

/**
 * Initialize all accessibility features
 */
function initAccessibility() {
    // Core accessibility features
    initSkipLinks();
    initFocusManagement();
    initKeyboardNavigation();
    initAriaLiveRegion();
    
    // Enhanced features
    initFocusTrapping();
    initAccessibilityShortcuts();
    initScreenReaderEnhancements();
    initColorContrastHelpers();
    
    // Form accessibility
    enhanceFormAccessibility();
    
    // Navigation accessibility
    enhanceNavigationAccessibility();
    
    // Content accessibility
    enhanceContentAccessibility();
    
    console.log('Accessibility features initialized');
}

/**
 * Initialize skip links for keyboard navigation
 */
function initSkipLinks() {
    if (accessibilityState.skipLinksAdded) return;
    
    const skipLinksContainer = document.createElement('div');
    skipLinksContainer.className = 'skip-links';
    skipLinksContainer.innerHTML = `
        <a href="#main-content" class="skip-link">Skip to main content</a>
        <a href="#navigation" class="skip-link">Skip to navigation</a>
        <a href="#footer" class="skip-link">Skip to footer</a>
    `;
    
    // Insert at the beginning of body
    document.body.insertBefore(skipLinksContainer, document.body.firstChild);
    
    // Ensure target elements have proper IDs
    ensureSkipLinkTargets();
    
    // Add skip link styles
    addSkipLinkStyles();
    
    accessibilityState.skipLinksAdded = true;
}

/**
 * Ensure skip link targets exist
 */
function ensureSkipLinkTargets() {
    const targets = [
        { selector: 'main', id: 'main-content' },
        { selector: 'nav[role="navigation"], .nav', id: 'navigation' },
        { selector: 'footer[role="contentinfo"], .footer', id: 'footer' }
    ];
    
    targets.forEach(({ selector, id }) => {
        const element = document.querySelector(selector);
        if (element && !element.id) {
            element.id = id;
        }
    });
}

/**
 * Add skip link styles
 */
function addSkipLinkStyles() {
    const styles = `
        .skip-links {
            position: absolute;
            top: 0;
            left: 0;
            z-index: 9999;
        }
        
        .skip-link {
            position: absolute;
            top: -40px;
            left: 6px;
            background: #000;
            color: #fff;
            padding: 8px 12px;
            text-decoration: none;
            border-radius: 0 0 4px 4px;
            font-size: 14px;
            font-weight: 600;
            transition: top 0.3s ease;
            z-index: 10000;
        }
        
        .skip-link:focus {
            top: 0;
            outline: 2px solid #fff;
            outline-offset: 2px;
        }
        
        .skip-link:hover {
            background: #333;
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
}

/**
 * Initialize focus management
 */
function initFocusManagement() {
    // Track keyboard vs mouse navigation
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Tab') {
            accessibilityState.isKeyboardNavigation = true;
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('mousedown', function() {
        accessibilityState.isKeyboardNavigation = false;
        document.body.classList.remove('keyboard-navigation');
    });
    
    // Enhanced focus styles for keyboard navigation
    addFocusStyles();
    
    // Focus management for dynamic content
    initDynamicFocusManagement();
}

/**
 * Add enhanced focus styles
 */
function addFocusStyles() {
    const focusStyles = `
        .keyboard-navigation *:focus {
            outline: 2px solid #0066cc;
            outline-offset: 2px;
        }
        
        .keyboard-navigation button:focus,
        .keyboard-navigation input:focus,
        .keyboard-navigation textarea:focus,
        .keyboard-navigation select:focus {
            outline: 2px solid #0066cc;
            outline-offset: 2px;
            box-shadow: 0 0 0 4px rgba(0, 102, 204, 0.2);
        }
        
        .keyboard-navigation a:focus {
            outline: 2px solid #0066cc;
            outline-offset: 2px;
            background-color: rgba(0, 102, 204, 0.1);
        }
        
        /* Hide focus outline for mouse users */
        :not(.keyboard-navigation) *:focus {
            outline: none;
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = focusStyles;
    document.head.appendChild(styleSheet);
}

/**
 * Initialize dynamic focus management
 */
function initDynamicFocusManagement() {
    // Store focus before dynamic content changes
    window.storeFocus = function() {
        accessibilityState.focusedElement = document.activeElement;
    };
    
    // Restore focus after dynamic content changes
    window.restoreFocus = function() {
        if (accessibilityState.focusedElement && 
            document.contains(accessibilityState.focusedElement)) {
            accessibilityState.focusedElement.focus();
        }
    };
    
    // Focus first interactive element in new content
    window.focusFirstInteractive = function(container) {
        const focusableElements = container.querySelectorAll(
            'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length > 0) {
            focusableElements[0].focus();
        }
    };
}

/**
 * Initialize keyboard navigation enhancements
 */
function initKeyboardNavigation() {
    // Global keyboard shortcuts
    document.addEventListener('keydown', function(event) {
        // Escape key handling
        if (event.key === 'Escape') {
            handleEscapeKey();
        }
        
        // Alt + M for main content
        if (event.altKey && event.key === 'm') {
            event.preventDefault();
            const mainContent = document.getElementById('main-content');
            if (mainContent) {
                mainContent.focus();
                mainContent.scrollIntoView({ behavior: 'smooth' });
            }
        }
        
        // Alt + N for navigation
        if (event.altKey && event.key === 'n') {
            event.preventDefault();
            const navigation = document.getElementById('navigation');
            if (navigation) {
                const firstLink = navigation.querySelector('a, button');
                if (firstLink) {
                    firstLink.focus();
                }
            }
        }
        
        // Alt + F for footer
        if (event.altKey && event.key === 'f') {
            event.preventDefault();
            const footer = document.getElementById('footer');
            if (footer) {
                footer.scrollIntoView({ behavior: 'smooth' });
                const firstLink = footer.querySelector('a, button');
                if (firstLink) {
                    firstLink.focus();
                }
            }
        }
    });
    
    // Arrow key navigation for menus
    initArrowKeyNavigation();
}

/**
 * Handle escape key functionality
 */
function handleEscapeKey() {
    // Close mobile menu if open
    const navMenu = document.querySelector('.nav__menu');
    if (navMenu && navMenu.classList.contains('nav__menu--open')) {
        const navToggle = document.querySelector('.nav__toggle');
        if (navToggle) {
            navToggle.click();
            navToggle.focus();
        }
        return;
    }
    
    // Close any open modals or overlays
    const openModals = document.querySelectorAll('.modal--open, .overlay--open');
    if (openModals.length > 0) {
        openModals.forEach(modal => {
            const closeButton = modal.querySelector('.close, [aria-label*="close"]');
            if (closeButton) {
                closeButton.click();
            }
        });
        return;
    }
    
    // Clear search if active
    const searchInput = document.getElementById('project-search');
    if (searchInput && searchInput.value) {
        searchInput.value = '';
        searchInput.dispatchEvent(new Event('input'));
        return;
    }
}

/**
 * Initialize arrow key navigation for menus
 */
function initArrowKeyNavigation() {
    const menus = document.querySelectorAll('[role="menubar"], .nav__menu');
    
    menus.forEach(menu => {
        const menuItems = menu.querySelectorAll('[role="menuitem"], .nav__link');
        
        menu.addEventListener('keydown', function(event) {
            let currentIndex = Array.from(menuItems).indexOf(event.target);
            
            switch (event.key) {
                case 'ArrowDown':
                case 'ArrowRight':
                    event.preventDefault();
                    currentIndex = (currentIndex + 1) % menuItems.length;
                    menuItems[currentIndex].focus();
                    break;
                    
                case 'ArrowUp':
                case 'ArrowLeft':
                    event.preventDefault();
                    currentIndex = currentIndex <= 0 ? menuItems.length - 1 : currentIndex - 1;
                    menuItems[currentIndex].focus();
                    break;
                    
                case 'Home':
                    event.preventDefault();
                    menuItems[0].focus();
                    break;
                    
                case 'End':
                    event.preventDefault();
                    menuItems[menuItems.length - 1].focus();
                    break;
            }
        });
    });
}

/**
 * Initialize ARIA live region for announcements
 */
function initAriaLiveRegion() {
    const liveRegion = document.createElement('div');
    liveRegion.id = 'aria-live-region';
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    
    document.body.appendChild(liveRegion);
    accessibilityState.ariaLiveRegion = liveRegion;
}

/**
 * Announce message to screen readers
 */
function announceToScreenReader(message, priority = 'polite') {
    if (!accessibilityState.ariaLiveRegion) {
        initAriaLiveRegion();
    }
    
    const liveRegion = accessibilityState.ariaLiveRegion;
    liveRegion.setAttribute('aria-live', priority);
    liveRegion.textContent = message;
    
    // Clear after announcement
    setTimeout(() => {
        liveRegion.textContent = '';
    }, 1000);
}

/**
 * Initialize focus trapping for modals and overlays
 */
function initFocusTrapping() {
    window.trapFocus = function(container) {
        const focusableElements = container.querySelectorAll(
            'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length === 0) return;
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        function handleTabKey(event) {
            if (event.key !== 'Tab') return;
            
            if (event.shiftKey) {
                if (document.activeElement === firstElement) {
                    event.preventDefault();
                    lastElement.focus();
                }
            } else {
                if (document.activeElement === lastElement) {
                    event.preventDefault();
                    firstElement.focus();
                }
            }
        }
        
        container.addEventListener('keydown', handleTabKey);
        firstElement.focus();
        
        accessibilityState.focusTrap = {
            container,
            handleTabKey,
            release: function() {
                container.removeEventListener('keydown', handleTabKey);
            }
        };
    };
    
    window.releaseFocusTrap = function() {
        if (accessibilityState.focusTrap) {
            accessibilityState.focusTrap.release();
            accessibilityState.focusTrap = null;
        }
    };
}

/**
 * Initialize accessibility shortcuts
 */
function initAccessibilityShortcuts() {
    // Create shortcuts help panel
    const shortcutsPanel = document.createElement('div');
    shortcutsPanel.id = 'accessibility-shortcuts';
    shortcutsPanel.className = 'accessibility-shortcuts';
    shortcutsPanel.innerHTML = `
        <button class="shortcuts-toggle" aria-label="Show accessibility shortcuts" aria-expanded="false">
            <span class="shortcuts-icon" aria-hidden="true">♿</span>
        </button>
        <div class="shortcuts-panel" hidden>
            <h3>Accessibility Shortcuts</h3>
            <ul>
                <li><kbd>Alt + M</kbd> - Jump to main content</li>
                <li><kbd>Alt + N</kbd> - Jump to navigation</li>
                <li><kbd>Alt + F</kbd> - Jump to footer</li>
                <li><kbd>Escape</kbd> - Close menus/modals</li>
                <li><kbd>Tab</kbd> - Navigate forward</li>
                <li><kbd>Shift + Tab</kbd> - Navigate backward</li>
                <li><kbd>Arrow Keys</kbd> - Navigate menus</li>
            </ul>
            <button class="shortcuts-close" aria-label="Close shortcuts panel">×</button>
        </div>
    `;
    
    document.body.appendChild(shortcutsPanel);
    
    // Add shortcuts panel functionality
    const toggle = shortcutsPanel.querySelector('.shortcuts-toggle');
    const panel = shortcutsPanel.querySelector('.shortcuts-panel');
    const closeBtn = shortcutsPanel.querySelector('.shortcuts-close');
    
    function togglePanel() {
        const isHidden = panel.hidden;
        panel.hidden = !isHidden;
        toggle.setAttribute('aria-expanded', isHidden.toString());
        
        if (!isHidden) {
            // Panel is being closed
            toggle.focus();
        } else {
            // Panel is being opened
            trapFocus(panel);
        }
    }
    
    toggle.addEventListener('click', togglePanel);
    closeBtn.addEventListener('click', togglePanel);
    
    // Close on escape
    panel.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            togglePanel();
        }
    });
    
    // Add styles for shortcuts panel
    addShortcutsPanelStyles();
}

/**
 * Add styles for accessibility shortcuts panel
 */
function addShortcutsPanelStyles() {
    const styles = `
        .accessibility-shortcuts {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9998;
        }
        
        .shortcuts-toggle {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: #0066cc;
            color: white;
            border: none;
            font-size: 20px;
            cursor: pointer;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            transition: all 0.3s ease;
        }
        
        .shortcuts-toggle:hover,
        .shortcuts-toggle:focus {
            background: #0052a3;
            transform: scale(1.1);
        }
        
        .shortcuts-panel {
            position: absolute;
            bottom: 60px;
            right: 0;
            width: 300px;
            background: white;
            border: 1px solid #ccc;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        }
        
        .shortcuts-panel h3 {
            margin: 0 0 15px 0;
            font-size: 16px;
            color: #333;
        }
        
        .shortcuts-panel ul {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        
        .shortcuts-panel li {
            margin-bottom: 8px;
            font-size: 14px;
            color: #666;
        }
        
        .shortcuts-panel kbd {
            background: #f5f5f5;
            border: 1px solid #ccc;
            border-radius: 3px;
            padding: 2px 6px;
            font-size: 12px;
            font-family: monospace;
        }
        
        .shortcuts-close {
            position: absolute;
            top: 10px;
            right: 10px;
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
            color: #666;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .shortcuts-close:hover,
        .shortcuts-close:focus {
            color: #333;
            background: #f0f0f0;
            border-radius: 50%;
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
}

/**
 * Initialize screen reader enhancements
 */
function initScreenReaderEnhancements() {
    // Add screen reader only content
    addScreenReaderContent();
    
    // Enhance images with better alt text
    enhanceImageAccessibility();
    
    // Add landmark roles where missing
    addLandmarkRoles();
    
    // Enhance headings structure
    enhanceHeadingStructure();
}

/**
 * Add screen reader only content
 */
function addScreenReaderContent() {
    // Add sr-only class styles
    const srOnlyStyles = `
        .sr-only {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border: 0;
        }
        
        .sr-only-focusable:focus {
            position: static;
            width: auto;
            height: auto;
            padding: inherit;
            margin: inherit;
            overflow: visible;
            clip: auto;
            white-space: normal;
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = srOnlyStyles;
    document.head.appendChild(styleSheet);
    
    // Add helpful screen reader content
    const pageDescription = document.createElement('div');
    pageDescription.className = 'sr-only';
    pageDescription.textContent = 'Portfolio website of Alex Johnson, Full Stack Developer. Navigate using tab key or use skip links to jump to main sections.';
    document.body.insertBefore(pageDescription, document.body.firstChild);
}

/**
 * Enhance image accessibility
 */
function enhanceImageAccessibility() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        // Check for missing alt text
        if (!img.hasAttribute('alt')) {
            console.warn('Image missing alt text:', img.src);
            img.alt = 'Image'; // Fallback alt text
        }
        
        // Check for decorative images
        if (img.alt === '' && !img.hasAttribute('role')) {
            img.setAttribute('role', 'presentation');
        }
        
        // Add loading error handling
        img.addEventListener('error', function() {
            this.alt = 'Image failed to load: ' + (this.alt || 'Untitled image');
        });
    });
}

/**
 * Add landmark roles where missing
 */
function addLandmarkRoles() {
    const landmarks = [
        { selector: 'header', role: 'banner' },
        { selector: 'nav', role: 'navigation' },
        { selector: 'main', role: 'main' },
        { selector: 'aside', role: 'complementary' },
        { selector: 'footer', role: 'contentinfo' }
    ];
    
    landmarks.forEach(({ selector, role }) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            if (!element.hasAttribute('role')) {
                element.setAttribute('role', role);
            }
        });
    });
}

/**
 * Enhance heading structure
 */
function enhanceHeadingStructure() {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let previousLevel = 0;
    
    headings.forEach(heading => {
        const currentLevel = parseInt(heading.tagName.charAt(1));
        
        // Check for heading level jumps
        if (currentLevel > previousLevel + 1) {
            console.warn('Heading level jump detected:', heading.textContent, 'Level:', currentLevel);
        }
        
        // Add IDs for anchor links if missing
        if (!heading.id && heading.textContent) {
            heading.id = heading.textContent
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-|-$/g, '');
        }
        
        previousLevel = currentLevel;
    });
}

/**
 * Initialize color contrast helpers
 */
function initColorContrastHelpers() {
    // Add high contrast mode toggle
    addHighContrastToggle();
    
    // Check for color contrast issues
    checkColorContrast();
}

/**
 * Add high contrast mode toggle
 */
function addHighContrastToggle() {
    const toggle = document.createElement('button');
    toggle.id = 'high-contrast-toggle';
    toggle.className = 'high-contrast-toggle';
    toggle.innerHTML = `
        <span class="toggle-icon" aria-hidden="true">🎨</span>
        <span class="toggle-text">High Contrast</span>
    `;
    toggle.setAttribute('aria-label', 'Toggle high contrast mode');
    toggle.setAttribute('aria-pressed', 'false');
    
    // Add to accessibility shortcuts area
    const shortcutsPanel = document.querySelector('.accessibility-shortcuts');
    if (shortcutsPanel) {
        shortcutsPanel.appendChild(toggle);
    }
    
    // Toggle functionality
    toggle.addEventListener('click', function() {
        const isHighContrast = document.body.classList.toggle('high-contrast');
        toggle.setAttribute('aria-pressed', isHighContrast.toString());
        
        // Save preference
        try {
            localStorage.setItem('highContrast', isHighContrast.toString());
        } catch (e) {
            console.warn('Could not save high contrast preference');
        }
        
        announceToScreenReader(`High contrast mode ${isHighContrast ? 'enabled' : 'disabled'}`);
    });
    
    // Load saved preference
    try {
        const savedPreference = localStorage.getItem('highContrast');
        if (savedPreference === 'true') {
            toggle.click();
        }
    } catch (e) {
        console.warn('Could not load high contrast preference');
    }
    
    // Add high contrast styles
    addHighContrastStyles();
}

/**
 * Add high contrast styles
 */
function addHighContrastStyles() {
    const styles = `
        .high-contrast-toggle {
            position: fixed;
            bottom: 80px;
            right: 20px;
            background: #333;
            color: white;
            border: 2px solid #666;
            border-radius: 4px;
            padding: 8px 12px;
            font-size: 12px;
            cursor: pointer;
            z-index: 9997;
        }
        
        .high-contrast-toggle:hover,
        .high-contrast-toggle:focus {
            background: #555;
            border-color: #888;
        }
        
        .high-contrast {
            filter: contrast(150%) brightness(110%);
        }
        
        .high-contrast * {
            text-shadow: none !important;
            box-shadow: none !important;
        }
        
        .high-contrast a {
            text-decoration: underline !important;
        }
        
        .high-contrast button,
        .high-contrast input,
        .high-contrast textarea {
            border: 2px solid #000 !important;
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
}

/**
 * Check for color contrast issues
 */
function checkColorContrast() {
    // This is a simplified contrast checker
    // In a real implementation, you'd use a more sophisticated algorithm
    const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, a, button, span');
    
    textElements.forEach(element => {
        const styles = window.getComputedStyle(element);
        const color = styles.color;
        const backgroundColor = styles.backgroundColor;
        
        // Log potential contrast issues for development
        if (color === backgroundColor) {
            console.warn('Potential contrast issue:', element.textContent?.substring(0, 50));
        }
    });
}

/**
 * Enhance form accessibility
 */
function enhanceFormAccessibility() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        // Add form description
        if (!form.getAttribute('aria-describedby')) {
            const description = document.createElement('div');
            description.id = `${form.id || 'form'}-description`;
            description.className = 'sr-only';
            description.textContent = 'Form with real-time validation. Required fields are marked with an asterisk.';
            form.insertBefore(description, form.firstChild);
            form.setAttribute('aria-describedby', description.id);
        }
        
        // Enhance form fields
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            // Ensure labels are properly associated
            const label = form.querySelector(`label[for="${input.id}"]`);
            if (!label && input.id) {
                console.warn('Input missing associated label:', input.id);
            }
            
            // Add required indicators
            if (input.hasAttribute('required')) {
                const label = form.querySelector(`label[for="${input.id}"]`);
                if (label && !label.querySelector('.required-indicator')) {
                    const indicator = document.createElement('span');
                    indicator.className = 'required-indicator';
                    indicator.setAttribute('aria-label', 'required');
                    indicator.textContent = ' *';
                    label.appendChild(indicator);
                }
            }
            
            // Add error announcement
            input.addEventListener('invalid', function() {
                announceToScreenReader(`Error in ${input.name || input.id}: ${input.validationMessage}`, 'assertive');
            });
        });
    });
}

/**
 * Enhance navigation accessibility
 */
function enhanceNavigationAccessibility() {
    const navs = document.querySelectorAll('nav');
    
    navs.forEach(nav => {
        // Add aria-label if missing
        if (!nav.getAttribute('aria-label') && !nav.getAttribute('aria-labelledby')) {
            nav.setAttribute('aria-label', 'Main navigation');
        }
        
        // Enhance menu items
        const menuItems = nav.querySelectorAll('a, button');
        menuItems.forEach((item, index) => {
            // Add role if in a menu structure
            const parentList = item.closest('ul');
            if (parentList) {
                if (!parentList.getAttribute('role')) {
                    parentList.setAttribute('role', 'menubar');
                }
                if (!item.closest('li').getAttribute('role')) {
                    item.closest('li').setAttribute('role', 'none');
                }
                if (!item.getAttribute('role')) {
                    item.setAttribute('role', 'menuitem');
                }
            }
        });
    });
}

/**
 * Enhance content accessibility
 */
function enhanceContentAccessibility() {
    // Add reading landmarks
    addReadingLandmarks();
    
    // Enhance lists
    enhanceListAccessibility();
    
    // Add table accessibility
    enhanceTableAccessibility();
}

/**
 * Add reading landmarks
 */
function addReadingLandmarks() {
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        // Add aria-labelledby if section has a heading
        const heading = section.querySelector('h1, h2, h3, h4, h5, h6');
        if (heading && heading.id && !section.getAttribute('aria-labelledby')) {
            section.setAttribute('aria-labelledby', heading.id);
        }
    });
}

/**
 * Enhance list accessibility
 */
function enhanceListAccessibility() {
    const lists = document.querySelectorAll('ul, ol');
    
    lists.forEach(list => {
        const items = list.querySelectorAll('li');
        
        // Add list information for screen readers
        if (items.length > 0 && !list.getAttribute('aria-label')) {
            const listType = list.tagName.toLowerCase() === 'ol' ? 'ordered' : 'unordered';
            list.setAttribute('aria-label', `${listType} list with ${items.length} items`);
        }
    });
}

/**
 * Enhance table accessibility
 */
function enhanceTableAccessibility() {
    const tables = document.querySelectorAll('table');
    
    tables.forEach(table => {
        // Add table caption if missing
        if (!table.querySelector('caption')) {
            const caption = document.createElement('caption');
            caption.className = 'sr-only';
            caption.textContent = 'Data table';
            table.insertBefore(caption, table.firstChild);
        }
        
        // Ensure headers are properly marked
        const headerCells = table.querySelectorAll('th');
        headerCells.forEach(th => {
            if (!th.getAttribute('scope')) {
                // Determine scope based on position
                const row = th.closest('tr');
                const isFirstRow = row === table.querySelector('tr');
                th.setAttribute('scope', isFirstRow ? 'col' : 'row');
            }
        });
    });
}

// Initialize accessibility when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initAccessibility();
});

// Export functions for external use
window.AccessibilityModule = {
    initAccessibility,
    announceToScreenReader,
    trapFocus,
    releaseFocusTrap,
    storeFocus: () => window.storeFocus(),
    restoreFocus: () => window.restoreFocus(),
    focusFirstInteractive: (container) => window.focusFirstInteractive(container)
};