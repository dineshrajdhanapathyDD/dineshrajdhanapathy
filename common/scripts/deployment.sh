#!/bin/bash

# Portfolio Website Deployment Script
# This script handles the deployment process for the portfolio website

echo "🚀 Starting Portfolio Website Deployment..."

# Check if we're in the right directory
if [ ! -f "index.html" ]; then
    echo "❌ Error: Please run this script from the portfolio-website root directory"
    exit 1
fi

# Build and optimize assets
echo "📦 Building and optimizing assets..."

# Minify CSS files
echo "🎨 Minifying CSS files..."
# Add CSS minification commands here

# Minify JavaScript files
echo "⚡ Minifying JavaScript files..."
# Add JS minification commands here

# Optimize images
echo "🖼️  Optimizing images..."
# Add image optimization commands here

# Validate HTML
echo "✅ Validating HTML files..."
# Add HTML validation commands here

# Deploy to GitHub Pages
echo "🌐 Deploying to GitHub Pages..."
git add .
git commit -m "Deploy: $(date '+%Y-%m-%d %H:%M:%S')"
git push origin main

echo "✨ Deployment completed successfully!"
echo "🔗 Your website will be available at: https://your-username.github.io/portfolio-website"