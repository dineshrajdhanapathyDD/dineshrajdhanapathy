# Project Structure Guide

This document outlines the organized structure of the portfolio website project.

## 📁 Directory Structure

```
portfolio-website/
├── 📄 Core Pages
│   ├── index.html                 # Homepage
│   ├── projects.html              # Projects showcase
│   ├── contact.html               # Contact page
│   ├── certification-roadmap.html # Certification roadmap
│   ├── resume-match.html          # Resume matching tool
│   └── 404.html                   # Error page
│
├── 📁 assets/                     # Static Assets
│   ├── 📁 css/                    # Stylesheets
│   │   ├── main.css               # Main styles
│   │   ├── blog.css               # Blog styles
│   │   ├── reset.css              # CSS reset
│   │   └── accessibility.css      # Accessibility styles
│   ├── 📁 js/                     # JavaScript
│   │   ├── main.js                # Main functionality
│   │   ├── blog.js                # Blog functionality
│   │   └── accessibility.js       # Accessibility features
│   ├── 📁 images/                 # Images
│   │   ├── 📁 profile/            # Profile photos
│   │   ├── 📁 projects/           # Project screenshots
│   │   └── 📁 blog/               # Blog images
│   └── 📁 documents/              # Downloads
│       └── Dineshraj_Dhanapathy_CV.pdf
│
├── 📁 blog/                       # Blog Section
│   ├── index.html                 # Blog homepage
│   └── 📁 posts/                  # Blog posts
│       ├── welcome-to-my-blog.html
│       ├── aws-best-practices.html
│       └── kubernetes-deployment-strategies.html
│
├── 📁 common/                     # Common Utilities
│   ├── 📁 scripts/                # Utility scripts
│   │   ├── deployment.sh          # Deployment script
│   │   └── cleanup.sh             # Cleanup script
│   ├── 📁 templates/              # Templates
│   │   ├── blog-post-template.md  # Blog post template
│   │   └── page-template.html     # Page template
│   └── 📁 miscellaneous/          # Other resources
│       ├── README.md              # Misc folder guide
│       ├── 📁 deployment-scripts/ # Deployment utilities
│       └── 📁 templates/          # Additional templates
│
├── 📁 docs/                       # Documentation
│   ├── PROJECT_STRUCTURE.md       # This file
│   ├── BLOG_COMPONENTS.md         # Blog documentation
│   ├── PERFORMANCE_GUIDE.md       # Performance guide
│   └── *.md                       # Other documentation
│
└── 📄 Configuration Files
    ├── README.md                   # Main documentation
    ├── sitemap.xml                 # SEO sitemap
    ├── robots.txt                  # Search engine directives
    ├── site.webmanifest            # PWA manifest
    ├── sw.js                       # Service worker
    └── .gitignore                  # Git ignore rules
```

## 🎯 File Organization Principles

### 1. **Separation of Concerns**
- HTML files in root for easy access
- CSS files grouped by functionality
- JavaScript files organized by feature
- Images categorized by usage

### 2. **Logical Grouping**
- Related files are kept together
- Common utilities in dedicated folder
- Documentation centralized
- Templates and scripts organized

### 3. **Scalability**
- Easy to add new pages
- Simple to extend functionality
- Clear naming conventions
- Modular structure

## 📝 File Naming Conventions

### HTML Files
- Use lowercase with hyphens: `contact.html`
- Descriptive names: `certification-roadmap.html`
- Keep in root directory for simplicity

### CSS Files
- Feature-based naming: `blog.css`, `main.css`
- Use lowercase with hyphens
- Group related styles in single files

### JavaScript Files
- Functionality-based: `blog.js`, `main.js`
- Use camelCase for variables and functions
- Keep files focused on specific features

### Images
- Descriptive names: `profile-photo.jpg`
- Include dimensions if needed: `hero-1200x600.jpg`
- Use appropriate formats: `.jpg` for photos, `.png` for graphics

## 🔧 Development Workflow

### Adding New Pages
1. Create HTML file in root directory
2. Follow the template in `common/templates/page-template.html`
3. Add navigation links to all existing pages
4. Update sitemap.xml

### Adding Blog Posts
1. Create HTML file in `blog/posts/`
2. Use template in `common/templates/blog-post-template.md`
3. Add preview to `blog/index.html`
4. Update blog navigation if needed

### Modifying Styles
1. Edit appropriate CSS file in `assets/css/`
2. Test across different browsers
3. Ensure responsive design works
4. Validate accessibility

### Adding JavaScript Features
1. Add to appropriate JS file in `assets/js/`
2. Follow existing code patterns
3. Test functionality thoroughly
4. Ensure accessibility compliance

## 🚀 Deployment Process

### Pre-deployment Checklist
- [ ] Run cleanup script: `./common/scripts/cleanup.sh`
- [ ] Test all functionality
- [ ] Validate HTML/CSS
- [ ] Check responsive design
- [ ] Verify accessibility
- [ ] Update documentation

### Deployment Steps
1. Run deployment script: `./common/scripts/deployment.sh`
2. Push to GitHub repository
3. Verify GitHub Pages deployment
4. Test live website
5. Monitor performance

## 📊 Maintenance

### Regular Tasks
- Update CV/resume file
- Add new blog posts
- Update project showcase
- Review and update documentation
- Monitor website performance

### File Management
- Remove unused files regularly
- Optimize images for web
- Minify CSS/JS for production
- Keep documentation up to date

## 🔍 Troubleshooting

### Common Issues
- **Missing files**: Check file paths and case sensitivity
- **Broken links**: Verify all internal links
- **CSS not loading**: Check file paths and MIME types
- **JavaScript errors**: Check browser console for errors

### Debug Tools
- Browser developer tools
- HTML validators
- CSS validators
- Accessibility checkers
- Performance auditors

## 📚 Resources

### Documentation
- [HTML5 Specification](https://html.spec.whatwg.org/)
- [CSS Grid Guide](https://css-tricks.com/snippets/css/complete-guide-grid/)
- [JavaScript Best Practices](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)

### Tools
- VS Code with Live Server
- Browser developer tools
- Git for version control
- GitHub Pages for hosting

---

*This structure is designed to be maintainable, scalable, and developer-friendly while keeping the project organized and professional.*