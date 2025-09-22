# CV Download File Reference Issue

## 🚨 Issue Identified

There are **inconsistent CV file references** in the `index.html` file that will cause broken download links.

## 📋 Current Status

### File System
- **Actual file**: `assets/documents/DD.pdf` ✅ **EXISTS**
- **Expected file**: `assets/documents/Dineshraj_Dhanapathy_CV.pdf` ❌ **MISSING**

### HTML References in index.html

#### Hero Section (Line ~267)
```html
<a href="assets/documents/DD.pdf" class="btn btn--accent" 
   download="Dineshraj_Dhanapathy_CV.pdf"
   aria-describedby="download-cv-desc">
```
- **Link**: `assets/documents/DD.pdf` ✅ **WORKS** (file exists)
- **Download name**: `Dineshraj_Dhanapathy_CV.pdf` ✅ **GOOD**

#### About Section (Line ~395-396)
```html
<a href="assets/documents/Dineshraj_Dhanapathy_CV.pdf"
   class="btn btn--primary btn--large" 
   download="Dineshraj_Dhanapathy_CV.pdf"
   aria-label="Download Dineshraj Dhanapathy's CV in PDF format">
```
- **Link**: `assets/documents/Dineshraj_Dhanapathy_CV.pdf` ❌ **BROKEN** (file doesn't exist)
- **Download name**: `Dineshraj_Dhanapathy_CV.pdf` ✅ **GOOD**

## 🔧 Solutions

### Option 1: Rename the PDF file (Recommended)
```bash
# Rename the actual file to match the expected filename
mv "assets/documents/DD.pdf" "assets/documents/Dineshraj_Dhanapathy_CV.pdf"
```

**Pros**: 
- More professional filename
- Matches the download attribute
- No HTML changes needed for about section

**Cons**: 
- Need to update hero section link

### Option 2: Update the about section link
```html
<!-- Change this line in about section -->
<a href="assets/documents/DD.pdf"
   class="btn btn--primary btn--large" 
   download="Dineshraj_Dhanapathy_CV.pdf"
   aria-label="Download Dineshraj Dhanapathy's CV in PDF format">
```

**Pros**: 
- Minimal change
- Keeps existing file

**Cons**: 
- Less professional filename (`DD.pdf`)
- Inconsistent with download attribute

## 🎯 Recommended Action

**Rename the file** to `Dineshraj_Dhanapathy_CV.pdf` and update the hero section link:

1. **Rename file**:
   ```bash
   mv "portfolio-website/assets/documents/DD.pdf" "portfolio-website/assets/documents/Dineshraj_Dhanapathy_CV.pdf"
   ```

2. **Update hero section link** in `index.html`:
   ```html
   <!-- Change from: -->
   <a href="assets/documents/DD.pdf" class="btn btn--accent" download="Dineshraj_Dhanapathy_CV.pdf"
   
   <!-- Change to: -->
   <a href="assets/documents/Dineshraj_Dhanapathy_CV.pdf" class="btn btn--accent" download="Dineshraj_Dhanapathy_CV.pdf"
   ```

## 🧪 Testing After Fix

1. **Test hero section download**: Click "Download CV" button in hero section
2. **Test about section download**: Click "Download My CV" button in about section
3. **Verify filename**: Ensure downloaded file is named `Dineshraj_Dhanapathy_CV.pdf`
4. **Check console**: No 404 errors for CV file requests

## 📅 Priority

**HIGH** - This affects user experience and professional presentation. Users clicking the about section CV download will get a 404 error.

---

*Issue identified: January 2025*
*Status: Needs immediate attention*