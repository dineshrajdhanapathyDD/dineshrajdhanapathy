/**
 * 404 Error Page Functionality
 * Handles search suggestions, navigation, and user experience enhancements
 */

// Site content for search functionality
const siteContent = [
    {
        title: "Home",
        url: "index.html",
        description: "Learn about my background, skills, and experience as a full stack developer",
        keywords: ["about", "bio", "developer", "skills", "experience", "background"]
    },
    {
        title: "Projects",
        url: "projects.html", 
        description: "Browse my portfolio of web development projects and case studies",
        keywords: ["portfolio", "projects", "work", "examples", "code", "development", "react", "node", "javascript"]
    },
    {
        title: "Contact",
        url: "contact.html",
        description: "Get in touch for opportunities, collaborations, or questions",
        keywords: ["contact", "email", "hire", "work", "collaboration", "opportunities", "reach out"]
    },
    {
        title: "E-Commerce Platform",
        url: "projects.html#ecommerce-platform",
        description: "Full-featured online shopping platform with React and Node.js",
        keywords: ["ecommerce", "shopping", "react", "nodejs", "mongodb", "stripe", "platform"]
    },
    {
        title: "Task Management App", 
        url: "projects.html#task-management",
        description: "Collaborative task management with Vue.js and Firebase",
        keywords: ["task", "management", "vue", "firebase", "collaboration", "productivity"]
    },
    {
        title: "Data Visualization Dashboard",
        url: "projects.html#data-visualization", 
        description: "Interactive business intelligence dashboard with D3.js",
        keywords: ["data", "visualization", "dashboard", "d3", "charts", "analytics", "business intelligence"]
    },
    {
        title: "Skills & Technologies",
        url: "index.html#skills",
        description: "Technical skills including JavaScript, React, Node.js, and more",
        keywords: ["skills", "technologies", "javascript", "react", "nodejs", "python", "css", "html"]
    }
];

/**
 * Initialize 404 page functionality
 */
function init404Page() {
    initSearchFunctionality();
    initGoBackButton();
    initKeyboardShortcuts();
    trackPageError();
    
    console.log('404 page functionality initialized');
}

/**
 * Initialize search functionality
 */
function initSearchFunctionality() {
    const searchInput = document.getElementById('error-search');
    const searchBtn = document.getElementById('search-btn');
    const searchResults = document.getElementById('search-results');
    
    if (!searchInput || !searchBtn || !searchResults) return;
    
    let searchTimeout;
    
    // Search on input with debouncing
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            performSearch(this.value.trim());
        }, 300);
    });
    
    // Search on button click
    searchBtn.addEventListener('click', function() {
        performSearch(searchInput.value.trim());
    });
    
    // Search on Enter key
    searchInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            performSearch(this.value.trim());
        }
    });
}

/**
 * Perform search and display results
 */
function performSearch(query) {
    const searchResults = document.getElementById('search-results');
    
    if (!query || query.length < 2) {
        searchResults.style.display = 'none';
        return;
    }
    
    const results = searchSiteContent(query);
    displaySearchResults(results, query);
}

/**
 * Search through site content
 */
function searchSiteContent(query) {
    const queryLower = query.toLowerCase();
    const results = [];
    
    siteContent.forEach(item => {
        let score = 0;
        
        // Check title match
        if (item.title.toLowerCase().includes(queryLower)) {
            score += 10;
        }
        
        // Check description match
        if (item.description.toLowerCase().includes(queryLower)) {
            score += 5;
        }
        
        // Check keywords match
        const keywordMatches = item.keywords.filter(keyword => 
            keyword.toLowerCase().includes(queryLower) || 
            queryLower.includes(keyword.toLowerCase())
        );
        score += keywordMatches.length * 3;
        
        if (score > 0) {
            results.push({
                ...item,
                score: score,
                matchedKeywords: keywordMatches
            });
        }
    });
    
    // Sort by relevance score
    return results.sort((a, b) => b.score - a.score).slice(0, 5);
}

/**
 * Display search results
 */
function displaySearchResults(results, query) {
    const searchResults = document.getElementById('search-results');
    
    if (results.length === 0) {
        searchResults.innerHTML = `
            <div class="search-results__empty">
                <p>No results found for "${query}"</p>
                <p>Try searching for: projects, skills, contact, or specific technologies</p>
            </div>
        `;
        searchResults.style.display = 'block';
        return;
    }
    
    const resultsHTML = results.map(result => `
        <div class="search-results__item">
            <a href="${result.url}" class="search-results__link">
                <h4 class="search-results__title">${highlightMatch(result.title, query)}</h4>
                <p class="search-results__description">${highlightMatch(result.description, query)}</p>
                ${result.matchedKeywords.length > 0 ? 
                    `<div class="search-results__keywords">
                        ${result.matchedKeywords.map(keyword => 
                            `<span class="search-results__keyword">${keyword}</span>`
                        ).join('')}
                    </div>` : ''
                }
            </a>
        </div>
    `).join('');
    
    searchResults.innerHTML = `
        <div class="search-results__header">
            <h4>Found ${results.length} result${results.length !== 1 ? 's' : ''} for "${query}"</h4>
        </div>
        <div class="search-results__list">
            ${resultsHTML}
        </div>
    `;
    
    searchResults.style.display = 'block';
    
    // Announce results to screen readers
    announceToScreenReader(`Found ${results.length} search results`);
}

/**
 * Highlight search matches in text
 */
function highlightMatch(text, query) {
    if (!query) return text;
    
    const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
}

/**
 * Escape special regex characters
 */
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Initialize go back button functionality
 */
function initGoBackButton() {
    const goBackBtn = document.getElementById('go-back-btn');
    
    if (!goBackBtn) return;
    
    goBackBtn.addEventListener('click', function() {
        // Check if there's history to go back to
        if (window.history.length > 1 && document.referrer) {
            window.history.back();
        } else {
            // Fallback to home page if no history
            window.location.href = 'index.html';
        }
    });
    
    // Hide button if no history available
    if (window.history.length <= 1 && !document.referrer) {
        goBackBtn.style.display = 'none';
    }
}

/**
 * Initialize keyboard shortcuts
 */
function initKeyboardShortcuts() {
    document.addEventListener('keydown', function(event) {
        // Focus search on '/' key
        if (event.key === '/' && !event.ctrlKey && !event.metaKey) {
            event.preventDefault();
            const searchInput = document.getElementById('error-search');
            if (searchInput) {
                searchInput.focus();
            }
        }
        
        // Go home on 'h' key
        if (event.key === 'h' && !event.ctrlKey && !event.metaKey) {
            const activeElement = document.activeElement;
            if (activeElement.tagName !== 'INPUT' && activeElement.tagName !== 'TEXTAREA') {
                window.location.href = 'index.html';
            }
        }
        
        // Go to projects on 'p' key
        if (event.key === 'p' && !event.ctrlKey && !event.metaKey) {
            const activeElement = document.activeElement;
            if (activeElement.tagName !== 'INPUT' && activeElement.tagName !== 'TEXTAREA') {
                window.location.href = 'projects.html';
            }
        }
        
        // Go to contact on 'c' key
        if (event.key === 'c' && !event.ctrlKey && !event.metaKey) {
            const activeElement = document.activeElement;
            if (activeElement.tagName !== 'INPUT' && activeElement.tagName !== 'TEXTAREA') {
                window.location.href = 'contact.html';
            }
        }
        
        // Escape to clear search
        if (event.key === 'Escape') {
            const searchInput = document.getElementById('error-search');
            const searchResults = document.getElementById('search-results');
            
            if (searchInput && searchInput.value) {
                searchInput.value = '';
                if (searchResults) {
                    searchResults.style.display = 'none';
                }
            }
        }
    });
    
    // Add keyboard shortcuts help
    addKeyboardShortcutsHelp();
}

/**
 * Add keyboard shortcuts help
 */
function addKeyboardShortcutsHelp() {
    const helpSection = document.querySelector('.error-page__help');
    if (!helpSection) return;
    
    const shortcutsHelp = document.createElement('div');
    shortcutsHelp.className = 'error-page__shortcuts';
    shortcutsHelp.innerHTML = `
        <details class="shortcuts-details">
            <summary class="shortcuts-summary">Keyboard Shortcuts</summary>
            <div class="shortcuts-content">
                <div class="shortcut-item">
                    <kbd>/</kbd> <span>Focus search</span>
                </div>
                <div class="shortcut-item">
                    <kbd>H</kbd> <span>Go to Home</span>
                </div>
                <div class="shortcut-item">
                    <kbd>P</kbd> <span>Go to Projects</span>
                </div>
                <div class="shortcut-item">
                    <kbd>C</kbd> <span>Go to Contact</span>
                </div>
                <div class="shortcut-item">
                    <kbd>Esc</kbd> <span>Clear search</span>
                </div>
            </div>
        </details>
    `;
    
    helpSection.appendChild(shortcutsHelp);
}

/**
 * Track 404 error for analytics
 */
function trackPageError() {
    const currentUrl = window.location.href;
    const referrer = document.referrer || 'Direct';
    
    // Track with analytics if available
    if (typeof gtag !== 'undefined') {
        gtag('event', 'page_not_found', {
            'page_location': currentUrl,
            'page_referrer': referrer
        });
    }
    
    // Log for debugging
    console.log('404 Error:', {
        url: currentUrl,
        referrer: referrer,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
    });
}

/**
 * Announce message to screen readers
 */
function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
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
 * Add CSS styles for 404 page enhancements
 */
function add404Styles() {
    const style = document.createElement('style');
    style.textContent = `
        .error-page__icon {
            font-size: 3rem;
            margin-bottom: var(--space-md);
            opacity: 0.7;
        }
        
        .error-page__suggestions {
            margin: var(--space-2xl) 0;
            padding: var(--space-lg);
            background: var(--color-gray-50);
            border-radius: var(--radius-lg);
        }
        
        .error-page__suggestions-title {
            margin-bottom: var(--space-md);
            font-size: var(--font-size-lg);
            color: var(--color-gray-700);
        }
        
        .error-page__search {
            display: flex;
            gap: var(--space-sm);
            margin-bottom: var(--space-md);
        }
        
        .error-page__search-input {
            flex: 1;
            padding: var(--space-sm) var(--space-md);
            border: 2px solid var(--color-gray-300);
            border-radius: var(--radius-md);
            font-size: var(--font-size-base);
        }
        
        .error-page__search-input:focus {
            outline: none;
            border-color: var(--color-primary);
            box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
        }
        
        .error-page__search-btn {
            padding: var(--space-sm) var(--space-md);
            background: var(--color-primary);
            color: white;
            border: none;
            border-radius: var(--radius-md);
            cursor: pointer;
            font-size: var(--font-size-lg);
        }
        
        .error-page__search-btn:hover {
            background: var(--color-primary-dark);
        }
        
        .search-results__item {
            margin-bottom: var(--space-md);
            padding: var(--space-md);
            background: white;
            border-radius: var(--radius-md);
            border: 1px solid var(--color-gray-200);
        }
        
        .search-results__link {
            text-decoration: none;
            color: inherit;
            display: block;
        }
        
        .search-results__link:hover {
            background: var(--color-gray-50);
        }
        
        .search-results__title {
            color: var(--color-primary);
            margin-bottom: var(--space-xs);
        }
        
        .search-results__description {
            color: var(--color-gray-600);
            margin-bottom: var(--space-sm);
        }
        
        .search-results__keywords {
            display: flex;
            gap: var(--space-xs);
            flex-wrap: wrap;
        }
        
        .search-results__keyword {
            background: var(--color-primary-light);
            color: white;
            padding: 2px 6px;
            border-radius: var(--radius-sm);
            font-size: var(--font-size-xs);
        }
        
        .search-results__empty {
            text-align: center;
            padding: var(--space-lg);
            color: var(--color-gray-600);
        }
        
        .error-page__popular {
            margin: var(--space-2xl) 0;
        }
        
        .error-page__popular-title {
            margin-bottom: var(--space-lg);
            font-size: var(--font-size-xl);
            color: var(--color-gray-800);
        }
        
        .error-page__links {
            display: grid;
            gap: var(--space-md);
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        }
        
        .error-page__link {
            display: flex;
            align-items: flex-start;
            gap: var(--space-md);
            padding: var(--space-lg);
            background: white;
            border: 2px solid var(--color-gray-200);
            border-radius: var(--radius-lg);
            text-decoration: none;
            color: inherit;
            transition: all var(--transition-fast);
        }
        
        .error-page__link:hover {
            border-color: var(--color-primary);
            transform: translateY(-2px);
            box-shadow: var(--shadow-md);
        }
        
        .error-page__link-icon {
            font-size: var(--font-size-2xl);
            flex-shrink: 0;
        }
        
        .error-page__link-text {
            font-weight: var(--font-weight-semibold);
            color: var(--color-primary);
            margin-bottom: var(--space-xs);
            display: block;
        }
        
        .error-page__link-desc {
            color: var(--color-gray-600);
            font-size: var(--font-size-sm);
        }
        
        .error-page__actions {
            margin: var(--space-2xl) 0;
            display: flex;
            gap: var(--space-md);
            justify-content: center;
            flex-wrap: wrap;
        }
        
        .error-page__help {
            margin-top: var(--space-2xl);
            text-align: center;
            color: var(--color-gray-600);
        }
        
        .error-page__help-link {
            color: var(--color-primary);
            text-decoration: none;
        }
        
        .error-page__help-link:hover {
            text-decoration: underline;
        }
        
        .error-page__shortcuts {
            margin-top: var(--space-lg);
        }
        
        .shortcuts-details {
            background: var(--color-gray-50);
            border-radius: var(--radius-md);
            padding: var(--space-md);
        }
        
        .shortcuts-summary {
            cursor: pointer;
            font-weight: var(--font-weight-medium);
            color: var(--color-gray-700);
        }
        
        .shortcuts-content {
            margin-top: var(--space-md);
            display: grid;
            gap: var(--space-sm);
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        }
        
        .shortcut-item {
            display: flex;
            align-items: center;
            gap: var(--space-sm);
        }
        
        .shortcut-item kbd {
            background: var(--color-gray-200);
            border: 1px solid var(--color-gray-300);
            border-radius: var(--radius-sm);
            padding: 2px 6px;
            font-size: var(--font-size-xs);
            font-family: monospace;
        }
        
        mark {
            background: yellow;
            padding: 1px 2px;
            border-radius: 2px;
        }
        
        @media (max-width: 768px) {
            .error-page__actions {
                flex-direction: column;
                align-items: center;
            }
            
            .error-page__links {
                grid-template-columns: 1fr;
            }
            
            .shortcuts-content {
                grid-template-columns: 1fr;
            }
        }
    `;
    
    document.head.appendChild(style);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    init404Page();
    add404Styles();
});

// Export for external use
window.Error404Module = {
    init404Page,
    performSearch,
    trackPageError
};