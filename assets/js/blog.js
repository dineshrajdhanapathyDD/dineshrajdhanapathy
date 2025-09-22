/**
 * Blog functionality including iframe-based post expansion
 */

class BlogManager {
    constructor() {
        this.searchInput = document.getElementById('blog-search');
        this.searchResults = document.getElementById('search-results');
        this.blogPosts = document.getElementById('blog-posts');
        this.posts = [];
        this.searchIndex = null;
        
        this.init();
    }
    
    async init() {
        await this.loadPosts();
        this.setupSearch();
        this.setupEventListeners();
        this.setupIframeHandlers();
    }
    
    async loadPosts() {
        try {
            // Extract post data from the DOM
            const postElements = document.querySelectorAll('.post-preview');
            
            this.posts = Array.from(postElements).map((element, index) => {
                const titleElement = element.querySelector('.post-preview__title-text');
                const excerptElement = element.querySelector('.post-preview__excerpt');
                const dateElement = element.querySelector('.post-preview__date');
                const tagsElements = element.querySelectorAll('.post-preview__tag');
                
                return {
                    id: index,
                    title: titleElement ? titleElement.textContent.trim() : '',
                    excerpt: excerptElement ? excerptElement.textContent.trim() : '',
                    date: dateElement ? dateElement.getAttribute('datetime') : '',
                    tags: Array.from(tagsElements).map(tag => tag.textContent.trim()),
                    element: element
                };
            });
            
            this.buildSearchIndex();
        } catch (error) {
            console.error('Error loading posts:', error);
        }
    }
    
    buildSearchIndex() {
        // Simple search index
        this.searchIndex = this.posts.map(post => ({
            id: post.id,
            searchText: `${post.title} ${post.excerpt} ${post.tags.join(' ')}`.toLowerCase()
        }));
    }
    
    setupSearch() {
        if (!this.searchInput) return;
        
        let searchTimeout;
        
        this.searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.performSearch(e.target.value);
            }, 300);
        });
        
        this.searchInput.addEventListener('focus', () => {
            if (this.searchInput.value.trim()) {
                this.showSearchResults();
            }
        });
        
        // Close search results when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.blog__search')) {
                this.hideSearchResults();
            }
        });
        
        // Handle escape key
        this.searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.clearSearch();
            }
        });
    }
    
    performSearch(query) {
        if (!query.trim()) {
            this.clearSearch();
            return;
        }
        
        // Check if it's a tag search
        if (query.toLowerCase().startsWith('tag:')) {
            const tag = query.substring(4).trim();
            this.filterByTag(tag);
            this.hideSearchResults();
            return;
        }
        
        const searchTerm = query.toLowerCase();
        const results = this.searchIndex
            .filter(item => item.searchText.includes(searchTerm))
            .map(item => this.posts[item.id])
            .slice(0, 5); // Limit to 5 results
        
        this.displaySearchResults(results, query);
        this.filterPosts(results);
    }
    
    displaySearchResults(results, query) {
        if (!this.searchResults) return;
        
        if (results.length === 0) {
            this.searchResults.innerHTML = `
                <div class="search__no-results">
                    <p>No posts found for "${query}"</p>
                    <p class="search__suggestion">Try different keywords or browse all posts below.</p>
                </div>
            `;
        } else {
            this.searchResults.innerHTML = results.map(post => `
                <div class="search__result">
                    <div class="search__result-link">
                        <h4 class="search__result-title">${this.highlightText(post.title, query)}</h4>
                        <p class="search__result-excerpt">${this.highlightText(post.excerpt.substring(0, 100) + '...', query)}</p>
                        <div class="search__result-meta">
                            <time class="search__result-date">${new Date(post.date).toLocaleDateString()}</time>
                            ${post.tags.length > 0 ? `<span class="search__result-tags">${post.tags.slice(0, 2).join(', ')}</span>` : ''}
                        </div>
                    </div>
                </div>
            `).join('');
        }
        
        this.showSearchResults();
    }
    
    highlightText(text, query) {
        if (!query.trim()) return text;
        
        const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }
    
    filterPosts(results) {
        if (!this.blogPosts) return;
        
        const allPosts = this.blogPosts.querySelectorAll('.post-preview');
        
        if (results.length === 0) {
            // Show all posts if no results
            allPosts.forEach(post => {
                post.style.display = 'block';
            });
            return;
        }
        
        // Hide all posts first
        allPosts.forEach(post => {
            post.style.display = 'none';
        });
        
        // Show matching posts
        results.forEach(result => {
            if (result.element) {
                result.element.style.display = 'block';
            }
        });
    }
    
    showSearchResults() {
        if (this.searchResults) {
            this.searchResults.style.display = 'block';
        }
    }
    
    hideSearchResults() {
        if (this.searchResults) {
            this.searchResults.style.display = 'none';
        }
    }
    
    clearSearch() {
        if (this.searchInput) {
            this.searchInput.value = '';
        }
        
        this.hideSearchResults();
        this.clearFilter();
    }
    
    clearFilter() {
        // Show all posts
        if (this.blogPosts) {
            const allPosts = this.blogPosts.querySelectorAll('.post-preview');
            allPosts.forEach(post => {
                post.style.display = 'block';
                post.classList.remove('filtering-out', 'filtering-in');
            });
        }
        
        // Remove filter status
        const existingStatus = document.querySelector('.blog__filter-status');
        if (existingStatus) {
            existingStatus.remove();
        }
    }
    
    setupEventListeners() {
        // Tag filter buttons
        document.addEventListener('click', (e) => {
            if (e.target.matches('.tag-filter') || e.target.closest('.tag-filter')) {
                e.preventDefault();
                const button = e.target.matches('.tag-filter') ? e.target : e.target.closest('.tag-filter');
                const tag = button.getAttribute('data-tag');
                
                if (tag === 'all') {
                    this.clearFilter();
                } else {
                    this.filterByTag(tag);
                }
            }
        });
        
        // Tag filtering from post tags
        document.addEventListener('click', (e) => {
            if (e.target.matches('.post-preview__tag')) {
                e.preventDefault();
                const tag = e.target.textContent.trim();
                this.filterByTag(tag);
            }
        });
        
        // Post expand/collapse functionality
        document.addEventListener('click', (e) => {
            if (e.target.matches('.post-preview__read-more')) {
                e.preventDefault();
                this.togglePostContent(e.target);
            }
        });
        
        // Reading time updates
        this.updateReadingTimes();
    }
    
    togglePostContent(button) {
        const article = button.closest('.post-preview');
        const iframeContainer = article.querySelector('.post-preview__iframe-container');
        const excerpt = article.querySelector('.post-preview__excerpt');
        const iframe = article.querySelector('.post-preview__iframe');
        const isExpanded = button.getAttribute('data-action') === 'collapse';
        
        if (isExpanded) {
            // Collapse the post
            iframeContainer.style.display = 'none';
            excerpt.style.display = 'block';
            button.textContent = 'Read More →';
            button.setAttribute('data-action', 'expand');
            article.classList.remove('post-preview--expanded');
            
            // Scroll to the post title
            article.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            // Expand the post
            excerpt.style.display = 'none';
            iframeContainer.style.display = 'block';
            button.textContent = '← Show Less';
            button.setAttribute('data-action', 'collapse');
            article.classList.add('post-preview--expanded');
            
            // Ensure iframe loads if not already loaded
            if (iframe && !iframe.src) {
                iframe.src = iframe.getAttribute('data-src') || iframe.src;
            }
            
            // Auto-resize iframe after a short delay to ensure content is loaded
            setTimeout(() => {
                this.resizeIframe(iframe);
            }, 500);
        }
    }
    
    resizeIframe(iframe) {
        if (!iframe) return;
        
        try {
            // Set initial height
            iframe.style.height = '600px';
            
            // Try to access iframe content and resize based on content
            iframe.onload = () => {
                try {
                    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                    const height = iframeDoc.body.scrollHeight;
                    
                    // Set height with some padding
                    iframe.style.height = (height + 50) + 'px';
                } catch (e) {
                    // If we can't access iframe content (CORS), use a reasonable default
                    console.log('Cannot access iframe content for resizing, using default height');
                    iframe.style.height = '800px';
                }
            };
        } catch (e) {
            console.log('Error resizing iframe:', e);
            iframe.style.height = '800px';
        }
    }
    
    setupIframeHandlers() {
        // Setup iframe resize handlers
        document.addEventListener('DOMContentLoaded', () => {
            const iframes = document.querySelectorAll('.post-preview__iframe');
            iframes.forEach(iframe => {
                iframe.addEventListener('load', () => {
                    this.resizeIframe(iframe);
                });
            });
        });
    }
    
    filterByTag(tag) {
        if (!this.blogPosts) return;
        
        const allPosts = this.blogPosts.querySelectorAll('.post-preview');
        let visibleCount = 0;
        
        allPosts.forEach(post => {
            const postTags = Array.from(post.querySelectorAll('.post-preview__tag'))
                .map(tagEl => tagEl.textContent.trim());
            
            if (postTags.includes(tag)) {
                post.style.display = 'block';
                visibleCount++;
            } else {
                post.style.display = 'none';
            }
        });
        
        // Update search input to show current filter
        if (this.searchInput) {
            this.searchInput.value = `tag:${tag}`;
        }
        
        // Show filter status
        this.showFilterStatus(tag, visibleCount);
    }
    
    showFilterStatus(tag, count) {
        // Remove existing filter status
        const existingStatus = document.querySelector('.blog__filter-status');
        if (existingStatus) {
            existingStatus.remove();
        }
        
        // Add new filter status
        const filterStatus = document.createElement('div');
        filterStatus.className = 'blog__filter-status';
        filterStatus.innerHTML = `
            <p>Showing ${count} post${count !== 1 ? 's' : ''} tagged with "${tag}"</p>
            <button class="blog__clear-filter" onclick="blogManager.clearFilter()">Clear Filter</button>
        `;
        
        if (this.blogPosts) {
            this.blogPosts.parentNode.insertBefore(filterStatus, this.blogPosts);
        }
    }
    
    updateReadingTimes() {
        // Update reading times for posts that don't have them set
        const posts = document.querySelectorAll('.post-preview');
        
        posts.forEach(post => {
            const readingTimeEl = post.querySelector('.post-preview__reading-time');
            const excerptEl = post.querySelector('.post-preview__excerpt');
            
            if (readingTimeEl && excerptEl && !readingTimeEl.textContent.includes('min read')) {
                const wordCount = excerptEl.textContent.split(' ').length;
                const readingTime = Math.max(1, Math.ceil(wordCount / 200));
                readingTimeEl.textContent = `${readingTime} min read`;
            }
        });
    }
}

// Utility functions for blog features
const BlogUtils = {
    // Format date for display
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },
    
    // Calculate reading time
    calculateReadingTime(content) {
        const wordsPerMinute = 200;
        const wordCount = content.split(' ').length;
        return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
    },
    
    // Truncate text
    truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength).trim() + '...';
    },
    
    // Debounce function
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};

// Initialize blog manager when DOM is loaded
let blogManager;

document.addEventListener('DOMContentLoaded', () => {
    // Only initialize on blog pages
    if (document.querySelector('.blog') || document.querySelector('.post')) {
        blogManager = new BlogManager();
    }
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BlogManager, BlogUtils };
}