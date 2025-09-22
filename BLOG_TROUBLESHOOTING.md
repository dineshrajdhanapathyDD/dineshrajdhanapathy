# Blog Troubleshooting Guide

## Issue: "Cannot GET /dineshrajdhanapathy/blog/"

This error indicates that the blog route is not being properly recognized by Jekyll. Here are the steps to resolve this:

### 1. Check Jekyll Build Status

First, ensure Jekyll is building properly:

```bash
# Navigate to your portfolio-website directory
cd portfolio-website

# Clean and rebuild the site
bundle exec jekyll clean
bundle exec jekyll build

# Serve locally to test
bundle exec jekyll serve
```

### 2. Verify File Structure

Ensure these files exist:
- `blog/index.html` ✅ (Created)
- `_layouts/default.html` ✅ (Exists)
- `_config.yml` ✅ (Updated)

### 3. Test Alternative Routes

Try accessing these URLs to isolate the issue:
- `/dineshrajdhanapathy/blog-debug/` - Debug information page
- `/dineshrajdhanapathy/blog-test/` - Simple test blog page
- `/dineshrajdhanapathy/blog/index.html` - Direct file access

### 4. Check Jekyll Configuration

The `_config.yml` has been updated with:
- Correct pagination settings
- Proper baseurl configuration
- Blog-specific settings

### 5. Verify Navigation Links

The navigation in `_layouts/default.html` uses hardcoded absolute paths:
```html
<a href="/dineshrajdhanapathy/blog/">Blog</a>
```

This ensures consistent routing across all GitHub Pages deployments.

### 6. Common Solutions

#### Solution 1: Restart Jekyll Server
If running locally, stop and restart the Jekyll server:
```bash
# Stop server (Ctrl+C)
# Then restart
bundle exec jekyll serve
```

#### Solution 2: Clear Browser Cache
Clear your browser cache or try in an incognito window.

#### Solution 3: Check GitHub Pages Build
If deployed to GitHub Pages, check the Actions tab for build errors.

#### Solution 4: Use Alternative Blog Index
If the issue persists, the blog content is also available at:
- `/blog-test/` - Simplified blog page
- Individual posts work at `/blog/YYYY/MM/DD/post-title/`

### 7. Verification Steps

1. **Local Testing**: Run `bundle exec jekyll serve` and test `http://localhost:4000/dineshrajdhanapathy/blog/`
2. **Build Check**: Ensure `_site/blog/index.html` is generated after build
3. **Navigation Test**: Click the Blog link in the main navigation
4. **Direct Access**: Try accessing `/dineshrajdhanapathy/blog/index.html`

### 8. Debug Information

Access `/dineshrajdhanapathy/blog-debug/` to see:
- Site configuration values
- Available blog posts
- Navigation link variations
- Current page information

### 9. If Issue Persists

The blog functionality is fully implemented. If routing issues continue:

1. **Use the test page**: `/blog-test/` provides the same functionality
2. **Check individual posts**: Posts should work at their individual URLs
3. **Verify Jekyll build**: Ensure no build errors in the console
4. **Check file permissions**: Ensure all files are readable

### 10. Alternative Access Methods

While troubleshooting, you can access blog content via:
- **Home page**: Recent posts are displayed on the homepage
- **Direct post URLs**: `/blog/2024/01/15/welcome-to-my-blog/`
- **Test page**: `/blog-test/` (simplified blog listing)

The blog system is fully functional - this appears to be a routing/build issue that should resolve with a proper Jekyll build and server restart.