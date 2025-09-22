# Blog Content Management Guide

This guide provides comprehensive instructions for creating, managing, and publishing blog posts on the portfolio website.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Blog Post Structure](#blog-post-structure)
3. [Front Matter Configuration](#front-matter-configuration)
4. [Content Writing Guidelines](#content-writing-guidelines)
5. [Image Management](#image-management)
6. [SEO Optimization](#seo-optimization)
7. [Publishing Workflow](#publishing-workflow)
8. [Content Maintenance](#content-maintenance)

## Getting Started

### Prerequisites

- Basic understanding of Markdown syntax
- Access to the portfolio website repository
- Text editor (VS Code, Sublime Text, etc.)
- Git for version control

### File Naming Convention

Blog posts must follow Jekyll's naming convention:

```
YYYY-MM-DD-post-title-slug.md
```

**Examples:**
- `2024-01-15-getting-started-with-kubernetes.md`
- `2024-02-20-aws-lambda-best-practices.md`
- `2024-03-10-devops-automation-tools.md`

### Directory Structure

```
portfolio-website/
├── _posts/                    # Blog posts directory
├── _templates/               # Post templates
├── assets/images/blog/       # Blog images
├── docs/                     # Documentation
└── _drafts/                  # Draft posts (optional)
```

## Blog Post Structure

### Required Sections

Every blog post should include:

1. **Front Matter** - YAML configuration at the top
2. **Title** - Clear, descriptive H1 heading
3. **Introduction** - Hook and overview
4. **Excerpt Separator** - `<!--more-->` tag
5. **Main Content** - Organized with headings
6. **Conclusion** - Key takeaways
7. **Call to Action** - Next steps or engagement

### Template Usage

1. Copy the template from `_templates/blog-post-template.md`
2. Rename following the naming convention
3. Update all placeholder content
4. Save in the `_posts/` directory

**Note**: The blog index now uses the simplified `blog-simple` layout for improved performance and cleaner presentation while maintaining all core functionality.

## Front Matter Configuration

### Required Fields

```yaml
---
layout: post                    # Always 'post' for blog posts
title: "Your Post Title"       # Main title (50-60 characters ideal)
date: 2024-01-15 10:00:00 -0500 # Publication date and time
categories: [technology, cloud] # Broad categories (1-3 recommended)
tags: [aws, devops, tutorial]  # Specific tags (3-8 recommended)
excerpt: "Brief description"   # 1-2 sentences, used in previews
author: "Dineshraj Dhanapathy" # Author name
---
```

### Optional Fields

```yaml
# SEO Optimization
seo_title: "Custom SEO Title | Site Name"     # Override default title
seo_description: "Custom meta description"    # Override excerpt for SEO
canonical_url: "https://original-site.com"    # For cross-posted content

# Images
image: "/assets/images/blog/featured.jpg"     # Featured image path
image_alt: "Descriptive alt text"             # Alt text for accessibility

# Content Management
draft: false                    # Set to true for unpublished posts
featured: false                 # Set to true for featured posts
reading_time: 5                 # Manual override (auto-calculated if omitted)
last_modified_at: 2024-01-20    # For updated posts

# Advanced
lang: en                        # Language code (default: en)
redirect_from:                  # For URL redirects
  - /old-url/
  - /another-old-url/
```

### Categories and Tags Guidelines

**Categories** (broad topics):
- `technology` - General tech content
- `cloud` - Cloud computing topics
- `devops` - DevOps practices and tools
- `tutorial` - Step-by-step guides
- `opinion` - Personal insights and opinions

**Tags** (specific topics):
- Use lowercase
- Separate words with hyphens
- Be specific and relevant
- Include technology names: `aws`, `kubernetes`, `docker`
- Include post types: `tutorial`, `guide`, `tips`, `best-practices`

## Content Writing Guidelines

### Writing Style

- **Tone**: Professional but approachable
- **Voice**: First person when sharing experiences
- **Length**: 800-2000 words for most posts
- **Structure**: Use clear headings and subheadings

### Markdown Best Practices

#### Headings

```markdown
# H1 - Post Title (only one per post)
## H2 - Main Sections
### H3 - Subsections
#### H4 - Sub-subsections (use sparingly)
```

#### Code Blocks

Always specify the language for syntax highlighting:

```markdown
```bash
kubectl get pods
```

```yaml
apiVersion: v1
kind: Pod
```

```javascript
const config = { name: 'app' };
```
```

#### Lists

Use numbered lists for sequential steps:

```markdown
1. First step
2. Second step
3. Third step
```

Use bullet points for non-sequential items:

```markdown
- Feature A
- Feature B
- Feature C
```

#### Links and References

- Use descriptive link text
- Link to authoritative sources
- Include relevant internal links
- Open external links in new tabs when appropriate

#### Emphasis

- **Bold** for important terms and concepts
- *Italic* for subtle emphasis
- `Code` for technical terms and commands

### Content Structure Template

```markdown
# Engaging Title

Brief introduction that hooks the reader and explains what they'll learn.

<!--more-->

## What You'll Learn
- Key point 1
- Key point 2
- Key point 3

## Background/Context
Provide necessary background information.

## Main Content Section 1
### Subsection
Detailed explanation with examples.

## Main Content Section 2
### Implementation
Step-by-step instructions.

## Best Practices
Key recommendations and tips.

## Common Pitfalls
What to avoid and troubleshooting.

## Conclusion
- Summarize key points
- Provide next steps
- Include call to action
```

## Image Management

### Image Guidelines

- **Format**: JPG for photos, PNG for screenshots, SVG for diagrams
- **Size**: Maximum 1200px width for featured images
- **Optimization**: Compress images for web
- **Alt Text**: Always provide descriptive alt text

### Directory Structure

```
assets/images/blog/
├── 2024/
│   ├── 01/
│   │   ├── kubernetes-tutorial/
│   │   │   ├── featured.jpg
│   │   │   ├── diagram-1.png
│   │   │   └── screenshot-1.png
│   │   └── aws-guide/
│   └── 02/
└── default-post.svg          # Fallback image
```

### Featured Images

- **Dimensions**: 1200x630px (optimal for social sharing)
- **File naming**: Use descriptive names
- **Location**: `/assets/images/blog/YYYY/MM/post-slug/`

### Image Optimization

1. **Compress images** using tools like TinyPNG
2. **Use appropriate formats**:
   - JPEG for photographs
   - PNG for screenshots with text
   - SVG for simple graphics and diagrams
3. **Provide WebP versions** when possible
4. **Include alt text** for accessibility

## SEO Optimization

### Title Optimization

- **Length**: 50-60 characters
- **Keywords**: Include primary keyword near the beginning
- **Clarity**: Make it clear and compelling
- **Uniqueness**: Avoid duplicate titles

### Meta Description

- **Length**: 150-160 characters
- **Keywords**: Include relevant keywords naturally
- **Action**: Include a call to action
- **Accuracy**: Accurately describe the content

### URL Structure

URLs are automatically generated from the filename:
- `2024-01-15-kubernetes-tutorial.md` → `/blog/2024/01/15/kubernetes-tutorial/`

### Internal Linking

- Link to related posts
- Use descriptive anchor text
- Create topic clusters
- Update old posts with links to new content

### Schema Markup

The blog automatically includes structured data for:
- Article schema
- Author information
- Publication dates
- Reading time
- Images

## Publishing Workflow

### Development Process

1. **Create Draft**
   ```bash
   # Create new post file
   touch _posts/2024-01-15-new-post-title.md
   
   # Or use template
   cp _templates/blog-post-template.md _posts/2024-01-15-new-post-title.md
   ```

2. **Write Content**
   - Use the template as a starting point
   - Follow content guidelines
   - Add images and optimize them

3. **Preview Locally**
   ```bash
   # Serve Jekyll site locally
   bundle exec jekyll serve
   
   # View at http://localhost:4000
   ```

4. **Review Checklist**
   - [ ] Front matter complete and accurate
   - [ ] Excerpt separator (`<!--more-->`) included
   - [ ] Images optimized and alt text added
   - [ ] Links working and relevant
   - [ ] SEO title and description optimized
   - [ ] Grammar and spelling checked
   - [ ] Code examples tested

5. **Publish**
   ```bash
   git add .
   git commit -m "Add new blog post: Post Title"
   git push origin main
   ```

### Draft Management

For unpublished posts, you can:

1. **Use draft flag**:
   ```yaml
   draft: true
   ```

2. **Use _drafts folder**:
   ```
   _drafts/
   └── upcoming-post.md
   ```

3. **Future dating**:
   ```yaml
   date: 2024-12-31 10:00:00 -0500  # Future date
   ```

## Content Maintenance

### Regular Tasks

#### Monthly Review
- Check for broken links
- Update outdated information
- Review analytics for popular content
- Plan new content based on performance

#### Quarterly Audit
- Update author bio and links
- Review and update categories/tags
- Optimize underperforming posts
- Archive or redirect obsolete content

#### Annual Review
- Comprehensive SEO audit
- Update copyright dates
- Review and update content strategy
- Archive very old content if necessary

### Content Updates

When updating existing posts:

1. **Update front matter**:
   ```yaml
   last_modified_at: 2024-01-20 10:00:00 -0500
   ```

2. **Add update note**:
   ```markdown
   > **Update (January 2024)**: This post has been updated to reflect the latest changes in Kubernetes 1.28.
   ```

3. **Maintain URL structure** to preserve SEO value

### Performance Monitoring

Track these metrics:
- Page views and unique visitors
- Time on page and bounce rate
- Social shares and engagement
- Search engine rankings
- Internal link clicks

### Backup and Version Control

- All content is version controlled with Git
- Regular backups of the entire repository
- Tag releases for major site updates
- Maintain changelog for significant changes

## Troubleshooting

### Common Issues

#### Build Errors
```bash
# Check Jekyll build
bundle exec jekyll build --verbose

# Common fixes:
# - Check YAML front matter syntax
# - Verify file encoding (UTF-8)
# - Check for special characters in filenames
```

#### Image Issues
- Verify image paths are correct
- Check file permissions
- Ensure images are optimized for web
- Validate alt text is present

#### SEO Issues
- Use tools like Google Search Console
- Check meta tag generation
- Verify structured data with Google's Rich Results Test
- Monitor search rankings

## Error Handling

The blog includes a comprehensive error handling system that provides graceful degradation and user-friendly error messages.

### Error Types Supported

- **Image Errors**: Automatic fallback to default images when featured images fail to load
- **Post Not Found**: User-friendly 404-style messages for missing blog posts
- **Search Errors**: Fallback messaging when search functionality is unavailable
- **RSS Feed Errors**: Graceful handling of feed generation issues
- **JavaScript Disabled**: Notices for users with JavaScript disabled
- **Loading States**: Visual indicators during content loading
- **Network Errors**: Online/offline status detection and messaging

### Using Error Handling

The error handling component can be included in templates:

```liquid
{% include error-handling.html type="image" fallback="default-post.svg" %}
{% include error-handling.html type="post-not-found" message="Custom error message" %}
{% include error-handling.html type="loading" id="content-loader" %}
```

### Automatic Features

- **Image Fallbacks**: Automatically handles failed image loads with JavaScript
- **Network Detection**: Shows/hides network error messages based on connection status
- **Responsive Design**: Error states adapt to mobile and desktop layouts
- **Accessibility**: All error states include proper ARIA labels and semantic markup

### Getting Help

- Check Jekyll documentation: https://jekyllrb.com/docs/
- Review GitHub Pages documentation
- Search existing issues in the repository
- Contact the development team

---

## Quick Reference

### File Locations
- **Posts**: `_posts/YYYY-MM-DD-title.md`
- **Images**: `assets/images/blog/`
- **Templates**: `_templates/`
- **Drafts**: `_drafts/` (optional)

### Essential Commands
```bash
# Create new post
cp _templates/blog-post-template.md _posts/$(date +%Y-%m-%d)-new-post.md

# Serve locally
bundle exec jekyll serve

# Build for production
bundle exec jekyll build

# Check for issues
bundle exec jekyll doctor
```

### Key Reminders
- Always include excerpt separator `<!--more-->`
- Optimize images before uploading
- Use descriptive alt text for accessibility
- Include relevant internal and external links
- Preview locally before publishing
- Follow SEO best practices for titles and descriptions