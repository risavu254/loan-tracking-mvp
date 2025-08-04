# 🚀 Deployment Workflow Guide

## How Changes Go Live

### 1. **Development in Cursor**
```bash
# Make your changes in Cursor
# Save files (Ctrl+S)
```

### 2. **Commit and Push to GitHub**
```bash
# In Cursor terminal or your preferred Git client:
git add .
git commit -m "Your change description"
git push origin main
```

### 3. **Netlify Auto-Deploy**
- Netlify watches your GitHub repository
- When you push changes, it automatically triggers a new deploy
- Build process runs: `node build.js`
- Environment variables are injected
- Site goes live with your changes

## 🔧 **Testing Process**

### **Step 1: Test Locally**
```bash
# Run a local server to test
python -m http.server 8000
# or
npx serve public
```

### **Step 2: Test Current Setup**
1. **Current API keys are in the temporary config**
2. **Test basic functionality**
3. **Check if Firebase connects properly**

### **Step 3: Deploy to Test**
1. Push changes to GitHub
2. Check Netlify build logs
3. Test the live site

## ⚠️ **Important Notes**

### **Before Production:**
1. **Regenerate Firebase API keys** (old ones were exposed)
2. **Set environment variables in Netlify**
3. **Remove temporary config file**
4. **Update security rules**

### **Current Status:**
- ✅ Code is secure (no hardcoded keys in main files)
- ✅ Build process is ready
- ✅ Netlify configuration is set
- ⚠️ Using temporary config for testing
- ⚠️ Need to regenerate API keys

## 🧪 **Testing Commands**

### **Test Build Process:**
```bash
node build.js
```

### **Test Local Server:**
```bash
cd public
python -m http.server 8000
# Then visit http://localhost:8000
```

### **Check Netlify Deploy:**
1. Go to Netlify dashboard
2. Check "Deploys" tab
3. Look for build logs
4. Test the live URL 