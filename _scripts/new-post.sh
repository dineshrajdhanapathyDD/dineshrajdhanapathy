#!/bin/bash

# Blog Post Generator Shell Script
# Usage: ./scripts/new-post.sh "Your Post Title"

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅${NC} $1"
}

print_error() {
    echo -e "${RED}❌${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ️${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠️${NC} $1"
}

# Check if title is provided
if [ $# -eq 0 ]; then
    print_error "No post title provided"
    echo "Usage: $0 \"Your Post Title\""
    echo "Example: $0 \"Getting Started with Kubernetes\""
    exit 1
fi

# Get the post title
TITLE="$*"

# Check if we're in the right directory
if [ ! -f "_config.yml" ]; then
    print_error "Please run this script from the root of your Jekyll site"
    exit 1
fi

# Check if Ruby is available
if ! command -v ruby &> /dev/null; then
    print_error "Ruby is not installed or not in PATH"
    exit 1
fi

# Create directories if they don't exist
mkdir -p _posts
mkdir -p _scripts
mkdir -p _templates
mkdir -p assets/images/blog

print_info "Creating new blog post: $TITLE"

# Run the Ruby script
if ruby _scripts/new-post.rb "$TITLE"; then
    print_status "Blog post created successfully!"
    
    # Generate slug for image directory suggestion
    SLUG=$(echo "$TITLE" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/--*/-/g' | sed 's/^-\|-$//g')
    DATE=$(date +%Y-%m-%d)
    
    echo ""
    print_info "Recommended next steps:"
    echo "1. 📝 Edit your post: _posts/${DATE}-${SLUG}.md"
    echo "2. 🖼️  Add featured image: assets/images/blog/${SLUG}-featured.jpg"
    echo "3. 🏷️  Update categories and tags in the front matter"
    echo "4. ✍️  Write your content following the template structure"
    echo "5. 👀 Preview locally: bundle exec jekyll serve"
    echo "6. 🚀 Publish: git add . && git commit -m \"Add post: $TITLE\" && git push"
    
    echo ""
    print_info "Image recommendations:"
    echo "• Dimensions: 1200x630px (optimal for social sharing)"
    echo "• Format: JPG for photos, PNG for screenshots, SVG for diagrams"
    echo "• Optimize for web to reduce file size"
    echo "• Include descriptive alt text"
    
    echo ""
    print_info "SEO tips:"
    echo "• Keep title under 60 characters"
    echo "• Write compelling excerpt (150-160 characters)"
    echo "• Use relevant tags and categories"
    echo "• Include internal links to related posts"
    
else
    print_error "Failed to create blog post"
    exit 1
fi