/**
 * Enhanced Social Sharing functionality
 */

class SocialSharing {
    constructor() {
        this.shareCount = 0;
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.detectMobile();
        this.loadShareCounts();
    }
    
    setupEventListeners() {
        // Track social sharing clicks
        document.addEventListener('click', (e) => {
            const shareButton = e.target.closest('.social-sharing__button');
            if (shareButton && !shareButton.classList.contains('social-sharing__button--copy')) {
                this.trackShare(shareButton.dataset.platform);
            }
        });
        
        // Handle native sharing if available
        if (navigator.share) {
            this.addNativeShareButton();
        }
    }
    
    detectMobile() {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        if (!isMobile) {
            // Hide mobile-only buttons on desktop
            document.querySelectorAll('.social-sharing__button--mobile-only').forEach(button => {
                button.style.display = 'none';
            });
        }
    }
    
    addNativeShareButton() {
        const shareContainers = document.querySelectorAll('.social-sharing__buttons');
        
        shareContainers.forEach(container => {
            const nativeButton = document.createElement('button');
            nativeButton.className = 'social-sharing__button social-sharing__button--native';
            nativeButton.setAttribute('aria-label', 'Share using device options');
            nativeButton.innerHTML = `
                <svg class="social-sharing__icon" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.50-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>
                </svg>
                <span class="social-sharing__text">Share</span>
            `;
            
            nativeButton.addEventListener('click', () => {
                this.nativeShare();
            });
            
            // Insert as first button
            container.insertBefore(nativeButton, container.firstChild);
        });
    }
    
    async nativeShare() {
        const title = document.querySelector('h1').textContent;
        const url = window.location.href;
        const text = document.querySelector('meta[name="description"]')?.content || title;
        
        try {
            await navigator.share({
                title: title,
                text: text,
                url: url
            });
            
            this.trackShare('native');
        } catch (error) {
            console.log('Native sharing cancelled or failed:', error);
        }
    }
    
    copyToClipboard(text) {
        const button = event.target.closest('.social-sharing__button--copy');
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                this.showCopySuccess(button);
                this.trackShare('copy');
            }).catch(() => {
                this.fallbackCopyToClipboard(text, button);
            });
        } else {
            this.fallbackCopyToClipboard(text, button);
        }
    }
    
    fallbackCopyToClipboard(text, button) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            this.showCopySuccess(button);
            this.trackShare('copy');
        } catch (error) {
            console.error('Fallback copy failed:', error);
            this.showCopyError(button);
        }
        
        document.body.removeChild(textArea);
    }
    
    showCopySuccess(button) {
        const originalHTML = button.innerHTML;
        button.innerHTML = `
            <svg class="social-sharing__icon" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
            <span class="social-sharing__text">Copied!</span>
        `;
        button.classList.add('social-sharing__button--success');
        
        setTimeout(() => {
            button.innerHTML = originalHTML;
            button.classList.remove('social-sharing__button--success');
        }, 2000);
    }
    
    showCopyError(button) {
        const originalHTML = button.innerHTML;
        button.innerHTML = `
            <svg class="social-sharing__icon" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
            <span class="social-sharing__text">Failed</span>
        `;
        button.classList.add('social-sharing__button--error');
        
        setTimeout(() => {
            button.innerHTML = originalHTML;
            button.classList.remove('social-sharing__button--error');
        }, 2000);
    }
    
    trackShare(platform) {
        this.shareCount++;
        
        // Update share count display
        const shareStats = document.querySelector('.social-sharing__stats');
        if (shareStats) {
            const countElement = shareStats.querySelector('.social-sharing__count');
            if (countElement) {
                countElement.textContent = `${this.shareCount} share${this.shareCount !== 1 ? 's' : ''}`;
            }
        }
        
        // Analytics tracking (if available)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'share', {
                method: platform,
                content_type: 'blog_post',
                item_id: window.location.pathname
            });
        }
        
        // Custom event for other analytics
        window.dispatchEvent(new CustomEvent('socialShare', {
            detail: {
                platform: platform,
                url: window.location.href,
                title: document.title
            }
        }));
        
        console.log(`Shared via ${platform}`);
    }
    
    loadShareCounts() {
        // This would typically load from an API
        // For now, we'll simulate with localStorage
        const currentUrl = window.location.href;
        const storageKey = `shareCount_${btoa(currentUrl)}`;
        const savedCount = localStorage.getItem(storageKey) || 0;
        
        this.shareCount = parseInt(savedCount);
        
        // Update display
        const shareStats = document.querySelector('.social-sharing__stats');
        if (shareStats && this.shareCount > 0) {
            const countElement = shareStats.querySelector('.social-sharing__count');
            if (countElement) {
                countElement.textContent = `${this.shareCount} share${this.shareCount !== 1 ? 's' : ''}`;
            }
        }
    }
    
    saveShareCount() {
        const currentUrl = window.location.href;
        const storageKey = `shareCount_${btoa(currentUrl)}`;
        localStorage.setItem(storageKey, this.shareCount.toString());
    }
    
    // Method to generate share URLs programmatically
    generateShareUrl(platform, options = {}) {
        const {
            url = window.location.href,
            title = document.title,
            text = '',
            via = ''
        } = options;
        
        const encodedUrl = encodeURIComponent(url);
        const encodedTitle = encodeURIComponent(title);
        const encodedText = encodeURIComponent(text);
        
        const shareUrls = {
            twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}${via ? `&via=${via}` : ''}`,
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
            reddit: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
            whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
            email: `mailto:?subject=${encodedTitle}&body=${encodedText}%20${encodedUrl}`
        };
        
        return shareUrls[platform] || '';
    }
    
    // Method to add custom share buttons dynamically
    addCustomShareButton(container, platform, options = {}) {
        const button = document.createElement('a');
        button.className = `social-sharing__button social-sharing__button--${platform}`;
        button.href = this.generateShareUrl(platform, options);
        button.target = '_blank';
        button.rel = 'noopener noreferrer';
        button.setAttribute('aria-label', `Share on ${platform}`);
        button.dataset.platform = platform;
        
        button.innerHTML = `
            <span class="social-sharing__icon">${options.icon || '🔗'}</span>
            <span class="social-sharing__text">${options.text || platform}</span>
        `;
        
        container.appendChild(button);
        return button;
    }
}

// Utility functions for social sharing
const SocialSharingUtils = {
    // Get optimal image for sharing
    getShareImage() {
        const ogImage = document.querySelector('meta[property="og:image"]');
        const twitterImage = document.querySelector('meta[name="twitter:image"]');
        const featuredImage = document.querySelector('.post__featured-image img');
        
        if (ogImage) return ogImage.content;
        if (twitterImage) return twitterImage.content;
        if (featuredImage) return featuredImage.src;
        
        return '/assets/images/og-image.jpg';
    },
    
    // Get optimal description for sharing
    getShareDescription() {
        const ogDescription = document.querySelector('meta[property="og:description"]');
        const metaDescription = document.querySelector('meta[name="description"]');
        const excerpt = document.querySelector('.post__excerpt');
        
        if (ogDescription) return ogDescription.content;
        if (metaDescription) return metaDescription.content;
        if (excerpt) return excerpt.textContent.trim();
        
        return document.title;
    },
    
    // Format share text for different platforms
    formatShareText(platform, title, description) {
        switch (platform) {
            case 'twitter':
                // Twitter has character limits
                const maxLength = 280 - 25; // Reserve space for URL
                const text = `${title}: ${description}`;
                return text.length > maxLength ? text.substring(0, maxLength - 3) + '...' : text;
            
            case 'linkedin':
                return `${title}\n\n${description}`;
            
            case 'facebook':
                return title; // Facebook pulls description automatically
            
            default:
                return `${title} - ${description}`;
        }
    }
};

// Initialize social sharing
let socialSharing;

document.addEventListener('DOMContentLoaded', () => {
    socialSharing = new SocialSharing();
    
    // Save share count before page unload
    window.addEventListener('beforeunload', () => {
        if (socialSharing) {
            socialSharing.saveShareCount();
        }
    });
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SocialSharing, SocialSharingUtils };
}