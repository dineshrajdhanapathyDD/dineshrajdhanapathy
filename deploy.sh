#!/bin/bash

# Portfolio Website Deployment Script
# This script helps deploy your portfolio to GitHub Pages

echo "🚀 Portfolio Website Deployment Script"
echo "======================================"

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not initialized. Initializing now..."
    git init
    echo "✅ Git repository initialized"
fi

# Check if remote origin exists
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "❌ No remote origin found."
    echo "Please add your GitHub repository as remote origin:"
    echo "git remote add origin https://github.com/your-username/your-repository-name.git"
    exit 1
fi

echo "📋 Pre-deployment checks..."

# Check for required files
required_files=("index.html" "projects.html" "contact.html" "blog/index.html")
missing_files=()

for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        missing_files+=("$file")
    fi
done

if [ ${#missing_files[@]} -ne 0 ]; then
    echo "❌ Missing required files:"
    printf '%s\n' "${missing_files[@]}"
    exit 1
fi

echo "✅ All required files present"

# Check for assets
if [ ! -d "assets" ]; then
    echo "⚠️  Warning: assets directory not found"
else
    echo "✅ Assets directory found"
fi

# Add all files
echo "📦 Adding files to git..."
git add .

# Check if there are changes to commit
if git diff --staged --quiet; then
    echo "ℹ️  No changes to commit"
else
    # Commit changes
    echo "💾 Committing changes..."
    read -p "Enter commit message (or press Enter for default): " commit_message
    if [ -z "$commit_message" ]; then
        commit_message="Update portfolio website - $(date '+%Y-%m-%d %H:%M:%S')"
    fi
    git commit -m "$commit_message"
    echo "✅ Changes committed"
fi

# Push to GitHub
echo "🚀 Pushing to GitHub..."
if git push origin main; then
    echo "✅ Successfully pushed to GitHub!"
    
    # Get repository URL
    repo_url=$(git remote get-url origin)
    repo_name=$(basename "$repo_url" .git)
    username=$(basename $(dirname "$repo_url"))
    
    echo ""
    echo "🎉 Deployment Complete!"
    echo "======================================"
    echo "Your portfolio will be available at:"
    
    if [ "$repo_name" = "$username.github.io" ]; then
        echo "🌐 https://$username.github.io"
    else
        echo "🌐 https://$username.github.io/$repo_name"
    fi
    
    echo ""
    echo "📝 Next steps:"
    echo "1. Wait 5-10 minutes for GitHub Pages to build"
    echo "2. Check your repository settings to enable GitHub Pages if not already done"
    echo "3. Visit the URL above to see your live website"
    echo ""
    echo "🔧 To enable GitHub Pages:"
    echo "1. Go to your repository on GitHub"
    echo "2. Click Settings > Pages"
    echo "3. Select 'Deploy from a branch'"
    echo "4. Choose 'main' branch and '/ (root)' folder"
    echo "5. Click Save"
    
else
    echo "❌ Failed to push to GitHub"
    echo "Please check your internet connection and repository permissions"
    exit 1
fi