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
- 📨 Functional contact form with direct email integration (mailto: protocol)

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

```
├── index.html              # Landing page
├── projects.html           # Portfolio showcase
├── contact.html            # Contact form with mailto protocol
├── assets/
│   ├── css/               # Stylesheets
│   ├── js/                # JavaScript files
│   └── images/            # Images and media
├── _config.yml            # Jekyll configuration
└── .github/workflows/     # GitHub Actions
```

## Contact Form

The contact form has been updated to use the `mailto:` protocol instead of Formspree:

- Uses HTML5 `mailto:` protocol to open the user's default email client
- Form data is pre-populated in the email body using `enctype="text/plain"`
- Subject line is pre-filled with "New Portfolio Contact Form Submission"
- No third-party dependencies or API keys required
- Works without JavaScript enabled
- Provides immediate feedback to users

Note: This approach requires the visitor to have an email client configured on their device.

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