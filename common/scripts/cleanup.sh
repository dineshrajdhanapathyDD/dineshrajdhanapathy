#!/bin/bash

# Portfolio Website Cleanup Script
# This script removes unnecessary files and organizes the project structure

echo "🧹 Starting project cleanup..."

# Remove unnecessary blog debug files
echo "📝 Removing blog debug files..."
rm -f blog-debug.html
rm -f blog-test.html
rm -f blog-working-test.html
rm -f test.html
rm -f debug.html

# Remove temporary documentation files
echo "📚 Removing temporary documentation files..."
rm -f BLOG_*.md
rm -f BLOG_*.html
rm -f PRODUCTION_DEPLOYMENT_REPORT.md
rm -f using-kiro-for-web-development.md

# Remove Jekyll-specific files (if not using Jekyll)
echo "🔧 Removing Jekyll files..."
rm -f _config.yml
rm -f _config_performance.yml
rm -f Gemfile
rm -f feed.xml
rm -f feed.json

# Remove unnecessary directories
echo "📁 Removing unnecessary directories..."
rm -rf _includes/
rm -rf _layouts/
rm -rf _plugins/
rm -rf _posts/
rm -rf _scripts/
rm -rf _templates/
rm -rf _test/

# Create .gitignore if it doesn't exist
if [ ! -f .gitignore ]; then
    echo "📝 Creating .gitignore file..."
    cat > .gitignore << EOL
# Development files
*.log
*.tmp
.DS_Store
Thumbs.db

# Editor files
.vscode/
.idea/
*.swp
*.swo

# Node modules (if using build tools)
node_modules/
npm-debug.log*

# Build outputs
dist/
build/

# Environment files
.env
.env.local

# Temporary files
temp/
tmp/
EOL
fi

echo "✨ Cleanup completed!"
echo "📊 Project structure has been organized and unnecessary files removed."