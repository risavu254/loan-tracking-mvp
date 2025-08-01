# Firebase Hosting Deployment Guide

## Prerequisites

### 1. Install Node.js
- Go to [https://nodejs.org/](https://nodejs.org/)
- Download and install the LTS version
- Restart your terminal/command prompt

### 2. Install Firebase CLI
```bash
npm install -g firebase-tools
```

### 3. Login to Firebase
```bash
firebase login
```

## Deployment Steps

### Step 1: Verify Firebase Configuration
Your project is already configured with:
- `firebase.json` - Hosting configuration
- `.firebaserc` - Project ID: `loan-tracking-system-7c607`

### Step 2: Deploy to Firebase Hosting
```bash
firebase deploy --only hosting
```

### Step 3: Get Your Hosted Domain
After successful deployment, you'll get:
- **Primary Domain**: `https://loan-tracking-system-7c607.web.app`
- **Custom Domain**: `https://loan-tracking-system-7c607.firebaseapp.com`

## Adding Authorized Domains

### Step 1: Go to Firebase Console
1. Visit [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Select your project: `loan-tracking-system-7c607`

### Step 2: Configure Authentication
1. Go to **Authentication** in the left sidebar
2. Click on **Settings** tab
3. Scroll down to **Authorized domains**

### Step 3: Add Your Hosted Domain
Add these domains to the authorized list:
- `loan-tracking-system-7c607.web.app`
- `loan-tracking-system-7c607.firebaseapp.com`

## Testing Your Deployment

### Step 1: Test the Hosted Site
1. Visit your hosted domain
2. Test the login functionality
3. Verify all features work correctly

### Step 2: Update Your Code
After deployment, update your Firebase configuration to use the hosted domain:

```javascript
// In firebase-config.js
const authorizedDomains = [
  'localhost',
  '127.0.0.1',
  'loan-tracking-system-7c607.firebaseapp.com',
  'loan-tracking-system-7c607.web.app'
];
```

## Development Workflow

### For Local Development:
- Continue using `127.0.0.1` or `localhost`
- Use mock authentication for faster development

### For Production:
- Deploy changes: `firebase deploy --only hosting`
- Test on hosted domain
- Use real Firebase authentication

## Troubleshooting

### If deployment fails:
1. Check if you're logged in: `firebase login`
2. Verify project: `firebase projects:list`
3. Check configuration: `firebase use --add`

### If authentication doesn't work:
1. Verify authorized domains in Firebase Console
2. Check browser console for errors
3. Ensure Firebase configuration is correct

## Next Steps

After successful deployment:
1. Test all functionality on the hosted domain
2. Update any hardcoded localhost URLs
3. Consider setting up a custom domain
4. Configure SSL certificates (automatic with Firebase)

## Useful Commands

```bash
# Deploy only hosting
firebase deploy --only hosting

# Deploy everything
firebase deploy

# View deployment history
firebase hosting:channel:list

# Create preview channel
firebase hosting:channel:deploy preview

# Serve locally
firebase serve --only hosting
``` 