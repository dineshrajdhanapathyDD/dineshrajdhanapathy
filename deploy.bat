@echo off
REM Portfolio Website Deployment Script for Windows
REM This script helps deploy your portfolio to GitHub Pages

echo 🚀 Portfolio Website Deployment Script
echo ======================================

REM Check if git is initialized
if not exist ".git" (
    echo ❌ Git repository not initialized. Initializing now...
    git init
    echo ✅ Git repository initialized
)

REM Check if remote origin exists
git remote get-url origin >nul 2>&1
if errorlevel 1 (
    echo ❌ No remote origin found.
    echo Please add your GitHub repository as remote origin:
    echo git remote add origin https://github.com/your-username/your-repository-name.git
    pause
    exit /b 1
)

echo 📋 Pre-deployment checks...

REM Check for required files
if not exist "index.html" (
    echo ❌ Missing index.html
    pause
    exit /b 1
)

if not exist "projects.html" (
    echo ❌ Missing projects.html
    pause
    exit /b 1
)

if not exist "contact.html" (
    echo ❌ Missing contact.html
    pause
    exit /b 1
)

if not exist "blog\index.html" (
    echo ❌ Missing blog\index.html
    pause
    exit /b 1
)

echo ✅ All required files present

REM Check for assets
if not exist "assets" (
    echo ⚠️  Warning: assets directory not found
) else (
    echo ✅ Assets directory found
)

REM Add all files
echo 📦 Adding files to git...
git add .

REM Check if there are changes to commit
git diff --staged --quiet
if errorlevel 1 (
    REM Commit changes
    echo 💾 Committing changes...
    set /p commit_message="Enter commit message (or press Enter for default): "
    if "%commit_message%"=="" (
        set commit_message=Update portfolio website - %date% %time%
    )
    git commit -m "%commit_message%"
    echo ✅ Changes committed
) else (
    echo ℹ️  No changes to commit
)

REM Push to GitHub
echo 🚀 Pushing to GitHub...
git push origin main
if errorlevel 1 (
    echo ❌ Failed to push to GitHub
    echo Please check your internet connection and repository permissions
    pause
    exit /b 1
)

echo ✅ Successfully pushed to GitHub!

REM Get repository information
for /f "tokens=*" %%i in ('git remote get-url origin') do set repo_url=%%i

echo.
echo 🎉 Deployment Complete!
echo ======================================
echo Your portfolio will be available at your GitHub Pages URL
echo.
echo 📝 Next steps:
echo 1. Wait 5-10 minutes for GitHub Pages to build
echo 2. Check your repository settings to enable GitHub Pages if not already done
echo 3. Visit your GitHub Pages URL to see your live website
echo.
echo 🔧 To enable GitHub Pages:
echo 1. Go to your repository on GitHub
echo 2. Click Settings ^> Pages
echo 3. Select 'Deploy from a branch'
echo 4. Choose 'main' branch and '/ (root)' folder
echo 5. Click Save

pause