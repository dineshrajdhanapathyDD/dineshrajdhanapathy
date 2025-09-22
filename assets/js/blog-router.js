/**
 * Blog Router - Handles different hosting environments
 * Fixes routing issues for GitHub Pages and other hosting platforms
 */

(function() {
    'use strict';

    // Blog routing configuration
    const BlogRouter = {
        // Detect hosting environment
        detectEnvironment: function() {
            const hostname = window.location.hostname;
            const pathname = window.location.pathname;
            
            if (hostname.includes('github.io') || pathname.includes('dineshrajdhanapathy')) {
                return 'github-pages';
            } else if (hostname === 'localhost' || hostname === '127.0.0.1') {
                return 'local';
            } else {
                return 'custom';
            }
        },

        // Get correct base path for current environment
        getBasePath: function() {
            const env = this.detectEnvironment();
            const pathname = window.location.pathname;
            
            switch (env) {
                case 'github-pages':
                    if (pathname.includes('/dineshrajdhanapathy/')) {
                        return '/dineshrajdhanapathy/';
                    }
                    return '/';
                case 'local':
                    return '/';
                default:
                    return '/';
            }
        },

        // Fix blog navigation links
        fixBlogLinks: function() {
            const basePath = this.getBasePath();
            const blogLinks = document.querySelectorAll('a[href*="blog"]');
            
            blogLinks.forEach(link => {
                const href = link.getAttribute('href');
                
                // Fix blog index links
                if (href === 'blog/' || href === './blog/') {
                    link.setAttribute('href', basePath + 'blog/');
                }
                
                // Fix blog post links
                if (href.startsWith('blog/posts/')) {
                    link.setAttribute('href', basePath + href);
                }
                
                // Fix relative navigation from blog pages
                if (href.startsWith('../') && window.location.pathname.includes('/blog/')) {
                    const newHref = href.replace('../', basePath);
                    link.setAttribute('href', newHref);
                }
            });
        },

        // Handle blog page errors
        handleBlogErrors: function() {
            // If we're on a blog page that failed to load
            if (window.location.pathname.includes('/blog') && document.title.includes('404')) {
                const basePath = this.getBasePath();
                
                // Try to redirect to correct blog path
                setTimeout(() => {
                    window.location.href = basePath + 'blog/';
                }, 1000);
            }
        },

        // Initialize blog router
        init: function() {
            console.log('Blog Router initialized for environment:', this.detectEnvironment());
            console.log('Base path:', this.getBasePath());
            
            this.fixBlogLinks();
            this.handleBlogErrors();
            
            // Re-fix links when DOM changes
            const observer = new MutationObserver(() => {
                this.fixBlogLinks();
            });
            
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => BlogRouter.init());
    } else {
        BlogRouter.init();
    }

    // Make available globally for debugging
    window.BlogRouter = BlogRouter;

})();