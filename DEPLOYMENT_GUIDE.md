# 🚀 GitHub Pages Deployment Guide

This guide will help you upload your portfolio website to GitHub and deploy it using GitHub Pages.

## 📋 Prerequisites

Before you start, make sure you have:
- A GitHub account
- Git installed on your computer
- Your portfolio website files ready

## 🔧 Step 1: Prepare Your Repository

### Option A: Create New Repository on GitHub
1. Go to [GitHub.com](https://github.com)
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Name your repository (e.g., `portfolio-website` or `your-username.github.io`)
5. Make it **Public** (required for free GitHub Pages)
6. **Don't** initialize with README, .gitignore, or license (we already have these)
7. Click "Create repository"

### Option B: Use Your Username Repository (Recommended)
For a personal portfolio, create a repository named `your-username.github.io`:
- Replace `your-username` with your actual GitHub username
- This will make your site available at `https://your-username.github.io`

## 🔧 Step 2: Initialize Git Repository

Open terminal/command prompt in your `portfolio-website` folder and run:

```bash
# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial portfolio website commit"

# Add your GitHub repository as remote origin
git remote add origin https://github.com/your-username/your-repository-name.git

# Push to GitHub
git push -u origin main
```

**Replace:**
- `your-username` with your GitHub username
- `your-repository-name` with your repository name

## 🔧 Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on **Settings** tab
3. Scroll down to **Pages** section (in the left sidebar)
4. Under **Source**, select:
   - **Deploy from a branch**
   - Branch: **main**
   - Folder: **/ (root)**
5. Click **Save**

## 🔧 Step 4: Configure Custom Domain (Optional)

If you have a custom domain:

1. In your repository, create a file named `CNAME` (no extension)
2. Add your domain name (e.g., `yourname.com`)
3. Configure your domain's DNS settings:
   - Add a CNAME record pointing to `your-username.github.io`
   - Or add A records pointing to GitHub's IP addresses

## 🔧 Step 5: Verify Deployment

1. GitHub will provide a URL like:
   - `https://your-username.github.io/repository-name` (for regular repos)
   - `https://your-username.github.io` (for username.github.io repos)

2. Wait 5-10 minutes for deployment to complete
3. Visit your URL to see your live website!

## 🔧 Step 6: Update Your Website

To make changes to your live website:

```bash
# Make your changes to the files
# Then commit and push:

git add .
git commit -m "Update website content"
git push origin main
```

Changes will be live within a few minutes.

## 🛠️ Troubleshooting

### Common Issues:

1. **404 Error**: 
   - Check that `index.html` is in the root directory
   - Verify GitHub Pages is enabled in repository settings

2. **CSS/JS Not Loading**:
   - Ensure all file paths are relative (no leading `/`)
   - Check that all files are committed and pushed

3. **Blog Not Working**:
   - Verify `blog/index.html` exists
   - Check that all blog post files are in `blog/posts/`

4. **Images Not Loading**:
   - Verify image files are in `assets/images/`
   - Check file names match exactly (case-sensitive)

### File Structure Check:
```
portfolio-website/
├── index.html              ✅ Must be in root
├── projects.html           ✅ Must be in root  
├── contact.html            ✅ Must be in root
├── blog/
│   └── index.html          ✅ Blog homepage
├── assets/
│   ├── css/
│   ├── js/
│   └── images/
└── README.md
```

## 🎯 Quick Commands Reference

```bash
# Clone your repository (if working from new computer)
git clone https://github.com/your-username/your-repository-name.git

# Check status
git status

# Add all changes
git add .

# Commit changes
git commit -m "Your commit message"

# Push to GitHub
git push origin main

# Pull latest changes
git pull origin main
```

## 🔒 Security Notes

- Never commit sensitive information (API keys, passwords)
- Your repository is public, so all code is visible
- Use environment variables for any sensitive configuration

## 📊 Analytics Setup (Optional)

After deployment, you can add:
1. **Google Analytics** - Add tracking code to all HTML files
2. **Google Search Console** - Submit your sitemap
3. **Social Media Meta Tags** - Already included in your files

## 🎉 Success!

Once deployed, your portfolio will be live at:
- `https://your-username.github.io/repository-name`
- Or `https://your-username.github.io` (for username repos)

## 📞 Need Help?

If you encounter issues:
1. Check GitHub Pages documentation
2. Verify all files are committed and pushed
3. Check repository settings
4. Wait a few minutes for changes to propagate

Your professional portfolio is now live on the internet! 🚀