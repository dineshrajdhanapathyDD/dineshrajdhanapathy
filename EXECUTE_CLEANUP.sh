#!/bin/bash

# COMPREHENSIVE PORTFOLIO CLEANUP SCRIPT
# This script will clean up all unnecessary files and organize the project properly

echo "🧹 STARTING COMPREHENSIVE PORTFOLIO CLEANUP..."
echo "⚠️  This will DELETE many files. Make sure you have a backup!"
echo ""

# Confirm before proceeding
read -p "Are you sure you want to proceed? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Cleanup cancelled."
    exit 1
fi

echo "🗑️  DELETING UNNECESSARY FILES..."

# Delete debug/test files
echo "📝 Removing debug and test files..."
rm -f blog-debug.html
rm -f blog-test.html
rm -f blog-working-test.html
rm -f test.html
rm -f debug.html
rm -f BLOG_FIXED_VERIFICATION.html

# Delete temporary documentation
echo "📚 Removing temporary documentation..."
rm -f BLOG_FINAL_FIX.md
rm -f BLOG_FIX_SUMMARY.md
rm -f BLOG_IMPLEMENTATION_SUMMARY.md
rm -f BLOG_LAYOUT_SIMPLIFICATION.md
rm -f BLOG_TROUBLESHOOTING.md
rm -f PRODUCTION_DEPLOYMENT_REPORT.md
rm -f using-kiro-for-web-development.md

# Delete Jekyll files
echo "🔧 Removing Jekyll files..."
rm -f _config.yml
rm -f _config_performance.yml
rm -f Gemfile
rm -f feed.xml
rm -f feed.json

# Delete Jekyll directories
echo "📁 Removing Jekyll directories..."
rm -rf _includes/
rm -rf _layouts/
rm -rf _plugins/
rm -rf _posts/
rm -rf _scripts/
rm -rf _templates/
rm -rf _test/

echo "📁 ORGANIZING REMAINING FILES..."

# Move STRUCTURE_SUMMARY.md to docs folder
if [ -f "STRUCTURE_SUMMARY.md" ]; then
    echo "📝 Moving STRUCTURE_SUMMARY.md to docs folder..."
    mv STRUCTURE_SUMMARY.md docs/
fi

# Create .gitignore if it doesn't exist
if [ ! -f .gitignore ]; then
    echo "📝 Creating .gitignore file..."
    cat > .gitignore << 'EOL'
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

# Cleanup files
CLEANUP_PLAN.md
EXECUTE_CLEANUP.sh
EOL
fi

echo ""
echo "✨ CLEANUP COMPLETED!"
echo ""
echo "📊 FINAL STRUCTURE:"
echo "Root directory now contains:"
ls -la | grep -E '^-' | wc -l | xargs echo "📄 Files:"
ls -la | grep -E '^d' | wc -l | xargs echo "📁 Directories:"
echo ""
echo "🎯 Root files should now be:"
echo "   • Core HTML pages (8 files)"
echo "   • Configuration files (5 files)"
echo "   • Essential directories only"
echo ""
echo "🚀 Your portfolio is now clean and organized!"
echo "💡 You can now delete CLEANUP_PLAN.md and EXECUTE_CLEANUP.sh"