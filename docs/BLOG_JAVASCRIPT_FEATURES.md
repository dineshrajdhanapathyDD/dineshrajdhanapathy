# Blog JavaScript Features

## Overview

The blog section includes comprehensive JavaScript functionality to enhance user experience with interactive features, search capabilities, and dynamic content management. This document outlines the key JavaScript features implemented in the blog system.

## Core JavaScript Components

### BlogManager Class

The main `BlogManager` class handles all blog functionality including search, filtering, and interactive features.

#### Key Features

1. **Post Loading and Indexing**
   - Automatically extracts post data from DOM elements
   - Builds searchable index for real-time search functionality
   - Handles post metadata (title, excerpt, date, tags, reading time)

2. **Search Functionality**
   - Real-time search with 300ms debounce for performance
   - Search result highlighting with `<mark>` tags
   - Support for tag-specific searches using `tag:` prefix
   - Dropdown search results with post previews
   - Keyboard navigation support (Escape to clear)

3. **Tag Filtering System**
   - Interactive tag filter buttons with active state management
   - Smooth animations for filtering transitions
   - Filter status display with post count
   - Clear filter functionality
   - Tag-based URL updates for bookmarkable filtered views

## New Feature: Post Expand/Collapse

### Overview

The post expand/collapse feature allows users to read full blog post content directly on the blog index page without navigating to individual post pages. This improves user experience by reducing page loads and providing seamless content consumption.

### Implementation Details

#### HTML Structure Required

The feature supports both direct content and iframe-based content loading:

```html
<article class="post-preview" data-post-id="unique-post-id">
    <div class="post-preview__content">
        <div class="post-preview__excerpt">
            <!-- Short excerpt content -->
        </div>
        
        <!-- Option 1: Direct content -->
        <div class="post-preview__full-content" style="display: none;">
            <div class="post-content">
                <!-- Full post content -->
            </div>
        </div>
        
        <!-- Option 2: Iframe-based content (preferred for better isolation) -->
        <div class="post-preview__iframe-container" style="display: none;">
            <iframe 
                src="posts/post-filename.html" 
                class="post-preview__iframe"
                title="Post Title - Full Article"
                loading="lazy">
            </iframe>
        </div>
    </div>
    
    <footer class="post-preview__footer">
        <button class="post-preview__read-more" data-action="expand">
            Read More →
        </button>
    </footer>
</article>
```

#### JavaScript Functionality

##### Event Handling
```javascript
// Post expand/collapse functionality
document.addEventListener('click', (e) => {
    if (e.target.matches('.post-preview__read-more')) {
        e.preventDefault();
        this.togglePostContent(e.target);
    }
});
```

##### Toggle Functionality
The `togglePostContent(button)` method handles the expand/collapse logic with support for both direct content and iframe-based content:

**Expand State:**
- Hides excerpt content (`display: none`)
- Shows iframe container or full content (`display: block`)
- Updates button text to "← Show Less"
- Changes `data-action` attribute to "collapse"
- Adds `post-preview--expanded` CSS class
- Loads iframe content if not already loaded
- Auto-resizes iframe after content loads

**Collapse State:**
- Shows excerpt content (`display: block`)
- Hides iframe container or full content (`display: none`)
- Updates button text to "Read More →"
- Changes `data-action` attribute to "expand"
- Removes `post-preview--expanded` CSS class
- Smoothly scrolls to post title

##### Iframe Content Management
The expand/collapse feature now supports iframe-based content loading for better content isolation and styling:

```javascript
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
```

### User Experience Benefits

1. **Reduced Page Loads**: Users can read full content without navigation
2. **Seamless Browsing**: Smooth transitions between excerpt and full content
3. **Context Preservation**: Users maintain their position in the blog index
4. **Accurate Metrics**: Reading time updates dynamically based on content length
5. **Smooth Navigation**: Auto-scroll to post title when collapsing for better UX

### CSS Integration

The feature integrates with CSS classes for styling:

- `.post-preview--expanded`: Applied when post is expanded
- `.post-preview__excerpt`: Excerpt content container
- `.post-preview__full-content`: Full content container
- `.post-preview__read-more`: Toggle button styling

### Performance Considerations

1. **Lazy Content Loading**: Content is hidden by default (`display: none`) and loaded on demand
2. **Iframe Lazy Loading**: Iframes use `loading="lazy"` attribute and load content only when expanded
3. **Efficient DOM Queries**: Uses `closest()` and `querySelector()` for targeted element selection
4. **Automatic Iframe Resizing**: Dynamic height adjustment based on content with fallback heights
5. **CORS Handling**: Graceful fallback when iframe content cannot be accessed due to CORS restrictions
6. **Memory Efficient**: No additional data structures, works directly with DOM
7. **Error Handling**: Comprehensive error handling for iframe loading and resizing failures

### Accessibility Features

1. **Keyboard Support**: Button is focusable and keyboard accessible
2. **Screen Reader Support**: Button text changes provide clear state indication
3. **Smooth Scrolling**: Uses `scrollIntoView()` with smooth behavior
4. **Semantic HTML**: Maintains proper article structure and hierarchy

### Browser Compatibility

- **Modern Browsers**: Full functionality with smooth animations
- **Fallback Support**: Graceful degradation for older browsers
- **Mobile Optimized**: Touch-friendly interactions and responsive design

## Additional JavaScript Features

### Image Management

The blog includes comprehensive image handling:

- **Lazy Loading**: Intersection Observer API with fallback
- **Error Handling**: Automatic fallback to default images
- **WebP Support**: Automatic format detection and optimization
- **Responsive Images**: Dynamic sizing based on container width

### Performance Optimization

- **Resource Hints**: DNS prefetching and preconnect for external resources
- **Critical Resource Preloading**: Faster initial page loads
- **Non-critical Asset Lazy Loading**: CSS and JavaScript loaded after user interaction
- **Core Web Vitals Monitoring**: LCP, FID, and CLS tracking

### Social Sharing Integration

- **Native Sharing API**: Uses browser's native sharing when available
- **Fallback Sharing**: Custom sharing implementation for unsupported browsers
- **Analytics Integration**: Tracks sharing events and user engagement
- **Copy-to-Clipboard**: One-click URL copying functionality

## Usage Guidelines

### For Developers

1. **HTML Structure**: Ensure proper HTML structure with required classes and data attributes
2. **Content Options**: Choose between direct content or iframe-based loading based on needs
3. **CSS Styling**: Implement appropriate styles for expanded/collapsed states and iframe containers
4. **Iframe Considerations**: Ensure iframe content is accessible and properly styled
5. **CORS Awareness**: Be aware of CORS restrictions when using iframe content from different origins
6. **Mobile Testing**: Test functionality across different device sizes, especially iframe resizing

### For Content Creators

1. **Excerpt Quality**: Write compelling excerpts that encourage expansion
2. **Content Structure**: Use proper headings and formatting in full content
3. **Reading Time**: Content length affects reading time calculation (200 words/minute)
4. **Image Optimization**: Optimize images for both excerpt and full content views

## Testing Recommendations

### Manual Testing

1. **Expand/Collapse**: Test button functionality and state changes
2. **Iframe Loading**: Verify iframe content loads correctly when expanded
3. **Iframe Resizing**: Test automatic height adjustment based on content
4. **Smooth Scrolling**: Test scroll behavior when collapsing posts
5. **Mobile Experience**: Test touch interactions and responsive behavior
6. **Keyboard Navigation**: Verify keyboard accessibility
7. **Error Handling**: Test behavior when iframe content fails to load

### Automated Testing

1. **DOM Manipulation**: Test element visibility changes for both content types
2. **Event Handling**: Verify click event handling and prevention
3. **State Management**: Test data attribute updates and CSS class changes
4. **Iframe Functionality**: Test iframe loading, resizing, and error handling
5. **Performance**: Monitor impact on page load and interaction times
6. **Cross-Origin Testing**: Verify CORS handling and fallback behavior

## Future Enhancements

### Potential Improvements

1. **Animation Enhancements**: CSS transitions for smoother expand/collapse
2. **Bookmark Support**: URL updates to maintain expanded state on page reload
3. **Keyboard Shortcuts**: Hotkeys for expand/collapse functionality
4. **Progress Indicators**: Visual progress bars for long content
5. **Content Caching**: Cache expanded content for faster subsequent loads

### Advanced Features

1. **Partial Content Loading**: Load content progressively as user scrolls
2. **Reading Position Memory**: Remember user's reading position
3. **Content Recommendations**: Suggest related posts based on expanded content
4. **Social Sharing Integration**: Share specific expanded posts
5. **Analytics Integration**: Track which posts are most frequently expanded

---

**Date**: January 30, 2025  
**Status**: Production Ready  
**Impact**: High (significant UX improvement)  
**Compatibility**: Modern browsers with graceful degradation  
**Files**: `portfolio-website/assets/js/blog.js`