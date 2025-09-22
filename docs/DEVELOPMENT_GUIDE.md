# Development Guide

This guide provides comprehensive instructions for developing and maintaining the portfolio website.

## 🚀 Getting Started

### Prerequisites
- **Text Editor**: VS Code (recommended) or any modern editor
- **Browser**: Chrome, Firefox, Safari, or Edge (latest versions)
- **Git**: For version control
- **Live Server**: VS Code extension for local development

### Initial Setup
1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd portfolio-website
   ```

2. **Install VS Code extensions** (recommended)
   - Live Server
   - HTML CSS Support
   - JavaScript (ES6) code snippets
   - Prettier - Code formatter

3. **Start development server**
   - Right-click on `index.html`
   - Select "Open with Live Server"
   - Website opens at `http://localhost:5500`

## 🏗️ Development Workflow

### Daily Development
1. **Start Live Server** for instant preview
2. **Make changes** to HTML, CSS, or JavaScript
3. **Test in browser** - changes auto-reload
4. **Commit changes** regularly with descriptive messages

### Code Organization
- **HTML**: Semantic structure, proper accessibility
- **CSS**: BEM methodology, mobile-first approach
- **JavaScript**: ES6+, modular functions, proper error handling

## 📝 Content Management

### Updating Personal Information

#### Homepage (`index.html`)
```html
<!-- Update these sections -->
<h1 class="hero__title">
    <span class="hero__name">Your Name</span>
    <span class="hero__role">Your Title</span>
</h1>

<p class="hero__description">
    Your professional description...
</p>
```

#### Contact Information
```html
<!-- Update social links -->
<a href="https://linkedin.com/in/your-profile">LinkedIn</a>
<a href="https://github.com/your-username">GitHub</a>
<a href="mailto:your-email@example.com">Email</a>
```

### Adding Projects

#### Project Card Structure
```html
<div class="project-card">
    <div class="project-card__image">
        <img src="assets/images/projects/project-name.jpg" alt="Project description">
    </div>
    <div class="project-card__content">
        <h3 class="project-card__title">Project Name</h3>
        <p class="project-card__description">Project description...</p>
        <div class="project-card__tech">
            <span class="tech-tag">React</span>
            <span class="tech-tag">Node.js</span>
        </div>
        <div class="project-card__links">
            <a href="#" class="btn btn--primary">Live Demo</a>
            <a href="#" class="btn btn--secondary">GitHub</a>
        </div>
    </div>
</div>
```

### Blog Management

#### Creating New Blog Posts
1. **Create HTML file** in `blog/posts/`
   ```bash
   # Use the template
   cp common/templates/blog-post-template.md blog/posts/new-post.html
   ```

2. **Update blog index** (`blog/index.html`)
   ```html
   <!-- Add new post preview -->
   <article class="post-preview" data-post-id="new-post">
       <header class="post-preview__header">
           <h2 class="post-preview__title">
               <span class="post-preview__title-text">Post Title</span>
           </h2>
           <!-- ... rest of post preview -->
       </header>
   </article>
   ```

#### Blog Post Structure
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Post Title</title>
    <!-- Styles for blog post -->
</head>
<body>
    <article>
        <h1>Post Title</h1>
        <div class="post-meta">
            <time datetime="2024-01-15">January 15, 2024</time>
            <span>5 min read</span>
        </div>
        <!-- Post content -->
    </article>
</body>
</html>
```

## 🎨 Styling Guide

### CSS Architecture
```
assets/css/
├── reset.css          # CSS reset
├── main.css           # Main styles
├── blog.css           # Blog-specific styles
└── accessibility.css  # Accessibility styles
```

### CSS Methodology
- **BEM naming**: `.block__element--modifier`
- **Mobile-first**: Start with mobile styles, add desktop
- **CSS Custom Properties**: Use for colors and spacing

#### Example BEM Structure
```css
/* Block */
.project-card { }

/* Element */
.project-card__title { }
.project-card__description { }

/* Modifier */
.project-card--featured { }
.project-card__title--large { }
```

### Color System
```css
:root {
  --color-primary: #3b82f6;
  --color-secondary: #64748b;
  --color-accent: #ff6b6b;
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
}
```

### Responsive Breakpoints
```css
/* Mobile first approach */
.element {
  /* Mobile styles (default) */
}

@media (min-width: 768px) {
  /* Tablet styles */
}

@media (min-width: 1024px) {
  /* Desktop styles */
}

@media (min-width: 1200px) {
  /* Large desktop styles */
}
```

## ⚡ JavaScript Development

### Code Structure
```javascript
// Use modern JavaScript features
class FeatureManager {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.loadData();
    }
    
    setupEventListeners() {
        document.addEventListener('click', this.handleClick.bind(this));
    }
    
    handleClick(event) {
        // Handle click events
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new FeatureManager();
});
```

### Best Practices
- **Use const/let** instead of var
- **Arrow functions** for callbacks
- **Template literals** for strings
- **Async/await** for promises
- **Error handling** with try/catch

### Common Patterns
```javascript
// Debounce function
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Element selection
const element = document.querySelector('.selector');
const elements = document.querySelectorAll('.selector');

// Event handling
element.addEventListener('click', (event) => {
    event.preventDefault();
    // Handle click
});
```

## 🔧 Build and Deployment

### Development Build
```bash
# Run cleanup script
./common/scripts/cleanup.sh

# Start development server
# Use Live Server in VS Code
```

### Production Build
```bash
# Run deployment script
./common/scripts/deployment.sh

# Manual steps:
# 1. Minify CSS/JS (optional)
# 2. Optimize images
# 3. Validate HTML
# 4. Test all functionality
```

### GitHub Pages Deployment
1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Update website"
   git push origin main
   ```

2. **Configure GitHub Pages**
   - Repository Settings → Pages
   - Source: Deploy from branch
   - Branch: main / (root)

## 🧪 Testing

### Manual Testing Checklist
- [ ] All pages load without errors
- [ ] Navigation works correctly
- [ ] Forms validate and submit
- [ ] Images load with proper alt text
- [ ] Links work (internal and external)
- [ ] Responsive design on mobile/tablet
- [ ] Accessibility with keyboard navigation
- [ ] Performance is acceptable

### Browser Testing
Test on major browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

### Tools for Testing
- **HTML Validator**: https://validator.w3.org/
- **CSS Validator**: https://jigsaw.w3.org/css-validator/
- **Accessibility**: WAVE, axe DevTools
- **Performance**: Lighthouse, PageSpeed Insights

## 🔍 Debugging

### Common Issues and Solutions

#### CSS Not Loading
```html
<!-- Check file path -->
<link rel="stylesheet" href="assets/css/main.css">

<!-- Ensure correct MIME type -->
<!-- Add to .htaccess if needed -->
AddType text/css .css
```

#### JavaScript Errors
```javascript
// Use console.log for debugging
console.log('Debug info:', variable);

// Check for element existence
const element = document.querySelector('.selector');
if (element) {
    // Safe to use element
}

// Use try/catch for error handling
try {
    // Code that might fail
} catch (error) {
    console.error('Error:', error);
}
```

#### Images Not Loading
```html
<!-- Check file path and case sensitivity -->
<img src="assets/images/profile/photo.jpg" alt="Description">

<!-- Add error handling -->
<img src="image.jpg" alt="Description" 
     onerror="this.src='assets/images/fallback.jpg'">
```

### Debug Tools
- **Browser DevTools**: F12 or right-click → Inspect
- **Console**: Check for JavaScript errors
- **Network Tab**: Check failed resource loads
- **Elements Tab**: Inspect HTML/CSS

## 📊 Performance Optimization

### Image Optimization
- **Format**: Use WebP with fallbacks
- **Size**: Optimize for web (compress)
- **Lazy Loading**: Load images when needed
- **Responsive**: Serve appropriate sizes

### CSS Optimization
- **Minification**: Remove whitespace and comments
- **Critical CSS**: Inline above-the-fold styles
- **Unused CSS**: Remove unused styles

### JavaScript Optimization
- **Minification**: Compress JavaScript files
- **Defer Loading**: Load non-critical scripts later
- **Bundle**: Combine multiple files

## 📚 Resources

### Documentation
- [MDN Web Docs](https://developer.mozilla.org/)
- [CSS-Tricks](https://css-tricks.com/)
- [JavaScript.info](https://javascript.info/)

### Tools
- [VS Code](https://code.visualstudio.com/)
- [Git](https://git-scm.com/)
- [Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools)

### Validation
- [HTML Validator](https://validator.w3.org/)
- [CSS Validator](https://jigsaw.w3.org/css-validator/)
- [WAVE Accessibility](https://wave.webaim.org/)

---

*Happy coding! 🚀*