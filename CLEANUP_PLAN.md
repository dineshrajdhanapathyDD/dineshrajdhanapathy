# Comprehensive Cleanup Plan

## 🗑️ FILES TO DELETE IMMEDIATELY

### Debug/Test Files
- `blog-debug.html` ❌ DELETE
- `blog-test.html` ❌ DELETE  
- `blog-working-test.html` ❌ DELETE
- `test.html` ❌ DELETE
- `debug.html` ❌ DELETE
- `BLOG_FIXED_VERIFICATION.html` ❌ DELETE

### Temporary Documentation Files
- `BLOG_FINAL_FIX.md` ❌ DELETE
- `BLOG_FIX_SUMMARY.md` ❌ DELETE
- `BLOG_IMPLEMENTATION_SUMMARY.md` ❌ DELETE
- `BLOG_LAYOUT_SIMPLIFICATION.md` ❌ DELETE
- `BLOG_TROUBLESHOOTING.md` ❌ DELETE
- `PRODUCTION_DEPLOYMENT_REPORT.md` ❌ DELETE
- `using-kiro-for-web-development.md` ❌ DELETE

### Jekyll Files (Not Needed for Static Site)
- `_config.yml` ❌ DELETE
- `_config_performance.yml` ❌ DELETE
- `Gemfile` ❌ DELETE
- `feed.xml` ❌ DELETE
- `feed.json` ❌ DELETE

### Jekyll Directories
- `_includes/` ❌ DELETE ENTIRE FOLDER
- `_layouts/` ❌ DELETE ENTIRE FOLDER
- `_plugins/` ❌ DELETE ENTIRE FOLDER
- `_posts/` ❌ DELETE ENTIRE FOLDER
- `_scripts/` ❌ DELETE ENTIRE FOLDER
- `_templates/` ❌ DELETE ENTIRE FOLDER
- `_test/` ❌ DELETE ENTIRE FOLDER

## 📁 FILES TO MOVE TO DOCS FOLDER

Move these to `docs/` folder:
- `STRUCTURE_SUMMARY.md` → `docs/STRUCTURE_SUMMARY.md`

## ✅ FILES TO KEEP IN ROOT (Core Pages & Config)

### Core HTML Pages
- `index.html` ✅ KEEP
- `projects.html` ✅ KEEP
- `contact.html` ✅ KEEP
- `certification-roadmap.html` ✅ KEEP
- `resume-match.html` ✅ KEEP
- `404.html` ✅ KEEP
- `offline.html` ✅ KEEP

### Configuration Files
- `README.md` ✅ KEEP
- `robots.txt` ✅ KEEP
- `sitemap.xml` ✅ KEEP
- `site.webmanifest` ✅ KEEP
- `sw.js` ✅ KEEP
- `.gitignore` ✅ KEEP
- `.nojekyll` ✅ KEEP

### Directories to Keep
- `assets/` ✅ KEEP
- `blog/` ✅ KEEP
- `common/` ✅ KEEP
- `docs/` ✅ KEEP
- `.git/` ✅ KEEP
- `.github/` ✅ KEEP

## 🎯 FINAL CLEAN STRUCTURE

After cleanup, root should only have:
```
portfolio-website/
├── 📄 CORE PAGES (8 files)
│   ├── index.html
│   ├── projects.html
│   ├── contact.html
│   ├── certification-roadmap.html
│   ├── resume-match.html
│   ├── 404.html
│   ├── offline.html
│   └── README.md
│
├── 📄 CONFIG FILES (5 files)
│   ├── robots.txt
│   ├── sitemap.xml
│   ├── site.webmanifest
│   ├── sw.js
│   └── .gitignore
│
└── 📁 DIRECTORIES (6 folders)
    ├── assets/
    ├── blog/
    ├── common/
    ├── docs/
    ├── .git/
    └── .github/
```

**TOTAL ROOT FILES: 13 files + 6 directories = 19 items**
**CURRENT ROOT FILES: 30+ files + 14 directories = 44+ items**

**REDUCTION: 25+ items removed from root!**