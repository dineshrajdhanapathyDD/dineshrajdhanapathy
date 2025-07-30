# Portfolio Website

A modern, responsive portfolio website built with Jekyll, HTML5, CSS3, and JavaScript, optimized for GitHub Pages deployment with enhanced content management and SEO features.

## Features

- 📱 Fully responsive design with mobile-first approach
- ⚡ Performance optimized with Jekyll build system
- 🎨 Modern CSS Grid and Flexbox layouts
- 🔍 SEO friendly with automated sitemap and meta tags
- ♿ Accessibility compliant (WCAG AA standards)
- 🚀 GitHub Pages ready with automated deployment
- 📝 Jekyll collections for organized project management
- 🔌 Plugin ecosystem for enhanced functionality
- 📨 Functional contact form with Formspree integration

## Recent Updates

- **2025-01-30**: Enhanced "How It Works" section with professional step-by-step visualization, colorful gradient step numbers, modern card design, and comprehensive accessibility features
- **2025-01-30**: Added comprehensive hero section styling for Cloud Certification Roadmap with gradient backgrounds, glass morphism effects, and responsive design
- **2025-01-30**: Implemented professional workflow navigation with visual progress indicators and mobile-optimized layout
- **2025-07-23**: Updated LinkedIn profile URL format from "dineshrajdhanapathy-25490058" to "dineshraj-dhanapathy-25490058" for consistent linking
- **2025-07-23**: Standardized URL formats by removing trailing slashes and IDs from social media links
- **2025-07-23**: Improved contact page link consistency for better user experience
- **2025-07-23**: Fixed LinkedIn profile URL in structured data (JSON-LD)

## Jekyll Configuration

This site uses Jekyll with the following key features:

### Collections

- **Projects Collection**: Organized project showcase with individual project pages
- Custom permalinks: `/projects/project-name/`
- Automatic project page generation

### Plugins

- `jekyll-feed`: RSS feed generation
- `jekyll-sitemap`: Automatic XML sitemap
- `jekyll-seo-tag`: Enhanced SEO meta tags

### Build Settings

- Markdown processor: Kramdown
- Syntax highlighter: Rouge
- Pretty permalinks for clean URLs

## Local Development

### Prerequisites

- Ruby 2.7+ (for Jekyll)
- Bundler gem

### Setup

1. Clone the repository

2. Install dependencies:

   ```bash
   bundle install
   ```

3. Serve locally:

   ```bash
   bundle exec jekyll serve
   ```

4. Open <http://localhost:4000>

### Alternative (Static Files)

For simple static file serving:

```bash
python -m http.server 8000
```

## Deployment

This site is configured for automatic deployment to GitHub Pages using GitHub Actions.

### Setup GitHub Pages

1. Push your code to a GitHub repository
2. Go to repository Settings > Pages
3. Set Source to "GitHub Actions"
4. The site will automatically deploy on push to main branch

### Manual Deployment

If you prefer manual deployment:

1. Build the site: `bundle exec jekyll build`
2. Deploy the `_site` folder contents

## Project Structure

```text
├── index.html              # Landing page
├── projects.html           # Portfolio showcase
├── contact.html            # Contact form with Formspree integration
├── certification-roadmap.html # Cloud certification planning tool
├── assets/
│   ├── css/               # Stylesheets
│   │   ├── certification-roadmap/ # Certification roadmap styles
│   │   │   ├── hero.css   # Hero section and main layout
│   │   │   └── [other modules] # Component-specific styles
│   ├── js/                # JavaScript files
│   └── images/            # Images and media
├── _config.yml            # Jekyll configuration
└── .github/workflows/     # GitHub Actions
```

## Cloud Certification Roadmap Styling

The certification roadmap features modern, professional styling with:

- **Hero Section**: Beautiful gradient background with grid pattern overlay and glass morphism effects
- **How It Works Section**: Professional step-by-step process visualization with:
  - Colorful gradient step numbers (unique color for each step: green, cyan, blue, purple, orange)
  - Modern card design with hover effects and backdrop blur
  - Connection lines between steps on desktop
  - Detailed step descriptions with cloud provider mentions (AWS, Azure, GCP)
  - Benefits section highlighting key features (personalized approach, privacy-first, mobile-friendly)
  - Enhanced animations including pulse effects and smooth transitions
  - Full accessibility support with keyboard navigation and screen reader compatibility
- **Complete AWS Certifications Database**: Comprehensive database with all 12 current AWS certifications:
  - **All Certification Levels**: Foundational, Associate, Professional, and Specialty certifications
  - **Detailed Exam Information**: Current exam codes, pricing, duration, questions, and passing scores
  - **Multi-Language Support**: Up to 11 languages available for foundational certifications
  - **Domain Breakdown**: Percentage weights for each exam domain area
  - **Career Guidance**: Target job roles, prerequisites, and next steps for each certification
  - **Study Path Recommendations**: Pre-defined career paths with time and cost estimates
- **Roadmap Data Architecture**: Comprehensive data structure for certification paths:
  - **Multi-Provider Support**: AWS, Azure, and GCP certification paths
  - **Skill-Level Adaptation**: Beginner, intermediate, and advanced tracks
  - **Career Path Focus**: Currently supports Cloud Architect path with extensible architecture
  - **Certification Metadata**: Order, requirements, estimated timelines, and salary projections
  - **Modular Design**: Easy to extend with additional career paths and providers
- **Responsive Design**: Mobile-first approach with CSS Grid layouts that adapt across all screen sizes
- **Interactive Elements**: Smooth hover animations and transitions with accessibility considerations
- **Workflow Navigation**: Visual progress indicators with numbered steps and state management
- **Accessibility**: High contrast mode support, reduced motion preferences, and WCAG compliance

## Contact Form

The contact form uses Formspree for handling form submissions:

- Integrated with Formspree service (https://formspree.io/f/xpwlpyyv)
- Form submissions are sent directly to the owner's email
- Custom redirect after submission to a success page
- CAPTCHA protection disabled for better user experience
- Honeypot field implemented to prevent spam
- Client-side validation for immediate user feedback
- Maintains accessibility features and validation
- No server-side code required, works with GitHub Pages hosting

## URL Format Standards

To maintain consistency across the site, the following URL format standards are applied:

- External links do not include trailing slashes (e.g., `https://example.com/page`)
- Internal links use relative paths when possible
- Social media profile links follow platform-specific format requirements
- All URLs are regularly validated to ensure they remain active

## Performance

- Lighthouse score target: 90+ for all metrics
- Mobile-first responsive design
- Optimized images and assets
- Minimal JavaScript for fast loading

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is open source and available under the [MIT License](LICENSE).