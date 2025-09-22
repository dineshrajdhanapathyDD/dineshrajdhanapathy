/**
 * Homepage Blog Integration
 * Loads and displays recent blog posts on the homepage
 */

class HomepageBlog {
    constructor() {
        this.container = document.getElementById('recent-blog-posts');
        this.loadingElement = this.container?.querySelector('.recent-blog__loading');
        this.emptyElement = document.querySelector('.recent-blog__empty');
        this.maxPosts = 3;
        
        if (this.container) {
            this.init();
        }
    }

    async init() {
        try {
            await this.loadRecentPosts();
        } catch (error) {
            console.error('Failed to load recent blog posts:', error);
            this.showError();
        }
    }

    async loadRecentPosts() {
        // Try to fetch from Jekyll's generated JSON feed
        try {
            const response = await fetch('/feed.json');
            if (response.ok) {
                const feed = await response.json();
                this.renderPosts(feed.items.slice(0, this.maxPosts));
                return;
            }
        } catch (error) {
            console.log('JSON feed not available, trying alternative methods');
        }

        // Fallback: Try to fetch blog index and parse
        try {
            const response = await fetch('/dineshrajdhanapathy/blog/');
            if (response.ok) {
                const html = await response.text();
                const posts = this.parsePostsFromHTML(html);
                this.renderPosts(posts.slice(0, this.maxPosts));
                return;
            }
        } catch (error) {
            console.log('Blog index not available');
        }

        // Final fallback: Show empty state
        this.showEmpty();
    }

    parsePostsFromHTML(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const postElements = doc.querySelectorAll('.post-preview');
        
        return Array.from(postElements).map(element => {
            const titleElement = element.querySelector('.post-preview__title-link');
            const dateElement = element.querySelector('.post-preview__date');
            const excerptElement = element.querySelector('.post-preview__excerpt');
            const tagsElements = element.querySelectorAll('.post-preview__tag');
            
            return {
                title: titleElement?.textContent?.trim() || 'Untitled Post',
                url: titleElement?.href || '#',
                date_published: dateElement?.getAttribute('datetime') || new Date().toISOString(),
                content_text: excerptElement?.textContent?.trim() || '',
                tags: Array.from(tagsElements).map(tag => tag.textContent.trim()).filter(Boolean)
            };
        });
    }

    renderPosts(posts) {
        if (!posts || posts.length === 0) {
            this.showEmpty();
            return;
        }

        const postsHTML = posts.map(post => this.createPostHTML(post)).join('');
        
        this.container.innerHTML = `
            <div class="recent-blog__grid">
                ${postsHTML}
            </div>
        `;
    }

    createPostHTML(post) {
        const date = new Date(post.date_published);
        const formattedDate = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        const readingTime = this.estimateReadingTime(post.content_text || post.content_html || '');
        const excerpt = this.truncateText(post.content_text || this.stripHTML(post.content_html) || '', 120);
        
        const tagsHTML = post.tags && post.tags.length > 0 
            ? `<div class="recent-post__tags">
                ${post.tags.slice(0, 3).map(tag => 
                    `<span class="recent-post__tag">${this.escapeHTML(tag)}</span>`
                ).join('')}
               </div>`
            : '';

        return `
            <article class="recent-post">
                <header class="recent-post__header">
                    <h3 class="recent-post__title">
                        <a href="${this.escapeHTML(post.url)}" class="recent-post__title-link">
                            ${this.escapeHTML(post.title)}
                        </a>
                    </h3>
                    <div class="recent-post__meta">
                        <time class="recent-post__date" datetime="${post.date_published}">
                            ${formattedDate}
                        </time>
                        <span class="recent-post__reading-time">
                            ${readingTime} min read
                        </span>
                    </div>
                </header>
                
                <div class="recent-post__content">
                    <p class="recent-post__excerpt">${this.escapeHTML(excerpt)}</p>
                </div>
                
                <footer class="recent-post__footer">
                    ${tagsHTML}
                    <a href="${this.escapeHTML(post.url)}" class="recent-post__read-more">
                        Read More
                        <span class="recent-post__arrow" aria-hidden="true">→</span>
                    </a>
                </footer>
            </article>
        `;
    }

    showEmpty() {
        if (this.loadingElement) {
            this.loadingElement.style.display = 'none';
        }
        if (this.emptyElement) {
            this.emptyElement.style.display = 'block';
        }
        if (this.container) {
            this.container.innerHTML = '';
        }
    }

    showError() {
        if (this.loadingElement) {
            this.loadingElement.style.display = 'none';
        }
        
        this.container.innerHTML = `
            <div class="recent-blog__error">
                <p>Unable to load recent posts at the moment. Please visit the <a href="/dineshrajdhanapathy/blog/">blog section</a> directly.</p>
            </div>
        `;
    }

    estimateReadingTime(text) {
        const wordsPerMinute = 200;
        const wordCount = text.split(/\s+/).length;
        const readingTime = Math.ceil(wordCount / wordsPerMinute);
        return Math.max(1, readingTime);
    }

    truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        
        const truncated = text.substring(0, maxLength);
        const lastSpace = truncated.lastIndexOf(' ');
        
        return lastSpace > 0 
            ? truncated.substring(0, lastSpace) + '...'
            : truncated + '...';
    }

    stripHTML(html) {
        const div = document.createElement('div');
        div.innerHTML = html;
        return div.textContent || div.innerText || '';
    }

    escapeHTML(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new HomepageBlog();
});

// Export for potential use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HomepageBlog;
}